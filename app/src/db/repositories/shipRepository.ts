import { db, type CompleteCruisingDb } from "../completeCruisingDb";

export const getShipById = (id: string, database: CompleteCruisingDb = db) => database.ships.get(id);
export const getShipGuideById = getShipById;
export const getShipEnrichmentSections = (shipId: string, database: CompleteCruisingDb = db) =>
  database.enrichmentSections.where("[entityType+entityId]").equals(["ship", shipId]).toArray();

