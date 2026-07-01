import { db, type CompleteCruisingDb } from "../completeCruisingDb";

export const getAllPorts = (database: CompleteCruisingDb = db) => database.ports.orderBy("name").toArray();
export const getPortById = (id: string, database: CompleteCruisingDb = db) => database.ports.get(id);
export const getAttractionsForPort = (portId: string, database: CompleteCruisingDb = db) => database.attractions.where("portId").equals(portId).toArray();
export const getPortEnrichmentSections = (portId: string, database: CompleteCruisingDb = db) =>
  database.enrichmentSections.where("[entityType+entityId]").equals(["port", portId]).toArray();

export async function getPortGuideBundle(portId: string, database: CompleteCruisingDb = db) {
  const [port, attractions, enrichmentSections] = await Promise.all([
    getPortById(portId, database),
    getAttractionsForPort(portId, database),
    getPortEnrichmentSections(portId, database),
  ]);
  if (!port) return undefined;
  const country = await database.countries.get(port.countryId);
  return { port, country, attractions, enrichmentSections };
}

