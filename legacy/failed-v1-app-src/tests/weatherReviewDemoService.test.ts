import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { sampleSailingRecord, sampleWeatherRecord } from "../data/sampleSchemaData";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { getActiveSailingId, getSelectedTodayDayId } from "../db/repositories";
import { seedSampleData } from "../db/seedDatabase";
import { loadWeatherReviewDemo, restoreWeatherReviewCalmState, WEATHER_REVIEW_DEMO_IDS } from "../features/weather/weatherReviewDemoService";

describe("weather review demo service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-weather-review-demo-${crypto.randomUUID()}`);
    await seedSampleData(database);
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("loads a deterministic illustrative review scenario and is safe to rerun", async () => {
    await loadWeatherReviewDemo(database);
    await loadWeatherReviewDemo(database);

    const sampleSnapshots = await database.weatherSnapshots.where("sailingId").equals(sampleSailingRecord.id).toArray();
    expect(sampleSnapshots).toHaveLength(1 + Object.keys(WEATHER_REVIEW_DEMO_IDS.snapshotIds).length);
    expect(await database.weatherSnapshotReviewEvents.count()).toBe(Object.keys(WEATHER_REVIEW_DEMO_IDS.eventIds).length);
    expect(await getActiveSailingId(database)).toBe(sampleSailingRecord.id);
    expect(await getSelectedTodayDayId(database)).toBe(WEATHER_REVIEW_DEMO_IDS.dayIds.conflict);
    expect((await database.itineraryDays.get(WEATHER_REVIEW_DEMO_IDS.dayIds.conflict))?.weatherSnapshotId).toBe(sampleWeatherRecord.id);
    expect((await database.itineraryDays.get(WEATHER_REVIEW_DEMO_IDS.dayIds.resolved))?.weatherSnapshotId).toBe(WEATHER_REVIEW_DEMO_IDS.snapshotIds.ephesusSameDay);
  });

  it("restores the calm sample state without leaving demo records behind", async () => {
    await loadWeatherReviewDemo(database);
    await restoreWeatherReviewCalmState(database);

    const sampleSnapshots = await database.weatherSnapshots.where("sailingId").equals(sampleSailingRecord.id).toArray();
    expect(sampleSnapshots).toHaveLength(1);
    expect(sampleSnapshots[0]?.id).toBe(sampleWeatherRecord.id);
    expect(await database.weatherSnapshotReviewEvents.count()).toBe(0);
    expect((await database.itineraryDays.get(WEATHER_REVIEW_DEMO_IDS.dayIds.stable))?.weatherSnapshotId).toBeUndefined();
    expect((await database.itineraryDays.get(WEATHER_REVIEW_DEMO_IDS.dayIds.sea))?.weatherSnapshotId).toBeUndefined();
    expect((await database.itineraryDays.get(WEATHER_REVIEW_DEMO_IDS.dayIds.resolved))?.weatherSnapshotId).toBeUndefined();
  });
});
