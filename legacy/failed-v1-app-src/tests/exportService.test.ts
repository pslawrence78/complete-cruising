import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { createAdventureAlmanacDraftExport, createFullBackupExport, createSailingExport } from "../features/import-export/exportService";
import { safeFilenamePart } from "../features/import-export/filenameUtils";
import { SailingSchema, ItineraryDaySchema } from "../schemas";
import { sampleAudit, sampleSailingRecord } from "../data/sampleSchemaData";

describe("export service", () => {
  let database: CompleteCruisingDb;
  const now = new Date("2026-06-27T10:30:00.000Z");

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-export-${crypto.randomUUID()}`);
    await seedSampleData(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("creates a full backup with schema metadata and local tables", async () => {
    const generated = await createFullBackupExport(database, now);
    const payload = generated.payload as any;

    expect(generated.filename).toBe("complete-cruising-full-backup-2026-06-27.json");
    expect(payload).toMatchObject({
      schema: "complete-cruising-full-backup",
      schemaVersion: 1,
      sourceApp: "Complete Cruising",
      createdAt: now.toISOString(),
      exportType: "full-backup",
    });
    expect(payload.data.sailings).toHaveLength(1);
    expect(payload.data.importBatches).toEqual([]);
    expect(payload.data.adventureAlmanacExports).toHaveLength(1);
  });

  it("creates a sailing export with linked records only", async () => {
    const otherSailing = SailingSchema.parse({
      ...sampleSailingRecord,
      id: "sailing-other",
      name: "Other Sailing",
      departureDate: "2026-09-01",
      returnDate: "2026-09-02",
      audit: sampleAudit,
    });
    const otherDay = ItineraryDaySchema.parse({
      id: "day-other",
      sailingId: "sailing-other",
      dayNumber: 1,
      date: "2026-09-01",
      dayType: "sea",
      title: "Other sea day",
      audit: sampleAudit,
    });
    await database.sailings.put(otherSailing);
    await database.itineraryDays.put(otherDay);

    const generated = await createSailingExport(sampleSailingRecord.id, database, now);
    const payload = generated.payload as any;

    expect(payload.schema).toBe("complete-cruising-sailing-export");
    expect(payload.sailingId).toBe(sampleSailingRecord.id);
    expect(payload.data.sailing.name).toBe("Sun Princess Mediterranean 2026");
    expect(payload.data.itineraryDays).toHaveLength(15);
    expect(payload.data.itineraryDays.some((day: any) => day.id === "day-other")).toBe(false);
    expect(payload.data.ports.some((port: any) => port.id === "port-naples")).toBe(true);
  });

  it("creates a draft Adventure Almanac export without fabricating real memories", async () => {
    const generated = await createAdventureAlmanacDraftExport(sampleSailingRecord.id, database, now);
    const payload = generated.payload as any;

    expect(payload).toMatchObject({
      schema: "adventure-almanac-cruise-draft",
      schemaVersion: 1,
      exportType: "adventure-almanac-draft",
      status: "draft",
    });
    expect(payload.data.tripType).toBe("cruise");
    expect(payload.data.dailyEntries).toHaveLength(15);
    expect(payload.data.dailyEntries.every((entry: any) => entry.memoryStatus === "missing")).toBe(true);
    expect(payload.data.dailyEntries.every((entry: any) => entry.sebFavourite === "")).toBe(true);
  });

  it("sanitises export filename fragments predictably", () => {
    expect(safeFilenamePart("Sun Princess: Mediterranean 2026!")).toBe("sun-princess-mediterranean-2026");
  });
});
