import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { createImportPreview } from "../features/import-export/importPreviewService";
import { getSampleImport } from "../features/import-export/sampleImports";

describe("import preview service", () => {
  beforeEach(async () => { await db.delete(); await db.open(); await seedSampleData(); });

  it.each([
    ["sailing_shell", "Sailing"], ["itinerary", "Sailing itinerary"], ["ship_enrichment", "Reusable ship guidebook"], ["port_enrichment", "Reusable port guidebook"], ["day_guide", "Sailing-specific itinerary day"],
  ] as const)("produces a valid %s preview", async (type, targetType) => {
    const before = await db.table(type === "itinerary" ? "itineraryDays" : type === "day_guide" ? "dayGuides" : type === "ship_enrichment" ? "ships" : type === "port_enrichment" ? "ports" : "sailings").count();
    const preview = await createImportPreview(getSampleImport(type), type);
    expect(preview.status).toBe("valid");
    expect(preview.targetType).toBe(targetType);
    expect(preview.previewOnly).toBe(true);
    expect(preview.warnings.length).toBeGreaterThan(0);
    expect(await db.table(type === "itinerary" ? "itineraryDays" : type === "day_guide" ? "dayGuides" : type === "ship_enrichment" ? "ships" : type === "port_enrichment" ? "ports" : "sailings").count()).toBe(before);
  });

  it("returns a parse error for malformed JSON", async () => {
    expect((await createImportPreview('{ "kind":', "sailing_shell")).status).toBe("parse_error");
  });

  it("returns field-level errors for structurally invalid JSON", async () => {
    const result = await createImportPreview(JSON.stringify({ kind: "sailing_shell", header: {} }), "sailing_shell");
    expect(result.status).toBe("invalid");
    expect(result.errors.some((error) => error.fieldPath?.includes("schemaVersion"))).toBe(true);
  });

  it("detects the selected import type mismatch", async () => {
    const result = await createImportPreview(getSampleImport("itinerary"), "sailing_shell");
    expect(result.status).toBe("type_mismatch");
    expect(result.detectedImportType).toBe("itinerary");
  });

  it("flags protected itinerary fields without changing them", async () => {
    const original = await db.itineraryDays.get("day-02-naples");
    const result = await createImportPreview(getSampleImport("itinerary"), "itinerary");
    expect(result.protectedFieldImpacts.map((impact) => impact.fieldPath)).toContain("allAboardTime");
    expect(await db.itineraryDays.get("day-02-naples")).toEqual(original);
  });

  it("preserves enrichment trust signals in warnings", async () => {
    const result = await createImportPreview(getSampleImport("ship_enrichment"), "ship_enrichment");
    expect(result.warnings.some((warning) => warning.fieldPath === "confidence.reviewStatus")).toBe(true);
    expect(result.warnings.some((warning) => warning.fieldPath === "confidence.refreshRecommended")).toBe(true);
  });
});

