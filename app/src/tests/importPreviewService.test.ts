import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { createImportPreview } from "../features/import-export/importPreviewService";
import { getSampleImport } from "../features/import-export/sampleImports";
import { sampleSailingRecord } from "../data/sampleSchemaData";

function sailingShellEnrichmentPayload(sailingId: string = sampleSailingRecord.id) {
  return {
    schema: "complete-cruising-sailing-shell-enrichment-v1",
    schemaVersion: 1,
    sourceApp: "ChatGPT",
    generatedAt: "2026-06-28T12:30:00+01:00",
    target: { sailingId, sailingName: "Sun Princess Mediterranean 2026", shipName: "Sun Princess", cruiseLineName: "Princess Cruises" },
    provenance: { userEnteredFieldsUsed: ["sailing.id"] },
    enrichmentRun: {
      id: "enrichment-run-sailing-shell-test",
      name: "Sailing shell enrichment",
      targetType: "sailing",
      targetName: "Sun Princess Mediterranean 2026",
      enrichmentPackType: "sailing_shell_enrichment",
      status: "generated",
      sourceTypesUsed: ["user_entered", "inferred"],
      validationWarnings: ["Do not treat this enrichment as booking confirmation."],
      notes: "Sailing-level context only.",
    },
    sailingEnrichment: { planningSummary: "Context only." },
    sections: [{
      id: "section-sailing-shell-test",
      parentType: "sailing",
      parentId: sailingId,
      sectionType: "sailing_planning_summary",
      title: "Sailing planning summary",
      shortSummary: "Planning context that does not confirm operational timing.",
      structuredFacts: [{ label: "Planning status", value: "Needs review", origin: "inferred" }],
      practicalGuidance: ["Keep protected fields unchanged."],
      familyRelevance: ["Useful for route planning."],
      watchouts: ["No port times are confirmed."],
      suggestedNextActions: ["Verify Princess material before day planning."],
      confidence: {
        confidence: "medium",
        reviewStatus: "needs_user_review",
        sourceType: "inferred",
        sourceSummary: "Generated from a local sailing shell.",
        lastReviewedAt: null,
        refreshRecommended: true,
        refreshReason: "Refresh after official itinerary confirmation.",
        validFrom: null,
        validUntil: null,
      },
    }],
    importAdvice: {
      safeToImport: true,
      requiresUserReview: true,
      protectedFieldWarnings: ["This JSON must not overwrite voyage code, sailing dates, itinerary rows or port times."],
      recommendedImportType: "sailing_shell",
    },
  };
}

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

  it("previews recognised sailing shell enrichment as committable context", async () => {
    const result = await createImportPreview(JSON.stringify(sailingShellEnrichmentPayload()), "sailing_shell");
    expect(result.status).toBe("valid");
    expect(result.schema).toBe("complete-cruising-sailing-shell-enrichment-v1");
    expect(result.targetType).toBe("Sailing-level context enrichment");
    expect(result.recordsToCreate).toContain("enrichment-run-sailing-shell-test");
    expect(result.recordsToCreate).toContain("section-sailing-shell-test");
    expect(result.protectedFieldImpacts).toHaveLength(0);
    expect(result.warnings.some((warning) => warning.fieldPath?.startsWith("enrichmentRun.validationWarnings"))).toBe(true);
    expect(result.warnings.some((warning) => warning.fieldPath?.startsWith("importAdvice.protectedFieldWarnings"))).toBe(true);
  });

  it("blocks sailing shell enrichment when the target sailing does not exist", async () => {
    const result = await createImportPreview(JSON.stringify(sailingShellEnrichmentPayload("missing-sailing")), "sailing_shell");
    expect(result.status).toBe("invalid");
    expect(result.errors[0]).toMatchObject({ code: "missing_target_sailing", fieldPath: "target.sailingId" });
  });
});
