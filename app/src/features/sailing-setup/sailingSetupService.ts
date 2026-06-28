import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import { db } from "../../db/completeCruisingDb";
import type { ConfidenceMetadata, Country, CruiseLine, ItineraryDayRecord, Port, Sailing, Ship } from "../../types";

export type SetupDayType = "embarkation" | "port" | "sea" | "scenic_cruising" | "overnight_port" | "disembarkation";
export type SetupTenderStatus = "unknown" | "likely" | "confirmed" | "not_applicable";

export interface SailingSetupItineraryDayInput {
  dayNumber: number;
  date: string;
  dayType: SetupDayType;
  portName?: string;
  countryName?: string;
  arrivalTime?: string;
  departureTime?: string;
  allAboardTime?: string;
  tenderStatus?: SetupTenderStatus;
  notes?: string;
  userConfirmed?: boolean;
}

export interface SailingSetupInput {
  sailingName: string;
  routeSummary?: string;
  status: Sailing["status"];
  notes?: string;
  cruiseLineName: string;
  cruiseLineDisplayName?: string;
  shipName: string;
  shipNotes?: string;
  departureDate: string;
  returnDate: string;
  voyageCode?: string;
  embarkationPortName?: string;
  disembarkationPortName?: string;
  itineraryDays: SailingSetupItineraryDayInput[];
}

export interface SailingSetupResult {
  sailing: Sailing;
  cruiseLine: CruiseLine;
  ship: Ship;
  itineraryDays: ItineraryDayRecord[];
  reused: {
    cruiseLine: boolean;
    ship: boolean;
    ports: string[];
  };
}

const normalise = (value: string) => value.trim().replace(/\s+/g, " ");
const slugify = (value: string) =>
  normalise(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);

const nowIso = () => new Date().toISOString();
const optional = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

function audit() {
  const now = nowIso();
  return { createdAt: now, updatedAt: now, createdBy: "user", updatedBy: "user" };
}

export function userEnteredConfidence(userConfirmed = false, sourceSummary = "Entered manually in Create sailing."): ConfidenceMetadata {
  return {
    confidence: userConfirmed ? "confirmed" : "medium",
    reviewStatus: userConfirmed ? "reviewed" : "needs_user_review",
    sourceType: "user_entered",
    sourceSummary,
    lastReviewedAt: userConfirmed ? nowIso() : undefined,
    refreshRecommended: !userConfirmed,
    refreshReason: userConfirmed
      ? "User marked this setup data as confirmed."
      : "Manual setup data should be checked against cruise line material before travel.",
  };
}

export function calculateNights(departureDate: string, returnDate: string) {
  const start = Date.parse(`${departureDate}T00:00:00Z`);
  const end = Date.parse(`${returnDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.round((end - start) / 86_400_000);
}

function addDays(date: string, offset: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

export function generateItineraryRowsFromDates(departureDate: string, returnDate: string): SailingSetupItineraryDayInput[] {
  const nights = calculateNights(departureDate, returnDate);
  if (!nights && departureDate !== returnDate) return [];
  return Array.from({ length: nights + 1 }, (_, index) => {
    const dayNumber = index + 1;
    const finalDay = index === nights;
    return {
      dayNumber,
      date: addDays(departureDate, index),
      dayType: dayNumber === 1 ? "embarkation" : finalDay ? "disembarkation" : "port",
      portName: "",
      countryName: "",
      arrivalTime: "",
      departureTime: "",
      allAboardTime: "",
      tenderStatus: finalDay ? "not_applicable" : "unknown",
      userConfirmed: false,
    };
  });
}

export function applyPortLabelsToRows(rows: SailingSetupItineraryDayInput[], labelsText: string): SailingSetupItineraryDayInput[] {
  const labels = labelsText.split(/\r?\n|,/).map((value) => value.trim()).filter(Boolean);
  return rows.map((row, index) => {
    const label = labels[index];
    if (!label) return row;
    const lower = label.toLowerCase();
    if (lower === "sea" || lower === "sea day" || lower === "at sea") return { ...row, dayType: "sea", portName: "", tenderStatus: "not_applicable" };
    return { ...row, portName: label, dayType: row.dayType === "embarkation" || row.dayType === "disembarkation" ? row.dayType : "port" };
  });
}

export function summariseSetup(input: SailingSetupInput) {
  const portDays = input.itineraryDays.filter((day) => day.dayType === "port" || day.dayType === "overnight_port").length;
  const seaDays = input.itineraryDays.filter((day) => day.dayType === "sea" || day.dayType === "scenic_cruising").length;
  const missingFields = [
    !optional(input.routeSummary) ? "Route summary" : undefined,
    !optional(input.voyageCode) ? "Voyage code" : undefined,
    input.itineraryDays.some((day) => (day.dayType === "port" || day.dayType === "overnight_port") && !optional(day.portName)) ? "Port names for every port day" : undefined,
    input.itineraryDays.some((day) => !optional(day.arrivalTime) && (day.dayType === "port" || day.dayType === "overnight_port")) ? "Arrival times for some port days" : undefined,
    input.itineraryDays.some((day) => !optional(day.allAboardTime) && (day.dayType === "port" || day.dayType === "overnight_port")) ? "All-aboard times for some port days" : undefined,
  ].filter(Boolean) as string[];

  return {
    nights: calculateNights(input.departureDate, input.returnDate),
    itineraryDayCount: input.itineraryDays.length,
    portDays,
    seaDays,
    missingFields,
  };
}

async function findByName<T extends { id: string; name: string }>(table: { toArray: () => Promise<T[]> }, name: string): Promise<T | undefined> {
  const target = normalise(name).toLowerCase();
  return (await table.toArray()).find((record) => record.name.trim().toLowerCase() === target);
}

async function ensureCountry(countryName: string | undefined, database: CompleteCruisingDb) {
  const name = optional(countryName) ?? "Country to confirm";
  const existing = await findByName<Country>(database.countries, name);
  if (existing) return existing;
  const country = {
    id: `country-${slugify(name) || "to-confirm"}`,
    name,
    confidence: userEnteredConfidence(false, "Country name entered during itinerary setup or left as to confirm."),
    audit: audit(),
  };
  await database.countries.put(country);
  return country;
}

async function ensurePort(portName: string, countryName: string | undefined, database: CompleteCruisingDb) {
  const existing = await findByName<Port>(database.ports, portName);
  if (existing) return { port: existing, reused: true };
  const country = await ensureCountry(countryName, database);
  const port: Port = {
    id: `port-${slugify(portName)}`,
    name: normalise(portName),
    countryId: country.id,
    portType: "unknown",
    returnRiskDefault: "unknown",
    confidence: userEnteredConfidence(false, "Reusable port shell created from manual sailing setup."),
    audit: audit(),
  };
  await database.ports.put(port);
  return { port, reused: false };
}

export async function createSailingShell(input: SailingSetupInput, database: CompleteCruisingDb = db): Promise<SailingSetupResult> {
  const cruiseLineName = normalise(input.cruiseLineName);
  const shipName = normalise(input.shipName);
  const sailingId = `sailing-${slugify(input.sailingName)}-${Date.now().toString(36)}`;

  return database.transaction("rw", [database.cruiseLines, database.ships, database.sailings, database.countries, database.ports, database.itineraryDays, database.appSettings], async () => {
    const existingLine = await findByName<CruiseLine>(database.cruiseLines, cruiseLineName);
    const cruiseLine: CruiseLine = existingLine ?? {
      id: `cruise-line-${slugify(cruiseLineName)}`,
      name: cruiseLineName,
      shortName: optional(input.cruiseLineDisplayName),
      confidence: userEnteredConfidence(false, "Cruise line shell created from manual sailing setup."),
      audit: audit(),
    };
    if (!existingLine) await database.cruiseLines.put(cruiseLine);

    const ships = await database.ships.toArray();
    const existingShip = ships.find((ship) => ship.name.trim().toLowerCase() === shipName.toLowerCase() && ship.cruiseLineId === cruiseLine.id);
    const ship: Ship = existingShip ?? {
      id: `ship-${slugify(shipName)}`,
      cruiseLineId: cruiseLine.id,
      name: shipName,
      shipOverview: optional(input.shipNotes),
      confidence: userEnteredConfidence(false, "Ship shell created from manual sailing setup."),
      audit: audit(),
    };
    if (!existingShip) await database.ships.put(ship);

    const embarkation = optional(input.embarkationPortName)
      ? await ensurePort(input.embarkationPortName!, undefined, database)
      : undefined;
    const disembarkation = optional(input.disembarkationPortName)
      ? await ensurePort(input.disembarkationPortName!, undefined, database)
      : undefined;

    const sailing: Sailing = {
      id: sailingId,
      name: normalise(input.sailingName),
      cruiseLineId: cruiseLine.id,
      shipId: ship.id,
      status: input.status,
      departureDate: input.departureDate,
      returnDate: input.returnDate,
      voyageCode: optional(input.voyageCode),
      routeSummary: optional(input.routeSummary),
      notes: optional(input.notes),
      embarkationPortId: embarkation?.port.id,
      disembarkationPortId: disembarkation?.port.id,
      enrichmentStatus: "not_started",
      confidence: userEnteredConfidence(false, "Sailing shell created manually by the user."),
      audit: audit(),
    };
    await database.sailings.put(sailing);

    const reusedPorts: string[] = [];
    const itineraryDays: ItineraryDayRecord[] = [];
    for (const row of [...input.itineraryDays].sort((a, b) => a.dayNumber - b.dayNumber)) {
      const hasPort = optional(row.portName) && ["embarkation", "port", "overnight_port", "disembarkation"].includes(row.dayType);
      const portLookup = hasPort ? await ensurePort(row.portName!, row.countryName, database) : undefined;
      if (portLookup?.reused) reusedPorts.push(portLookup.port.name);
      const day: ItineraryDayRecord = {
        id: `${sailingId}-day-${String(row.dayNumber).padStart(2, "0")}`,
        sailingId,
        dayNumber: row.dayNumber,
        date: row.date,
        dayType: row.dayType,
        title: portLookup?.port.name ?? (row.dayType === "sea" ? "At sea" : row.dayType.replaceAll("_", " ")),
        portId: portLookup?.port.id,
        arrivalTime: optional(row.arrivalTime),
        departureTime: optional(row.departureTime),
        allAboardTime: optional(row.allAboardTime),
        tenderStatus: row.tenderStatus ?? (hasPort ? "unknown" : "not_applicable"),
        familyNotes: optional(row.notes),
        confidence: userEnteredConfidence(row.userConfirmed, row.userConfirmed ? "User marked this itinerary row as confirmed." : "Itinerary row entered manually and awaiting verification."),
        audit: audit(),
      };
      itineraryDays.push(day);
    }
    await database.itineraryDays.bulkPut(itineraryDays);
    await database.appSettings.put({ id: "setting-active-sailing", key: "activeSailingId", value: sailing.id, audit: audit() });

    return {
      sailing,
      cruiseLine,
      ship,
      itineraryDays,
      reused: {
        cruiseLine: Boolean(existingLine),
        ship: Boolean(existingShip),
        ports: Array.from(new Set(reusedPorts)),
      },
    };
  });
}
