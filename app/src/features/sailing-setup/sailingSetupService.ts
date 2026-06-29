import type { CompleteCruisingDb } from "../../db/completeCruisingDb";
import { db } from "../../db/completeCruisingDb";
import type { ConfidenceMetadata, Country, CruiseLine, ItineraryDayRecord, Port, Sailing, Ship } from "../../types";
import { getActiveSailingId, setActiveSailingId } from "../../db/repositories/appSettingsRepository";

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

export interface SailingDeleteGuardrail {
  allowed: boolean;
  reason?: string;
  relatedRecordCounts: {
    itineraryDays: number;
    shorePlans: number;
    dayGuides: number;
    weatherSnapshots: number;
    memories: number;
    familyNotes: number;
    enrichmentRuns: number;
    enrichmentSections: number;
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

async function ensureCruiseLine(input: SailingSetupInput, database: CompleteCruisingDb) {
  const cruiseLineName = normalise(input.cruiseLineName);
  const existingLine = await findByName<CruiseLine>(database.cruiseLines, cruiseLineName);
  const now = nowIso();
  const cruiseLine: CruiseLine = existingLine
    ? {
      ...existingLine,
      shortName: optional(input.cruiseLineDisplayName) ?? existingLine.shortName,
      audit: {
        ...existingLine.audit,
        updatedAt: now,
        updatedBy: "user",
      },
    }
    : {
      id: `cruise-line-${slugify(cruiseLineName)}`,
      name: cruiseLineName,
      shortName: optional(input.cruiseLineDisplayName),
      confidence: userEnteredConfidence(false, "Cruise line shell created from manual sailing setup."),
      audit: audit(),
    };
  await database.cruiseLines.put(cruiseLine);
  return { cruiseLine, reused: Boolean(existingLine) };
}

async function ensureShip(input: SailingSetupInput, cruiseLineId: string, database: CompleteCruisingDb) {
  const shipName = normalise(input.shipName);
  const ships = await database.ships.toArray();
  const existingShip = ships.find((ship) => ship.name.trim().toLowerCase() === shipName.toLowerCase() && ship.cruiseLineId === cruiseLineId);
  const now = nowIso();
  const ship: Ship = existingShip
    ? {
      ...existingShip,
      shipOverview: optional(input.shipNotes) ?? existingShip.shipOverview,
      audit: {
        ...existingShip.audit,
        updatedAt: now,
        updatedBy: "user",
      },
    }
    : {
      id: `ship-${slugify(shipName)}`,
      cruiseLineId,
      name: shipName,
      shipOverview: optional(input.shipNotes),
      confidence: userEnteredConfidence(false, "Ship shell created from manual sailing setup."),
      audit: audit(),
    };
  await database.ships.put(ship);
  return { ship, reused: Boolean(existingShip) };
}

function updateAudit(existingAudit: Sailing["audit"], archivedAt?: string) {
  const now = nowIso();
  return {
    ...existingAudit,
    updatedAt: now,
    updatedBy: "user",
    archivedAt,
  };
}

export async function createSailingShell(input: SailingSetupInput, database: CompleteCruisingDb = db): Promise<SailingSetupResult> {
  const sailingId = `sailing-${slugify(input.sailingName)}-${Date.now().toString(36)}`;

  return database.transaction("rw", [database.cruiseLines, database.ships, database.sailings, database.countries, database.ports, database.itineraryDays, database.appSettings], async () => {
    const { cruiseLine, reused: reusedCruiseLine } = await ensureCruiseLine(input, database);
    const { ship, reused: reusedShip } = await ensureShip(input, cruiseLine.id, database);

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
        cruiseLine: reusedCruiseLine,
        ship: reusedShip,
        ports: Array.from(new Set(reusedPorts)),
      },
    };
  });
}

export async function loadSailingShellInput(sailingId: string, database: CompleteCruisingDb = db): Promise<SailingSetupInput> {
  const sailing = await database.sailings.get(sailingId);
  if (!sailing) throw new Error("That sailing could not be found locally.");
  const [cruiseLine, ship, itineraryDays, ports, countries] = await Promise.all([
    database.cruiseLines.get(sailing.cruiseLineId),
    database.ships.get(sailing.shipId),
    database.itineraryDays.where("sailingId").equals(sailing.id).sortBy("dayNumber"),
    database.ports.toArray(),
    database.countries.toArray(),
  ]);
  const portsById = new Map(ports.map((port) => [port.id, port]));
  const countriesById = new Map(countries.map((country) => [country.id, country]));

  return {
    sailingName: sailing.name,
    routeSummary: sailing.routeSummary ?? "",
    status: sailing.status,
    notes: sailing.notes ?? "",
    cruiseLineName: cruiseLine?.name ?? "",
    cruiseLineDisplayName: cruiseLine?.shortName ?? "",
    shipName: ship?.name ?? "",
    shipNotes: ship?.shipOverview ?? "",
    departureDate: sailing.departureDate,
    returnDate: sailing.returnDate,
    voyageCode: sailing.voyageCode ?? "",
    embarkationPortName: sailing.embarkationPortId ? portsById.get(sailing.embarkationPortId)?.name ?? "" : "",
    disembarkationPortName: sailing.disembarkationPortId ? portsById.get(sailing.disembarkationPortId)?.name ?? "" : "",
    itineraryDays: itineraryDays.map((day) => ({
      dayNumber: day.dayNumber,
      date: day.date,
      dayType: day.dayType,
      portName: day.portId ? portsById.get(day.portId)?.name ?? "" : "",
      countryName: day.portId ? countriesById.get(portsById.get(day.portId)?.countryId ?? "")?.name ?? "" : "",
      arrivalTime: day.arrivalTime,
      departureTime: day.departureTime,
      allAboardTime: day.allAboardTime,
      tenderStatus: day.tenderStatus,
      notes: day.familyNotes,
      userConfirmed: day.confidence?.confidence === "confirmed",
    })),
  };
}

export async function updateSailingShell(
  sailingId: string,
  input: SailingSetupInput,
  database: CompleteCruisingDb = db,
): Promise<SailingSetupResult> {
  const existingSailing = await database.sailings.get(sailingId);
  if (!existingSailing) throw new Error("That sailing could not be found locally.");
  const existingDays = await database.itineraryDays.where("sailingId").equals(sailingId).sortBy("dayNumber");
  if (input.itineraryDays.length < existingDays.length) {
    throw new Error("Existing itinerary rows stay in place during shell management to avoid accidental loss of local day records. Archive the sailing instead if the shell should be retired.");
  }

  return database.transaction("rw", [database.cruiseLines, database.ships, database.sailings, database.countries, database.ports, database.itineraryDays], async () => {
    const { cruiseLine, reused: reusedCruiseLine } = await ensureCruiseLine(input, database);
    const { ship, reused: reusedShip } = await ensureShip(input, cruiseLine.id, database);
    const embarkation = optional(input.embarkationPortName)
      ? await ensurePort(input.embarkationPortName!, undefined, database)
      : undefined;
    const disembarkation = optional(input.disembarkationPortName)
      ? await ensurePort(input.disembarkationPortName!, undefined, database)
      : undefined;

    const sailing: Sailing = {
      ...existingSailing,
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
      audit: updateAudit(existingSailing.audit, input.status === "archived" ? existingSailing.audit.archivedAt ?? nowIso() : undefined),
    };
    await database.sailings.put(sailing);

    const reusedPorts: string[] = [];
    const itineraryDays: ItineraryDayRecord[] = [];
    for (const [index, row] of [...input.itineraryDays].sort((a, b) => a.dayNumber - b.dayNumber).entries()) {
      const existingDay = existingDays[index];
      const hasPort = optional(row.portName) && ["embarkation", "port", "overnight_port", "disembarkation"].includes(row.dayType);
      const portLookup = hasPort ? await ensurePort(row.portName!, row.countryName, database) : undefined;
      if (portLookup?.reused) reusedPorts.push(portLookup.port.name);
      const day: ItineraryDayRecord = {
        ...existingDay,
        id: existingDay?.id ?? `${sailingId}-day-${String(index + 1).padStart(2, "0")}`,
        sailingId,
        dayNumber: index + 1,
        date: row.date,
        dayType: row.dayType,
        title: portLookup?.port.name ?? (row.dayType === "sea" ? "At sea" : row.dayType.replaceAll("_", " ")),
        portId: portLookup?.port.id,
        arrivalTime: optional(row.arrivalTime),
        departureTime: optional(row.departureTime),
        allAboardTime: optional(row.allAboardTime),
        tenderStatus: row.tenderStatus ?? (hasPort ? "unknown" : "not_applicable"),
        familyNotes: optional(row.notes),
        confidence: userEnteredConfidence(row.userConfirmed, row.userConfirmed ? "User marked this itinerary row as confirmed." : "Itinerary row edited manually and awaiting verification."),
        audit: existingDay ? updateAudit(existingDay.audit, existingDay.audit.archivedAt) : audit(),
      };
      itineraryDays.push(day);
    }

    await database.itineraryDays.bulkPut(itineraryDays);

    return {
      sailing,
      cruiseLine,
      ship,
      itineraryDays,
      reused: {
        cruiseLine: reusedCruiseLine,
        ship: reusedShip,
        ports: Array.from(new Set(reusedPorts)),
      },
    };
  });
}

export async function getSailingDeleteGuardrail(sailingId: string, database: CompleteCruisingDb = db): Promise<SailingDeleteGuardrail> {
  const relatedRecordCounts = {
    itineraryDays: await database.itineraryDays.where("sailingId").equals(sailingId).count(),
    shorePlans: await database.shorePlans.where("sailingId").equals(sailingId).count(),
    dayGuides: await database.dayGuides.where("sailingId").equals(sailingId).count(),
    weatherSnapshots: await database.weatherSnapshots.where("sailingId").equals(sailingId).count(),
    memories: await database.memoryEntries.where("sailingId").equals(sailingId).count(),
    familyNotes: await database.familyNotes.where("sailingId").equals(sailingId).count(),
    enrichmentRuns: await database.enrichmentRuns.where("targetEntityId").equals(sailingId).count(),
    enrichmentSections: await database.enrichmentSections.where("entityId").equals(sailingId).count(),
  };
  const hasRelatedRecords = Object.values(relatedRecordCounts).some((count) => count > 0);
  return hasRelatedRecords
    ? {
      allowed: false,
      reason: "Delete remains blocked because this sailing already has linked local records. Archive it instead so guidebook, itinerary and enrichment work is not lost silently.",
      relatedRecordCounts,
    }
    : {
      allowed: true,
      relatedRecordCounts,
    };
}

export async function archiveSailing(sailingId: string, database: CompleteCruisingDb = db) {
  const sailing = await database.sailings.get(sailingId);
  if (!sailing) throw new Error("That sailing could not be found locally.");
  const archivedAt = nowIso();
  const archived = {
    ...sailing,
    status: "archived" as const,
    audit: updateAudit(sailing.audit, archivedAt),
  };
  await database.sailings.put(archived);

  const activeSailingId = await getActiveSailingId(database);
  if (activeSailingId === sailingId) {
    const nextActive = (await database.sailings.orderBy("departureDate").toArray()).find((candidate) => candidate.id !== sailingId && candidate.status !== "archived");
    if (nextActive) await setActiveSailingId(nextActive.id, database);
  }

  return archived;
}

export async function deleteSailingSafely(sailingId: string, database: CompleteCruisingDb = db) {
  const sailing = await database.sailings.get(sailingId);
  if (!sailing) throw new Error("That sailing could not be found locally.");
  const guardrail = await getSailingDeleteGuardrail(sailingId, database);
  if (!guardrail.allowed) throw new Error(guardrail.reason ?? "Delete is not allowed for this sailing.");

  await database.transaction("rw", [database.sailings, database.appSettings], async () => {
    await database.sailings.delete(sailingId);
    const activeSailingId = await getActiveSailingId(database);
    if (activeSailingId === sailingId) {
      const nextActive = (await database.sailings.orderBy("departureDate").toArray()).find((candidate) => candidate.id !== sailingId && candidate.status !== "archived");
      if (nextActive) await setActiveSailingId(nextActive.id, database);
    }
  });
}
