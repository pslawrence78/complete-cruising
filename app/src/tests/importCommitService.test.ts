import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { commitValidatedImport } from "../features/import-export/importCommitService";
import { createImportPreview } from "../features/import-export/importPreviewService";
import { getSampleImport } from "../features/import-export/sampleImports";
import { sampleSailingRecord } from "../data/sampleSchemaData";

function withDayGuideTitle(title: string) {
  const payload = JSON.parse(getSampleImport("day_guide"));
  payload.dayGuide.title = title;
  return JSON.stringify(payload);
}

function sailingShellEnrichmentPayload(summary = "Planning context that does not confirm operational timing.") {
  return {
    schema: "complete-cruising-sailing-shell-enrichment-v1",
    schemaVersion: 1,
    sourceApp: "ChatGPT",
    generatedAt: "2026-06-28T12:30:00+01:00",
    target: { sailingId: sampleSailingRecord.id, sailingName: sampleSailingRecord.name, shipName: "Sun Princess", cruiseLineName: "Princess Cruises" },
    provenance: { userEnteredFieldsUsed: ["sailing.id"] },
    enrichmentRun: {
      id: "enrichment-run-sailing-shell-test",
      name: "Sailing shell enrichment",
      targetType: "sailing",
      targetName: sampleSailingRecord.name,
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
      parentId: sampleSailingRecord.id,
      sectionType: "sailing_planning_summary",
      title: "Sailing planning summary",
      shortSummary: summary,
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

describe("import commit service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-import-commit-${crypto.randomUUID()}`);
    await seedSampleData(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("commits a valid preview and records an ImportBatch", async () => {
    const json = withDayGuideTitle("Naples: reviewed local day guide");
    const preview = await createImportPreview(json, "day_guide", database);
    const outcome = await commitValidatedImport(json, "day_guide", preview, false, database);

    expect(outcome.status).toBe("committed");
    expect(await database.dayGuides.get("day-guide-naples")).toMatchObject({ title: "Naples: reviewed local day guide" });
    const batches = await database.importBatches.toArray();
    expect(batches).toHaveLength(1);
    expect(batches[0]).toMatchObject({
      kind: "day_guide",
      status: "committed",
      recordsUpdated: 1,
      protectedFieldWarningCount: 0,
      protectedFieldsConfirmed: false,
    });
  });

  it("blocks invalid or unvalidated imports", async () => {
    const preview = await createImportPreview("{", "day_guide", database);
    const outcome = await commitValidatedImport("{", "day_guide", preview, false, database);
    expect(outcome.status).toBe("blocked");
    expect(await database.importBatches.count()).toBe(0);
  });

  it("requires explicit confirmation for protected-field overwrites", async () => {
    const json = getSampleImport("itinerary");
    const preview = await createImportPreview(json, "itinerary", database);
    expect(preview.protectedFieldImpacts.length).toBeGreaterThan(0);

    const blocked = await commitValidatedImport(json, "itinerary", preview, false, database);
    expect(blocked.status).toBe("blocked");
    expect(await database.importBatches.count()).toBe(0);

    const committed = await commitValidatedImport(json, "itinerary", preview, true, database);
    expect(committed.status).toBe("committed");
    expect((await database.importBatches.toArray())[0].protectedFieldsConfirmed).toBe(true);
  });

  it("preserves created audit metadata while updating import metadata", async () => {
    const before = await database.dayGuides.get("day-guide-naples");
    const json = withDayGuideTitle("Naples: audit-preserving update");
    const preview = await createImportPreview(json, "day_guide", database);
    await commitValidatedImport(json, "day_guide", preview, false, database);
    const after = await database.dayGuides.get("day-guide-naples");

    expect(after?.audit.createdAt).toBe(before?.audit.createdAt);
    expect(after?.audit.createdBy).toBe(before?.audit.createdBy);
    expect(after?.audit.updatedBy).toBe("import");
    expect(after?.confidence.reviewStatus).toBe("needs_user_review");
    expect(after?.confidence.refreshRecommended).toBe(true);
  });

  it("uses a transaction so a failed audit write does not leave partial imports", async () => {
    const before = await database.dayGuides.get("day-guide-naples");
    database.importBatches.hook("creating", () => {
      throw new Error("audit write failed");
    });
    const json = withDayGuideTitle("Naples: should roll back");
    const preview = await createImportPreview(json, "day_guide", database);
    const outcome = await commitValidatedImport(json, "day_guide", preview, false, database);

    expect(outcome.status).toBe("failed");
    expect(await database.dayGuides.get("day-guide-naples")).toEqual(before);
  });

  it("commits sailing shell enrichment without changing protected sailing or itinerary records", async () => {
    const sailingBefore = await database.sailings.get(sampleSailingRecord.id);
    const daysBefore = await database.itineraryDays.toArray();
    const json = JSON.stringify(sailingShellEnrichmentPayload());
    const preview = await createImportPreview(json, "sailing_shell", database);
    const outcome = await commitValidatedImport(json, "sailing_shell", preview, false, database);

    expect(outcome.status).toBe("committed");
    expect(await database.enrichmentRuns.get("enrichment-run-sailing-shell-test")).toMatchObject({
      targetEntityType: "sailing",
      targetEntityId: sampleSailingRecord.id,
      validationWarnings: ["Do not treat this enrichment as booking confirmation."],
    });
    expect(await database.enrichmentSections.get("section-sailing-shell-test")).toMatchObject({
      entityType: "sailing",
      entityId: sampleSailingRecord.id,
      practicalGuidance: ["Keep protected fields unchanged."],
      confidence: { reviewStatus: "needs_user_review", refreshRecommended: true },
    });
    expect(await database.sailings.get(sampleSailingRecord.id)).toEqual(sailingBefore);
    expect(await database.itineraryDays.toArray()).toEqual(daysBefore);
    expect((await database.importBatches.toArray())[0]).toMatchObject({
      schema: "complete-cruising-sailing-shell-enrichment-v1",
      sourceApp: "ChatGPT",
      recordsCreated: 2,
      protectedFieldWarningCount: 1,
    });
  });

  it("re-imports sailing shell enrichment idempotently without duplicate sections", async () => {
    const json = JSON.stringify(sailingShellEnrichmentPayload());
    let preview = await createImportPreview(json, "sailing_shell", database);
    await commitValidatedImport(json, "sailing_shell", preview, false, database);

    preview = await createImportPreview(json, "sailing_shell", database);
    const outcome = await commitValidatedImport(json, "sailing_shell", preview, false, database);

    expect(outcome.status).toBe("committed");
    expect(preview.recordsUnchanged).toEqual(expect.arrayContaining(["enrichment-run-sailing-shell-test", "section-sailing-shell-test"]));
    expect(await database.enrichmentSections.where("id").equals("section-sailing-shell-test").count()).toBe(1);
    expect(await database.enrichmentRuns.where("id").equals("enrichment-run-sailing-shell-test").count()).toBe(1);
  });

  it("blocks reviewed sailing enrichment sections from silent overwrite", async () => {
    const json = JSON.stringify(sailingShellEnrichmentPayload());
    const preview = await createImportPreview(json, "sailing_shell", database);
    await commitValidatedImport(json, "sailing_shell", preview, false, database);
    const existing = await database.enrichmentSections.get("section-sailing-shell-test");
    await database.enrichmentSections.put({
      ...existing!,
      confidence: { ...existing!.confidence, reviewStatus: "reviewed" },
    });

    const changedJson = JSON.stringify(sailingShellEnrichmentPayload("A changed summary that should not overwrite reviewed content."));
    const blockedPreview = await createImportPreview(changedJson, "sailing_shell", database);
    const outcome = await commitValidatedImport(changedJson, "sailing_shell", blockedPreview, false, database);

    expect(blockedPreview.status).toBe("invalid");
    expect(outcome.status).toBe("blocked");
    expect((await database.enrichmentSections.get("section-sailing-shell-test"))?.summary).toBe("Planning context that does not confirm operational timing.");
  });
});
