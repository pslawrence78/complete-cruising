import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { createImportPreview, enrichmentReturnSchemaImportMap, importTypeOptions } from "../features/import-export/importPreviewService";
import { createEnrichmentRequest, createPrompt } from "../features/enrichment-requests/enrichmentRequestService";
import { expectedReturnSchemas } from "../features/enrichment-requests/expectedReturnSchemas";
import { enrichmentRequestDefinitions, enrichmentRequestTypes, returnSchemaByRequestType } from "../features/enrichment-requests/enrichmentRequestTypes";

describe("enrichment request service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-enrichment-${crypto.randomUUID()}`);
    await seedSampleData(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it.each(enrichmentRequestTypes)("generates request JSON for %s", async (requestType) => {
    const request = await createEnrichmentRequest({ requestType, now: new Date("2026-06-28T00:00:00.000Z") }, database);
    expect(request.schema).toBe("complete-cruising-enrichment-request-v1");
    expect(request.expectedReturn.schema).toBe(returnSchemaByRequestType[requestType]);
    expect(JSON.stringify(request)).not.toMatch(/passport|paymentCard|insurancePolicyNumber|bookingReference|cabinNumber/i);
  });

  it.each(enrichmentRequestTypes)("generates guarded copy-ready prompt for %s", async (requestType) => {
    const prompt = await createPrompt({ requestType, now: new Date("2026-06-28T00:00:00.000Z") }, database);
    expect(prompt).toContain("Return one complete JSON object only.");
    expect(prompt).toContain("Use British English");
    expect(prompt).toContain("Preserve confidence, review and refresh metadata");
    expect(prompt).toContain("save it as a .json file before importing if needed");
    expect(prompt).toContain(expectedReturnSchemas[returnSchemaByRequestType[requestType]]);
  });

  it("supports ship and port pack selectors in request contracts", async () => {
    const ship = await createEnrichmentRequest({ requestType: "ship_pack_enrichment", shipPackType: "ship_dining" }, database);
    const port = await createEnrichmentRequest({ requestType: "port_pack_enrichment", portPackType: "port_cruise_logistics" }, database);
    expect(ship.task.packType).toBe("ship_dining");
    expect(port.task.packType).toBe("port_cruise_logistics");
  });

  it("defines request-type-driven filter enablement from the shared catalogue", () => {
    expect(enrichmentRequestDefinitions.find((definition) => definition.requestType === "sailing_shell_enrichment")?.filters).toMatchObject({
      sailing: "optional",
      port: "disabled",
      day: "disabled",
      ship: "disabled",
      pack: "disabled",
    });
    expect(enrichmentRequestDefinitions.find((definition) => definition.requestType === "ship_pack_enrichment")?.filters).toMatchObject({
      ship: "required",
      pack: "required",
      port: "disabled",
      day: "disabled",
    });
    expect(enrichmentRequestDefinitions.find((definition) => definition.requestType === "shore_plan_generation")?.filters).toMatchObject({
      sailing: "required",
      day: "required",
      port: "optional",
      ship: "disabled",
    });
  });

  it("keeps request and import options in parity across all six governed types", () => {
    expect(enrichmentRequestDefinitions).toHaveLength(6);
    expect(importTypeOptions).toHaveLength(6);
    expect(importTypeOptions.map((option) => option.value)).toContain("shore_plan");
    expect(enrichmentRequestDefinitions.map((definition) => definition.importType)).toEqual(importTypeOptions.map((option) => option.value));
  });

  it("recognises governed return schema names through mapped import routes", async () => {
    expect(enrichmentReturnSchemaImportMap["complete-cruising-day-guide-generation-v1"]).toBe("day_guide");
    expect(enrichmentReturnSchemaImportMap["complete-cruising-shore-plan-generation-v1"]).toBe("shore_plan");
    const preview = await createImportPreview(JSON.stringify({
      schema: "complete-cruising-ship-pack-enrichment-v1",
      schemaVersion: 1,
      sourceApp: "ChatGPT",
      generatedAt: "2026-06-29T09:30:00+01:00",
      target: { shipId: null, shipName: "Sun Princess", cruiseLineName: "Princess Cruises", sailingId: null },
      pack: { packType: "ship_dining", title: "Ship dining", scope: ["Ship"], exclusions: ["None"] },
      provenance: {},
      enrichmentRun: {
        id: "enrichment-run-ship-pack-test",
        name: "Ship dining enrichment",
        targetType: "ship",
        targetName: "Sun Princess",
        enrichmentPackType: "ship_dining",
        status: "generated",
        sourceTypesUsed: ["researched"],
        validationWarnings: [],
        notes: "Fixture",
      },
      section: {
        id: "section-ship-pack-test",
        parentType: "ship",
        parentId: null,
        sectionType: "ship_dining",
        title: "Dining guide",
        shortSummary: "Fixture",
        confidence: {
          confidence: "medium",
          reviewStatus: "needs_user_review",
          sourceType: "researched",
          sourceSummary: "Fixture",
          lastReviewedAt: null,
          refreshRecommended: true,
          refreshReason: "Fixture",
          validFrom: null,
          validUntil: null,
        },
      },
      importAdvice: { safeToImport: true, requiresUserReview: true, recommendedImportType: "ship_enrichment" },
    }), "ship_enrichment", database);
    expect(preview.status).toBe("invalid");
    expect(preview.detectedImportType).toBe("ship_enrichment");
    expect(preview.errors[0].code).toBe("missing_target");
  });
});
