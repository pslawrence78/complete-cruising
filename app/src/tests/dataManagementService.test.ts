import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { ensureRealSunPrincessSailing, REAL_SUN_PRINCESS_SAILING_ID } from "../db/realSailingOnboarding";
import { seedSampleData } from "../db/seedDatabase";
import {
  clearAllCompleteCruisingData,
  DATA_MANAGEMENT_CONFIRMATIONS,
  getDataManagementSummary,
  removeSampleData,
  resetActiveSailing,
  seedRealSunPrincess2026,
} from "../features/data-management/dataManagementService";

describe("data management service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-data-management-${crypto.randomUUID()}`);
    await seedSampleData(database);
    await ensureRealSunPrincessSailing(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("summarises real, sample and imported local data categories", async () => {
    const summary = await getDataManagementSummary(database);
    expect(summary.realSailingPresent).toBe(true);
    expect(summary.realSailingIsActive).toBe(true);
    expect(summary.sampleSailingCount).toBe(1);
  });

  it("does not clear data without exact confirmation and backup acknowledgement", async () => {
    await expect(clearAllCompleteCruisingData({ confirmation: DATA_MANAGEMENT_CONFIRMATIONS.clearAll }, database)).rejects.toThrow(/backup/i);
    await expect(clearAllCompleteCruisingData({ confirmation: "CLEAR", backupExported: true }, database)).rejects.toThrow(/CLEAR COMPLETE CRUISING DATA/);
    expect(await database.sailings.count()).toBeGreaterThan(0);
  });

  it("removes sample data only after the guarded confirmation", async () => {
    await removeSampleData({ confirmation: DATA_MANAGEMENT_CONFIRMATIONS.removeSample, backupExported: true }, database);
    const summary = await getDataManagementSummary(database);
    expect(summary.sampleSailingCount).toBe(0);
    expect(summary.realSailingPresent).toBe(true);
  });

  it("resets the active real sailing and reseeds the real shell", async () => {
    await resetActiveSailing({ confirmation: DATA_MANAGEMENT_CONFIRMATIONS.resetActiveSailing, backupExported: true }, database);
    const days = await database.itineraryDays.where("sailingId").equals(REAL_SUN_PRINCESS_SAILING_ID).toArray();
    expect(await database.sailings.get(REAL_SUN_PRINCESS_SAILING_ID)).toBeTruthy();
    expect(days).toHaveLength(15);
  });

  it("can seed the real sailing through the guarded onboarding path", async () => {
    await clearAllCompleteCruisingData({ confirmation: DATA_MANAGEMENT_CONFIRMATIONS.clearAll, backupExported: true }, database);
    await seedRealSunPrincess2026({ confirmation: DATA_MANAGEMENT_CONFIRMATIONS.seedReal }, database);
    expect((await getDataManagementSummary(database)).realSailingIsActive).toBe(true);
  });
});
