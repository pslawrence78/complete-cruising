import { getActiveSailingId } from "../../db/repositories";
import { db, type CompleteCruisingDb } from "../../db/completeCruisingDb";
import { exportDateStamp, safeFilenamePart } from "./filenameUtils";

const sourceApp = "Complete Cruising";

export interface GeneratedExport {
  filename: string;
  payload: unknown;
}

async function allTables(database: CompleteCruisingDb) {
  return {
    cruiseLines: await database.cruiseLines.toArray(),
    ships: await database.ships.toArray(),
    cabins: await database.cabins.toArray(),
    travellers: await database.travellers.toArray(),
    sailings: await database.sailings.toArray(),
    itineraryDays: await database.itineraryDays.toArray(),
    countries: await database.countries.toArray(),
    ports: await database.ports.toArray(),
    attractions: await database.attractions.toArray(),
    shorePlans: await database.shorePlans.toArray(),
    dayGuides: await database.dayGuides.toArray(),
    weatherSnapshots: await database.weatherSnapshots.toArray(),
    enrichmentRuns: await database.enrichmentRuns.toArray(),
    enrichmentSections: await database.enrichmentSections.toArray(),
    documentChecklists: await database.documentChecklists.toArray(),
    familyNotes: await database.familyNotes.toArray(),
    memoryEntries: await database.memoryEntries.toArray(),
    adventureAlmanacExports: await database.adventureAlmanacExports.toArray(),
    importBatches: await database.importBatches.toArray(),
    appSettings: await database.appSettings.toArray(),
  };
}

export async function createFullBackupExport(database: CompleteCruisingDb = db, now = new Date()): Promise<GeneratedExport> {
  return {
    filename: `complete-cruising-full-backup-${exportDateStamp(now)}.json`,
    payload: {
      schema: "complete-cruising-full-backup",
      schemaVersion: 1,
      sourceApp,
      createdAt: now.toISOString(),
      exportType: "full-backup",
      data: await allTables(database),
    },
  };
}

export async function resolveExportSailingId(database: CompleteCruisingDb = db) {
  return (await getActiveSailingId(database)) ?? (await database.sailings.orderBy("departureDate").first())?.id;
}

export async function createSailingExport(
  sailingId = "",
  database: CompleteCruisingDb = db,
  now = new Date(),
): Promise<GeneratedExport> {
  const resolvedSailingId = sailingId || await resolveExportSailingId(database);
  if (!resolvedSailingId) throw new Error("No active sailing is available to export.");
  const sailing = await database.sailings.get(resolvedSailingId);
  if (!sailing) throw new Error("The selected sailing could not be found.");

  const itineraryDays = await database.itineraryDays.where("sailingId").equals(sailing.id).sortBy("dayNumber");
  const itineraryDayIds = new Set(itineraryDays.map((day) => day.id));
  const portIds = new Set([
    sailing.embarkationPortId,
    sailing.disembarkationPortId,
    ...itineraryDays.map((day) => day.portId),
  ].filter((value): value is string => Boolean(value)));
  const ports = await database.ports.bulkGet([...portIds]);
  const includedPorts = ports.filter((port): port is NonNullable<typeof port> => Boolean(port));
  const countryIds = new Set(includedPorts.map((port) => port.countryId));
  const shorePlans = await database.shorePlans.where("sailingId").equals(sailing.id).toArray();
  const dayGuides = (await database.dayGuides.where("sailingId").equals(sailing.id).toArray())
    .filter((guide) => itineraryDayIds.has(guide.itineraryDayId));
  const weatherSnapshots = await database.weatherSnapshots.where("sailingId").equals(sailing.id).toArray();
  const familyNotes = await database.familyNotes.where("sailingId").equals(sailing.id).toArray();
  const memoryEntries = await database.memoryEntries.where("sailingId").equals(sailing.id).toArray();
  const travellers = sailing.travellerIds?.length
    ? (await database.travellers.bulkGet(sailing.travellerIds)).filter((traveller): traveller is NonNullable<typeof traveller> => Boolean(traveller))
    : (await database.travellers.toArray()).filter((traveller) => traveller.sailingIds?.includes(sailing.id));
  const cabin = sailing.cabinId ? await database.cabins.get(sailing.cabinId) : await database.cabins.where("sailingId").equals(sailing.id).first();
  const cruiseLine = await database.cruiseLines.get(sailing.cruiseLineId);
  const ship = await database.ships.get(sailing.shipId);
  const dayGuideIds = new Set(dayGuides.map((guide) => guide.id));
  const enrichmentSections = (await database.enrichmentSections.toArray()).filter((section) => {
    if (section.entityType === "sailing") return section.entityId === sailing.id;
    if (section.entityType === "ship") return section.entityId === sailing.shipId;
    if (section.entityType === "port") return portIds.has(section.entityId);
    if (section.entityType === "itinerary_day") return itineraryDayIds.has(section.entityId);
    if (section.entityType === "day_guide") return dayGuideIds.has(section.entityId);
    return false;
  });

  return {
    filename: `complete-cruising-sailing-${safeFilenamePart(sailing.name)}-${exportDateStamp(now)}.json`,
    payload: {
      schema: "complete-cruising-sailing-export",
      schemaVersion: 1,
      sourceApp,
      createdAt: now.toISOString(),
      exportType: "sailing",
      sailingId: sailing.id,
      data: {
        sailing,
        cruiseLine: cruiseLine ?? null,
        ship: ship ?? null,
        cabin: cabin ?? null,
        travellers,
        itineraryDays,
        ports: includedPorts,
        countries: (await database.countries.bulkGet([...countryIds])).filter((country): country is NonNullable<typeof country> => Boolean(country)),
        shorePlans,
        dayGuides,
        weatherSnapshots,
        familyNotes,
        memoryEntries,
        enrichmentSections,
      },
    },
  };
}

export async function createAdventureAlmanacDraftExport(
  sailingId = "",
  database: CompleteCruisingDb = db,
  now = new Date(),
): Promise<GeneratedExport> {
  const sailingExport = await createSailingExport(sailingId, database, now);
  const data = (sailingExport.payload as any).data;
  const portById = new Map(data.ports.map((port: any) => [port.id, port]));
  const countryById = new Map(data.countries.map((country: any) => [country.id, country]));
  const memoryByDay = new Map<string, any[]>();
  for (const memory of data.memoryEntries) {
    if (!memory.itineraryDayId || memory.sampleOnly) continue;
    memoryByDay.set(memory.itineraryDayId, [...(memoryByDay.get(memory.itineraryDayId) ?? []), memory]);
  }

  const dailyEntries = data.itineraryDays.map((day: any) => {
    const port = day.portId ? portById.get(day.portId) as any : undefined;
    const country = port ? countryById.get(port.countryId) as any : undefined;
    const memories = memoryByDay.get(day.id) ?? [];
    return {
      dayNumber: day.dayNumber,
      date: day.date,
      title: day.title ?? "",
      location: port?.name ?? day.title ?? "",
      country: country?.name ?? "",
      dayType: day.dayType,
      summary: memories.find((memory) => memory.type === "reflection")?.content ?? "",
      sebFavourite: memories.find((memory) => memory.type === "seb_favourite")?.content ?? "",
      familyHighlight: memories.find((memory) => memory.type === "family_highlight")?.content ?? "",
      photoPrompt: memories.find((memory) => memory.type === "photo")?.content ?? "",
      educationalNotes: [],
      memoryStatus: memories.length ? "draft" : "missing",
    };
  });

  const countriesVisited = [...new Set(dailyEntries.map((entry: any) => entry.country).filter(Boolean))];
  const portsVisited = [...new Set(data.ports.map((port: any) => port.name))];
  const payload = {
    schema: "adventure-almanac-cruise-draft",
    schemaVersion: 1,
    sourceApp,
    createdAt: now.toISOString(),
    exportType: "adventure-almanac-draft",
    status: "draft",
    data: {
      tripTitle: data.sailing.name,
      tripType: "cruise",
      startDate: data.sailing.departureDate,
      endDate: data.sailing.returnDate,
      cruiseLine: data.cruiseLine?.name ?? "",
      ship: data.ship?.name ?? "",
      routeSummary: `${data.sailing.departureDate} to ${data.sailing.returnDate}`,
      embarkationPort: (portById.get(data.sailing.embarkationPortId) as any)?.name ?? "",
      disembarkationPort: (portById.get(data.sailing.disembarkationPortId) as any)?.name ?? "",
      countriesVisited,
      portsVisited,
      travellers: data.travellers.map((traveller: any) => traveller.displayName),
      dailyEntries,
      familyHighlights: [],
      sebDiscovery: [],
      memoryPrompts: [],
      photoPrompts: [],
      notes: ["Draft only. Review before using in Adventure Almanac."],
    },
  };

  return {
    filename: `adventure-almanac-cruise-draft-${safeFilenamePart(data.sailing.name)}-${exportDateStamp(now)}.json`,
    payload,
  };
}
