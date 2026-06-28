import { createFullBackupExport } from "../import-export/exportService";
import { db, type CompleteCruisingDb } from "../../db/completeCruisingDb";
import { clearSampleData } from "../../db/resetDatabase";
import { ensureRealSunPrincessSailing, REAL_SUN_PRINCESS_SAILING_ID } from "../../db/realSailingOnboarding";
import { seedSampleData } from "../../db/seedDatabase";
import { getActiveSailingId } from "../../db/repositories";

export const DATA_MANAGEMENT_CONFIRMATIONS = {
  resetActiveSailing: "RESET ACTIVE SAILING",
  clearAll: "CLEAR COMPLETE CRUISING DATA",
  removeSample: "REMOVE SAMPLE DATA",
  seedReal: "SEED SUN PRINCESS 2026",
  seedSample: "RESEED SAMPLE DATA",
} as const;

export interface GuardedAction {
  confirmation: string;
  backupExported?: boolean;
}

function assertConfirmation(value: string, expected: string) {
  if (value.trim() !== expected) throw new Error(`Type ${expected} to continue.`);
}

function assertBackup(backupExported?: boolean) {
  if (!backupExported) throw new Error("Export a full local backup before making this destructive change.");
}

async function deleteSailingScopedData(sailingId: string, database: CompleteCruisingDb) {
  const dayIds = new Set((await database.itineraryDays.where("sailingId").equals(sailingId).toArray()).map((day) => day.id));
  await Promise.all([
    database.itineraryDays.where("sailingId").equals(sailingId).delete(),
    database.shorePlans.where("sailingId").equals(sailingId).delete(),
    database.dayGuides.where("sailingId").equals(sailingId).delete(),
    database.weatherSnapshots.where("sailingId").equals(sailingId).delete(),
    database.familyNotes.where("sailingId").equals(sailingId).delete(),
    database.memoryEntries.where("sailingId").equals(sailingId).delete(),
    database.documentChecklists.where("sailingId").equals(sailingId).delete(),
    database.adventureAlmanacExports.where("sailingId").equals(sailingId).delete(),
    database.enrichmentRuns.where("targetEntityId").equals(sailingId).delete(),
  ]);
  const sections = await database.enrichmentSections.toArray();
  await database.enrichmentSections.bulkDelete(sections
    .filter((section) =>
      (section.entityType === "sailing" && section.entityId === sailingId)
      || (section.entityType === "itinerary_day" && dayIds.has(section.entityId)))
    .map((section) => section.id));
}

export async function getDataManagementSummary(database: CompleteCruisingDb = db) {
  const [activeSailingId, sailings, itineraryDays, importBatches, enrichmentRuns] = await Promise.all([
    getActiveSailingId(database),
    database.sailings.toArray(),
    database.itineraryDays.toArray(),
    database.importBatches.toArray(),
    database.enrichmentRuns.toArray(),
  ]);
  const sampleSailings = sailings.filter((sailing) => sailing.sampleOnly);
  return {
    activeSailingId,
    realSailingPresent: sailings.some((sailing) => sailing.id === REAL_SUN_PRINCESS_SAILING_ID),
    realSailingIsActive: activeSailingId === REAL_SUN_PRINCESS_SAILING_ID,
    sailingCount: sailings.length,
    itineraryDayCount: itineraryDays.length,
    sampleSailingCount: sampleSailings.length,
    importBatchCount: importBatches.length,
    enrichmentRunCount: enrichmentRuns.length,
  };
}

export const createDataManagementBackup = createFullBackupExport;

export async function resetActiveSailing(action: GuardedAction, database: CompleteCruisingDb = db) {
  assertConfirmation(action.confirmation, DATA_MANAGEMENT_CONFIRMATIONS.resetActiveSailing);
  assertBackup(action.backupExported);
  const sailingId = await getActiveSailingId(database);
  if (!sailingId) throw new Error("No active sailing is selected.");
  await database.transaction("rw", database.tables, async () => {
    await deleteSailingScopedData(sailingId, database);
    await database.sailings.delete(sailingId);
    await database.appSettings.where("key").anyOf(["activeSailingId", "selectedTodayDayId"]).delete();
  });
  if (sailingId === REAL_SUN_PRINCESS_SAILING_ID) await ensureRealSunPrincessSailing(database);
}

export async function clearAllCompleteCruisingData(action: GuardedAction, database: CompleteCruisingDb = db) {
  assertConfirmation(action.confirmation, DATA_MANAGEMENT_CONFIRMATIONS.clearAll);
  assertBackup(action.backupExported);
  await clearSampleData(database);
}

export async function removeSampleData(action: GuardedAction, database: CompleteCruisingDb = db) {
  assertConfirmation(action.confirmation, DATA_MANAGEMENT_CONFIRMATIONS.removeSample);
  assertBackup(action.backupExported);
  const sampleRows = await Promise.all(database.tables.map(async (table) => ({
    table,
    keys: (await table.toArray()).filter((record: any) => record?.sampleOnly === true).map((record: any) => record.id),
  })));
  await database.transaction("rw", database.tables, async () => {
    await Promise.all(sampleRows.map(({ table, keys }) => keys.length ? table.bulkDelete(keys) : undefined));
  });
}

export async function reseedSampleData(action: GuardedAction, database: CompleteCruisingDb = db) {
  assertConfirmation(action.confirmation, DATA_MANAGEMENT_CONFIRMATIONS.seedSample);
  await seedSampleData(database);
}

export async function seedRealSunPrincess2026(action: GuardedAction, database: CompleteCruisingDb = db) {
  assertConfirmation(action.confirmation, DATA_MANAGEMENT_CONFIRMATIONS.seedReal);
  await ensureRealSunPrincessSailing(database);
}
