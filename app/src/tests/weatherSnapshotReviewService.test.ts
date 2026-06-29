import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { sampleWeatherRecord } from "../data/sampleSchemaData";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { refreshWeatherForItineraryDay } from "../features/weather/weatherRefreshService";
import { acknowledgeWeatherSnapshotConflict, selectPreferredWeatherSnapshot } from "../features/weather/weatherSnapshotReviewService";

function mockOpenMeteoFetch() {
  return (async () => ({
    ok: true,
    json: async () => ({
      current: {
        time: "2026-06-29T10:15",
        weather_code: 1,
        temperature_2m: 27.8,
        apparent_temperature: 29.1,
        precipitation: 0,
        wind_speed_10m: 17.5,
        relative_humidity_2m: 55,
      },
      daily: {
        time: ["2026-06-29"],
        weather_code: [1],
        temperature_2m_max: [29],
        temperature_2m_min: [22],
        precipitation_probability_max: [15],
        wind_speed_10m_max: [18],
        uv_index_max: [7],
        sunrise: ["2026-06-29T05:40"],
        sunset: ["2026-06-29T20:29"],
      },
    }),
  })) as unknown as typeof fetch;
}

describe("weather snapshot review service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-weather-review-${crypto.randomUUID()}`);
    await seedSampleData(database);
    await database.ports.update("port-naples", {
      geo: { latitude: 40.841, longitude: 14.263, geocodeConfidence: "medium" },
    });
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("trusted preferred snapshots are not silently replaced by newer snapshots", async () => {
    await database.weatherSnapshots.update(sampleWeatherRecord.id, {
      confidence: {
        ...sampleWeatherRecord.confidence,
        confidence: "confirmed",
        reviewStatus: "reviewed",
      },
    });

    const result = await refreshWeatherForItineraryDay("sailing-sun-princess-med-2026", "day-02-naples", database, {
      currentDate: "2026-06-29",
      fetchImpl: mockOpenMeteoFetch(),
    });

    expect(result.status).toBe("blocked");
    expect((await database.itineraryDays.get("day-02-naples"))?.weatherSnapshotId).toBe(sampleWeatherRecord.id);
  });

  it("selecting a preferred snapshot updates the preferred pointer only", async () => {
    const refreshed = await refreshWeatherForItineraryDay("sailing-sun-princess-med-2026", "day-02-naples", database, {
      currentDate: "2026-06-29",
      fetchImpl: mockOpenMeteoFetch(),
    });
    const newerSnapshot = refreshed.snapshots[0]!;

    await selectPreferredWeatherSnapshot({
      itineraryDayId: "day-02-naples",
      snapshotId: newerSnapshot.id,
    }, database);

    expect((await database.itineraryDays.get("day-02-naples"))?.weatherSnapshotId).toBe(newerSnapshot.id);
    expect(await database.weatherSnapshots.get(sampleWeatherRecord.id)).toBeTruthy();
  });

  it("selecting a preferred snapshot creates a review event", async () => {
    const refreshed = await refreshWeatherForItineraryDay("sailing-sun-princess-med-2026", "day-02-naples", database, {
      currentDate: "2026-06-29",
      fetchImpl: mockOpenMeteoFetch(),
    });

    await selectPreferredWeatherSnapshot({
      itineraryDayId: "day-02-naples",
      snapshotId: refreshed.snapshots[0]!.id,
    }, database);

    const events = await database.weatherSnapshotReviewEvents.toArray();
    expect(events).toHaveLength(1);
    expect(events[0]?.action).toBe("preferred_snapshot_selected");
  });

  it("competing snapshots remain stored after preferred selection", async () => {
    const refreshed = await refreshWeatherForItineraryDay("sailing-sun-princess-med-2026", "day-02-naples", database, {
      currentDate: "2026-06-29",
      fetchImpl: mockOpenMeteoFetch(),
    });
    await selectPreferredWeatherSnapshot({
      itineraryDayId: "day-02-naples",
      snapshotId: refreshed.snapshots[0]!.id,
    }, database);

    expect(await database.weatherSnapshots.where("itineraryDayId").equals("day-02-naples").count()).toBe(2);
  });

  it("acknowledging a conflict stores an audit event without changing the preferred pointer", async () => {
    const refreshed = await refreshWeatherForItineraryDay("sailing-sun-princess-med-2026", "day-02-naples", database, {
      currentDate: "2026-06-29",
      fetchImpl: mockOpenMeteoFetch(),
    });
    const originalPointer = (await database.itineraryDays.get("day-02-naples"))?.weatherSnapshotId;

    await acknowledgeWeatherSnapshotConflict({
      itineraryDayId: "day-02-naples",
      snapshotIds: [sampleWeatherRecord.id, refreshed.snapshots[0]!.id],
    }, database);

    expect((await database.itineraryDays.get("day-02-naples"))?.weatherSnapshotId).toBe(originalPointer);
    expect(await database.weatherSnapshotReviewEvents.where("action").equals("conflict_acknowledged").count()).toBe(1);
  });
});
