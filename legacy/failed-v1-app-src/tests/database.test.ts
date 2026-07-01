import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { clearSampleData, resetSampleData } from "../db/resetDatabase";
import { ensureRealSunPrincessSailing, REAL_SUN_PRINCESS_SAILING_ID } from "../db/realSailingOnboarding";
import { seedSampleData } from "../db/seedDatabase";
import {
  getActiveSailing,
  getItineraryDaysForSailing,
  getPortGuideBundle,
  getSelectedShorePlanForDay,
  getShipEnrichmentSections,
} from "../db/repositories";

describe("local database foundation", () => {
  let database: CompleteCruisingDb;

  beforeEach(() => {
    database = new CompleteCruisingDb(`completeCruisingDb-test-${crypto.randomUUID()}`);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("instantiates version 3 with the required tables", () => {
    expect(database.verno).toBe(3);
    expect(database.tables.map(({ name }) => name)).toEqual(expect.arrayContaining([
      "cruiseLines", "ships", "sailings", "countries", "ports", "itineraryDays", "attractions",
      "shorePlans", "dayGuides", "weatherSnapshots", "weatherSnapshotReviewEvents", "enrichmentSections", "familyNotes",
      "memoryEntries", "importBatches", "appSettings",
    ]));
  });

  it("seeds idempotently and preserves trust metadata", async () => {
    await seedSampleData(database);
    await database.sailings.update("sailing-sun-princess-med-2026", { planningSummary: "Locally reviewed summary" });
    await seedSampleData(database);
    expect(await database.sailings.count()).toBe(1);
    expect(await database.shorePlans.count()).toBe(3);
    const active = await getActiveSailing(database);
    expect(active?.confidence?.reviewStatus).toBe("needs_user_review");
    expect(active?.confidence?.refreshRecommended).toBe(true);
    expect(active?.planningSummary).toBe("Locally reviewed summary");
  });

  it("clears and reseeds the illustrative sample", async () => {
    await seedSampleData(database);
    await clearSampleData(database);
    expect(await database.sailings.count()).toBe(0);
    await resetSampleData(database);
    expect(await database.sailings.count()).toBe(1);
  });

  it("loads the active sailing and its itinerary", async () => {
    await seedSampleData(database);
    const active = await getActiveSailing(database);
    const days = await getItineraryDaysForSailing(active!.id, database);
    expect(active?.name).toBe("Sun Princess Mediterranean 2026");
    expect(days).toHaveLength(15);
    expect(days[1].portId).toBe("port-naples");
  });

  it("onboards the real Sun Princess sailing as active without duplication", async () => {
    await seedSampleData(database);
    await ensureRealSunPrincessSailing(database);
    await ensureRealSunPrincessSailing(database);
    const active = await getActiveSailing(database);
    const days = await getItineraryDaysForSailing(REAL_SUN_PRINCESS_SAILING_ID, database);
    expect(active?.id).toBe(REAL_SUN_PRINCESS_SAILING_ID);
    expect(active?.name).toBe("Eastern Mediterranean Cruise");
    expect(active?.departureDate).toBe("2026-08-15");
    expect(active?.returnDate).toBe("2026-08-29");
    expect(active?.voyageCode).toBeUndefined();
    expect(days).toHaveLength(15);
    expect(days[0].date).toBe("2026-08-15");
    expect(days[14].date).toBe("2026-08-29");
    expect(days.every((day) => !day.arrivalTime && !day.departureTime && !day.allAboardTime)).toBe(true);
    expect(days.every((day) => day.confidence?.reviewStatus === "needs_user_review")).toBe(true);
    expect((await database.sailings.where("id").equals(REAL_SUN_PRINCESS_SAILING_ID).count())).toBe(1);
  });

  it("does not overwrite protected real sailing fields during onboarding", async () => {
    await ensureRealSunPrincessSailing(database);
    await database.sailings.update(REAL_SUN_PRINCESS_SAILING_ID, {
      voyageCode: "U632A",
      routeSummary: "User-reviewed route",
      departureDate: "2026-08-15",
    });
    await database.itineraryDays.update(`${REAL_SUN_PRINCESS_SAILING_ID}-day-07`, { tenderStatus: "confirmed", allAboardTime: "17:30" });
    await ensureRealSunPrincessSailing(database);
    const sailing = await database.sailings.get(REAL_SUN_PRINCESS_SAILING_ID);
    const day = await database.itineraryDays.get(`${REAL_SUN_PRINCESS_SAILING_ID}-day-07`);
    expect(sailing?.voyageCode).toBe("U632A");
    expect(sailing?.routeSummary).toBe("User-reviewed route");
    expect(day?.tenderStatus).toBe("confirmed");
    expect(day?.allAboardTime).toBe("17:30");
  });

  it("loads the reusable Naples guide separately from sailing plans", async () => {
    await seedSampleData(database);
    const bundle = await getPortGuideBundle("port-naples", database);
    const selectedPlan = await getSelectedShorePlanForDay("day-02-naples", database);
    expect(bundle?.port.name).toBe("Naples");
    expect(bundle?.country?.isoCode).toBe("IT");
    expect(bundle?.attractions).toHaveLength(4);
    expect(selectedPlan?.status).toBe("selected");
    expect(selectedPlan?.sailingId).toBe("sailing-sun-princess-med-2026");
  });

  it("round-trips enrichment trust metadata", async () => {
    await seedSampleData(database);
    const sections = await getShipEnrichmentSections("ship-sun-princess", database);
    expect(sections.find(({ sectionType }) => sectionType === "identity")?.confidence).toMatchObject({
      confidence: "medium",
      reviewStatus: "needs_user_review",
      refreshRecommended: true,
    });
  });
});
