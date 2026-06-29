import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { createImportPreview } from "../features/import-export/importPreviewService";
import { getSampleImport } from "../features/import-export/sampleImports";
import { sampleSailingRecord } from "../data/sampleSchemaData";
import {
  dayGuideGenerationReturn,
  itineraryVerificationReturn,
  portPackEnrichmentReturn,
  sailingShellEnrichmentReturn,
  shipPackEnrichmentReturn,
  shorePlanGenerationReturn,
} from "./enrichmentReturnFixtures";

describe("import preview service", () => {
  beforeEach(async () => { await db.delete(); await db.open(); await seedSampleData(); });

  it.each([
    ["sailing_shell", "Sailing"], ["itinerary", "Sailing itinerary"], ["ship_enrichment", "Reusable ship guidebook"], ["port_enrichment", "Reusable port guidebook"], ["day_guide", "Sailing-specific itinerary day"], ["shore_plan", "Sailing-specific shore plan"],
  ] as const)("produces a valid %s preview", async (type, targetType) => {
    const before = await db.table(type === "itinerary" ? "itineraryDays" : type === "day_guide" ? "dayGuides" : type === "ship_enrichment" ? "ships" : type === "port_enrichment" ? "ports" : type === "shore_plan" ? "shorePlans" : "sailings").count();
    const preview = await createImportPreview(getSampleImport(type), type);
    expect(preview.status).toBe("valid");
    expect(preview.targetType).toBe(targetType);
    expect(preview.previewOnly).toBe(true);
    expect(preview.warnings.length).toBeGreaterThan(0);
    expect(await db.table(type === "itinerary" ? "itineraryDays" : type === "day_guide" ? "dayGuides" : type === "ship_enrichment" ? "ships" : type === "port_enrichment" ? "ports" : type === "shore_plan" ? "shorePlans" : "sailings").count()).toBe(before);
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
    const result = await createImportPreview(JSON.stringify(sailingShellEnrichmentReturn()), "sailing_shell");
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
    const payload = sailingShellEnrichmentReturn() as any;
    payload.target.sailingId = "missing-sailing";
    const result = await createImportPreview(JSON.stringify(payload), "sailing_shell");
    expect(result.status).toBe("invalid");
    expect(result.errors[0]).toMatchObject({ code: "missing_target_sailing", fieldPath: "target.sailingId" });
  });

  it("previews all governed enrichment return schemas through their supported import routes", async () => {
    const itinerary = await createImportPreview(JSON.stringify(itineraryVerificationReturn()), "itinerary");
    const ship = await createImportPreview(JSON.stringify(shipPackEnrichmentReturn()), "ship_enrichment");
    const port = await createImportPreview(JSON.stringify(portPackEnrichmentReturn()), "port_enrichment");
    const dayGuide = await createImportPreview(JSON.stringify(dayGuideGenerationReturn()), "day_guide");
    const shorePlan = await createImportPreview(JSON.stringify(shorePlanGenerationReturn()), "shore_plan");

    expect(itinerary.status).toBe("valid");
    expect(ship.status).toBe("valid");
    expect(port.status).toBe("valid");
    expect(dayGuide.status).toBe("valid");
    expect(shorePlan.status).toBe("valid");
    expect(shorePlan.recordsToCreate).toContain("shore-plan-return-balanced");
  });

  it("reports an invalid schema name clearly", async () => {
    const result = await createImportPreview(JSON.stringify({ schema: "complete-cruising-unknown-v1" }), "sailing_shell");
    expect(result.status).toBe("invalid");
    expect(result.errors[0].code).toBe("invalid_schema_name");
  });

  it("blocks mapped returns when a required target is missing", async () => {
    const payload = shorePlanGenerationReturn() as any;
    payload.target.itineraryDayId = null;
    const result = await createImportPreview(JSON.stringify(payload), "shore_plan");

    expect(result.status).toBe("invalid");
    expect(result.errors[0]).toMatchObject({ code: "missing_target", fieldPath: "target.itineraryDayId" });
  });

  it("surfaces missing required metadata from mapped return schemas", async () => {
    const payload = shipPackEnrichmentReturn();
    delete (payload.section as Partial<typeof payload.section>).confidence;
    const result = await createImportPreview(JSON.stringify(payload), "ship_enrichment");

    expect(result.status).toBe("invalid");
    expect(result.errors.some((error) => error.fieldPath?.includes("section.confidence"))).toBe(true);
  });

  it("preserves protected-field warnings from itinerary verification returns", async () => {
    const result = await createImportPreview(JSON.stringify(itineraryVerificationReturn()), "itinerary");

    expect(result.status).toBe("valid");
    expect(result.warnings.some((warning) => warning.code === "protected_field_warning")).toBe(true);
    expect(result.protectedFieldImpacts.map((impact) => impact.fieldPath)).toContain("allAboardTime");
  });
});
