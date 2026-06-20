import { describe, expect, it } from "vitest";
import {
  AdventureAlmanacExportPreviewSchema,
  AttractionSchema,
  AuditMetadataSchema,
  ConfidenceMetadataSchema,
  DayGuideImportSchema,
  DayGuideSchema,
  EnrichmentSectionSchema,
  ItineraryDaySchema,
  ItineraryImportSchema,
  MemoryEntrySchema,
  PortEnrichmentImportSchema,
  PortSchema,
  SailingSchema,
  SailingShellImportSchema,
  ShipEnrichmentImportSchema,
  ShipSchema,
  ShorePlanSchema,
  WeatherSnapshotSchema,
} from "../schemas";
import {
  illustrativeConfidence,
  sampleAlmanacPreview,
  sampleAttractionRecords,
  sampleAudit,
  sampleDayGuideRecord,
  sampleEnrichmentSection,
  sampleItineraryDayRecord,
  sampleMemoryEntry,
  samplePortRecord,
  sampleSailingRecord,
  sampleShipRecord,
  sampleShorePlanRecords,
  sampleWeatherRecord,
} from "../data/sampleSchemaData";

const importHeader = { schemaVersion: 1, importedAt: "2026-06-20T12:00:00.000Z", sampleOnly: true } as const;

describe("shared metadata schemas", () => {
  it("accepts valid audit and confidence metadata", () => {
    expect(AuditMetadataSchema.parse(sampleAudit)).toEqual(sampleAudit);
    expect(ConfidenceMetadataSchema.parse(illustrativeConfidence)).toEqual(illustrativeConfidence);
  });

  it.each([
    ["confidence", { ...illustrativeConfidence, confidence: "certain" }],
    ["review status", { ...illustrativeConfidence, reviewStatus: "approved" }],
  ])("rejects an invalid protected %s", (_label, value) => {
    expect(ConfidenceMetadataSchema.safeParse(value).success).toBe(false);
  });
});

describe("canonical sample records", () => {
  it("validates the Sun Princess sailing and itinerary day", () => {
    expect(SailingSchema.safeParse(sampleSailingRecord).success).toBe(true);
    expect(ItineraryDaySchema.safeParse(sampleItineraryDayRecord).success).toBe(true);
  });

  it("validates reusable ship, port and attraction records", () => {
    expect(ShipSchema.safeParse(sampleShipRecord).success).toBe(true);
    expect(PortSchema.safeParse(samplePortRecord).success).toBe(true);
    sampleAttractionRecords.forEach((attraction) => expect(AttractionSchema.safeParse(attraction).success).toBe(true));
  });

  it("validates all three sailing-specific Naples shore plans", () => {
    sampleShorePlanRecords.forEach((plan) => expect(ShorePlanSchema.safeParse(plan).success).toBe(true));
  });

  it("validates the Today guide and illustrative weather", () => {
    expect(DayGuideSchema.safeParse(sampleDayGuideRecord).success).toBe(true);
    expect(WeatherSnapshotSchema.safeParse(sampleWeatherRecord).success).toBe(true);
  });

  it("validates enrichment and memory export groundwork", () => {
    expect(EnrichmentSectionSchema.safeParse(sampleEnrichmentSection).success).toBe(true);
    expect(MemoryEntrySchema.safeParse(sampleMemoryEntry).success).toBe(true);
    expect(AdventureAlmanacExportPreviewSchema.safeParse(sampleAlmanacPreview).success).toBe(true);
  });

  it("rejects invalid protected entity enum values", () => {
    expect(SailingSchema.safeParse({ ...sampleSailingRecord, status: "confirmed" }).success).toBe(false);
    expect(ShorePlanSchema.safeParse({ ...sampleShorePlanRecords[0], returnRisk: "manageable" }).success).toBe(false);
  });
});

describe("versioned import shells", () => {
  const validImports = [
    SailingShellImportSchema.safeParse({ kind: "sailing_shell", header: importHeader, sailing: sampleSailingRecord }),
    ItineraryImportSchema.safeParse({ kind: "itinerary", header: importHeader, sailingId: sampleSailingRecord.id, days: [sampleItineraryDayRecord] }),
    ShipEnrichmentImportSchema.safeParse({ kind: "ship_enrichment", header: importHeader, ship: sampleShipRecord, sections: [sampleEnrichmentSection] }),
    PortEnrichmentImportSchema.safeParse({ kind: "port_enrichment", header: importHeader, port: samplePortRecord, attractions: sampleAttractionRecords, sections: [] }),
    DayGuideImportSchema.safeParse({ kind: "day_guide", header: importHeader, dayGuide: sampleDayGuideRecord }),
  ];

  it("accepts simple well-formed payloads", () => {
    validImports.forEach((result) => expect(result.success).toBe(true));
  });

  it("rejects malformed or unversioned payloads", () => {
    expect(SailingShellImportSchema.safeParse({ kind: "sailing_shell", sailing: sampleSailingRecord }).success).toBe(false);
    expect(ItineraryImportSchema.safeParse({ kind: "itinerary", header: importHeader, sailingId: sampleSailingRecord.id, days: [] }).success).toBe(false);
  });
});
