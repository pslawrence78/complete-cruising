import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { commitGuidePack, createGuidePackPreview } from "../features/guide-loader/guidePackService";

const dayOneId = "sailing-eastern-mediterranean-cruise-mqxo1afu-day-01";

function shipGuidePack() {
  return {
    schema: "complete-cruising-guide-pack-v1",
    schemaVersion: 1,
    createdAt: "2026-06-30T10:00:00.000Z",
    source: "ChatGPT",
    target: {
      type: "ship",
      id: "ship-sun-princess",
      name: "Sun Princess",
    },
    guide: {
      title: "Sun Princess family bearings",
      shortSummary: "A calmer first-read guide for the ship.",
      sections: [
        {
          sectionType: "layout",
          title: "Start with the ship spine",
          shortSummary: "Find one dependable route between cabin, food and open deck.",
        },
      ],
    },
    metadata: {
      confidence: "medium",
      reviewStatus: "needs_user_review",
      refreshRecommended: true,
      sourceTypesUsed: ["generated"],
    },
  };
}

function portGuidePack() {
  return {
    schema: "complete-cruising-guide-pack-v1",
    schemaVersion: 1,
    createdAt: "2026-06-30T10:00:00.000Z",
    source: "ChatGPT",
    target: {
      type: "port",
      id: "port-civitavecchia",
      name: "Civitavecchia",
      portName: "Civitavecchia",
    },
    guide: {
      title: "Civitavecchia bearings",
      shortSummary: "A guidebook layer for the Rome gateway.",
      sections: [
        {
          sectionType: "logistics",
          title: "Embarkation-side bearings",
          shortSummary: "Keep terminal expectations modest and use the port as a calm staging point.",
        },
      ],
    },
    metadata: {
      confidence: "medium",
      reviewStatus: "needs_user_review",
      refreshRecommended: true,
      sourceTypesUsed: ["generated"],
    },
  };
}

describe("guide pack service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-guide-pack-${crypto.randomUUID()}`);
    await seedSampleData(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("parses a valid guide pack preview", async () => {
    const preview = await createGuidePackPreview(
      JSON.stringify(shipGuidePack()),
      { kind: "ship", id: "ship-sun-princess" },
      database,
    );

    expect(preview.status).toBe("valid");
    expect(preview.targetLabel).toBe("Sun Princess");
    expect(preview.affectedAreas).toContain("Ship");
  });

  it("rejects invalid JSON", async () => {
    const preview = await createGuidePackPreview("{", { kind: "ship", id: "ship-sun-princess" }, database);
    expect(preview.status).toBe("parse_error");
  });

  it("maps a port guide pack into enrichment section records", async () => {
    const preview = await createGuidePackPreview(
      JSON.stringify(portGuidePack()),
      { kind: "port", id: "port-civitavecchia" },
      database,
    );
    const outcome = await commitGuidePack(preview, database);

    expect(outcome.status).toBe("committed");
    const sections = await database.enrichmentSections.where("[entityType+entityId]").equals(["port", "port-civitavecchia"]).toArray();
    expect(sections.some((section) => section.title === "Embarkation-side bearings")).toBe(true);
  });

  it("maps a ship guide pack into enrichment section records", async () => {
    const preview = await createGuidePackPreview(
      JSON.stringify(shipGuidePack()),
      { kind: "ship", id: "ship-sun-princess" },
      database,
    );
    const outcome = await commitGuidePack(preview, database);

    expect(outcome.status).toBe("committed");
    const sections = await database.enrichmentSections.where("[entityType+entityId]").equals(["ship", "ship-sun-princess"]).toArray();
    expect(sections.some((section) => section.title === "Start with the ship spine")).toBe(true);
  });

  it("preserves protected local summaries instead of silently overwriting them", async () => {
    const ship = await database.ships.get("ship-sun-princess");
    await database.ships.put({
      ...ship!,
      shipOverview: "Trusted local summary",
      confidence: {
        ...ship!.confidence!,
        reviewStatus: "reviewed",
      },
    });

    const preview = await createGuidePackPreview(
      JSON.stringify(shipGuidePack()),
      { kind: "ship", id: "ship-sun-princess" },
      database,
    );
    await commitGuidePack(preview, database);

    expect((await database.ships.get("ship-sun-princess"))?.shipOverview).toBe("Trusted local summary");
    expect(preview.protectedFieldWarnings.some((warning) => warning.includes("ship overview"))).toBe(true);
  });

  it("creates a day guide that can feed Today and Itinerary", async () => {
    const payload = {
      schema: "complete-cruising-guide-pack-v1",
      schemaVersion: 1,
      createdAt: "2026-06-30T10:00:00.000Z",
      source: "ChatGPT",
      target: {
        type: "itinerary_day",
        id: dayOneId,
        name: "Day 1",
        dayNumber: 1,
      },
      guide: {
        title: "Embarkation bearings",
        shortSummary: "A calm first-day briefing for embarkation.",
        sections: [
          {
            sectionType: "day_guide",
            title: "First-day rhythm",
            shortSummary: "Keep the first afternoon spacious and use the ship for orientation.",
          },
        ],
      },
      metadata: {
        confidence: "medium",
        reviewStatus: "needs_user_review",
        refreshRecommended: true,
        sourceTypesUsed: ["generated"],
      },
    };

    const preview = await createGuidePackPreview(
      JSON.stringify(payload),
      { kind: "day_guide", id: dayOneId },
      database,
    );
    await commitGuidePack(preview, database);

    expect(await database.dayGuides.where("itineraryDayId").equals(dayOneId).count()).toBe(1);
  });
});
