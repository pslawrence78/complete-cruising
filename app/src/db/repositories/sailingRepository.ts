import { db, type CompleteCruisingDb } from "../completeCruisingDb";
import { getActiveSailingId } from "./appSettingsRepository";

export const getAllSailings = (database: CompleteCruisingDb = db) => database.sailings.orderBy("departureDate").toArray();
export const getSailingById = (id: string, database: CompleteCruisingDb = db) => database.sailings.get(id);

export async function getActiveSailing(database: CompleteCruisingDb = db) {
  const id = await getActiveSailingId(database);
  return id ? database.sailings.get(id) : undefined;
}

export async function getSailingOverview(id: string, database: CompleteCruisingDb = db) {
  const sailing = await database.sailings.get(id);
  if (!sailing) return undefined;
  const [ship, cruiseLine] = await Promise.all([
    database.ships.get(sailing.shipId),
    database.cruiseLines.get(sailing.cruiseLineId),
  ]);
  return { sailing, ship, cruiseLine };
}

