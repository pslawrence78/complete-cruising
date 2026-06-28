import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { createImportPreview, enrichmentReturnSchemaImportMap } from "../features/import-export/importPreviewService";
import { createEnrichmentRequest, createPrompt } from "../features/enrichment-requests/enrichmentRequestService";
import { expectedReturnSchemas } from "../features/enrichment-requests/expectedReturnSchemas";
import { enrichmentRequestTypes, returnSchemaByRequestType } from "../features/enrichment-requests/enrichmentRequestTypes";

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
    expect(prompt).toContain("Return JSON only");
    expect(prompt).toContain("Use British English");
    expect(prompt).toContain("Preserve confidence, review and refresh metadata");
    expect(prompt).toContain(expectedReturnSchemas[returnSchemaByRequestType[requestType]]);
  });

  it("supports ship and port pack selectors in request contracts", async () => {
    const ship = await createEnrichmentRequest({ requestType: "ship_pack_enrichment", shipPackType: "ship_dining" }, database);
    const port = await createEnrichmentRequest({ requestType: "port_pack_enrichment", portPackType: "port_cruise_logistics" }, database);
    expect(ship.task.packType).toBe("ship_dining");
    expect(port.task.packType).toBe("port_cruise_logistics");
  });

  it("recognises new return schema names without silently committing unsupported shapes", async () => {
    expect(enrichmentReturnSchemaImportMap["complete-cruising-day-guide-generation-v1"]).toBe("day_guide");
    const preview = await createImportPreview(JSON.stringify({
      schema: "complete-cruising-ship-pack-enrichment-v1",
      schemaVersion: 1,
      sourceApp: "ChatGPT",
    }), "ship_enrichment", database);
    expect(preview.status).toBe("invalid");
    expect(preview.detectedImportType).toBe("ship_enrichment");
    expect(preview.errors[0].code).toBe("unsupported_return_schema");
  });
});
