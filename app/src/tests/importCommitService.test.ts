import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { commitValidatedImport } from "../features/import-export/importCommitService";
import { createImportPreview } from "../features/import-export/importPreviewService";
import { getSampleImport } from "../features/import-export/sampleImports";

function withDayGuideTitle(title: string) {
  const payload = JSON.parse(getSampleImport("day_guide"));
  payload.dayGuide.title = title;
  return JSON.stringify(payload);
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
});
