import { db, type CompleteCruisingDb } from "../completeCruisingDb";
import { getActiveSailing } from "./sailingRepository";
import { getItineraryWithPorts, getTodayItineraryDay } from "./itineraryRepository";
import { getPortGuideBundle } from "./portRepository";

export async function getDashboardBundle(database: CompleteCruisingDb = db) {
  const sailing = await getActiveSailing(database);
  if (!sailing) return undefined;
  const [ship, cruiseLine, itinerary, documents, enrichment, memories, weather, shorePlans, dayGuides] = await Promise.all([
    database.ships.get(sailing.shipId),
    database.cruiseLines.get(sailing.cruiseLineId),
    getItineraryWithPorts(sailing.id, database),
    database.documentChecklists.where("sailingId").equals(sailing.id).toArray(),
    database.enrichmentSections.toArray(),
    database.memoryEntries.where("sailingId").equals(sailing.id).toArray(),
    database.weatherSnapshots.where("sailingId").equals(sailing.id).toArray(),
    database.shorePlans.where("sailingId").equals(sailing.id).toArray(),
    database.dayGuides.where("sailingId").equals(sailing.id).toArray(),
  ]);
  return { sailing, ship, cruiseLine, itinerary, documents, enrichment, memories, weather, shorePlans, dayGuides };
}

export async function getTodayGuideBundle(database: CompleteCruisingDb = db) {
  const sailing = await getActiveSailing(database);
  if (!sailing) return undefined;
  const day = await getTodayItineraryDay(sailing.id, database);
  if (!day) return { sailing };
  const [port, guide, weather, plans] = await Promise.all([
    day.portId ? database.ports.get(day.portId) : undefined,
    day.dayGuideId ? database.dayGuides.get(day.dayGuideId) : database.dayGuides.where("itineraryDayId").equals(day.id).first(),
    day.weatherSnapshotId
      ? database.weatherSnapshots.get(day.weatherSnapshotId)
      : database.weatherSnapshots.where("itineraryDayId").equals(day.id).sortBy("capturedAt").then((records) => records.at(-1)),
    database.shorePlans.where("itineraryDayId").equals(day.id).toArray(),
  ]);
  const country = port ? await database.countries.get(port.countryId) : undefined;
  return { sailing, day, port, country, guide, weather, plans };
}

export async function getActiveShipGuideBundle(database: CompleteCruisingDb = db) {
  const sailing = await getActiveSailing(database);
  if (!sailing) return undefined;
  const [ship, cruiseLine] = await Promise.all([
    database.ships.get(sailing.shipId),
    database.cruiseLines.get(sailing.cruiseLineId),
  ]);
  if (!ship) return { sailing, cruiseLine };
  const sections = await database.enrichmentSections.where("[entityType+entityId]").equals(["ship", ship.id]).toArray();
  return { sailing, ship, cruiseLine, sections };
}

export async function getActivePortGuideBundle(database: CompleteCruisingDb = db) {
  const today = await getTodayGuideBundle(database);
  if (!today?.day || !today.port) return today ? { sailing: today.sailing } : undefined;
  const [guide, weather] = await Promise.all([
    getPortGuideBundle(today.port.id, database),
    today.day.weatherSnapshotId
      ? database.weatherSnapshots.get(today.day.weatherSnapshotId)
      : database.weatherSnapshots.where("itineraryDayId").equals(today.day.id).sortBy("capturedAt").then((records) => records.at(-1)),
  ]);
  return { sailing: today.sailing, day: today.day, guide, weather };
}

export async function getActiveSailingMemoriesBundle(database: CompleteCruisingDb = db) {
  const today = await getTodayGuideBundle(database);
  if (!today) return undefined;
  const [entries, preview] = await Promise.all([
    database.memoryEntries.where("sailingId").equals(today.sailing.id).toArray(),
    database.adventureAlmanacExports.where("sailingId").equals(today.sailing.id).first(),
  ]);
  return { ...today, entries, preview };
}
