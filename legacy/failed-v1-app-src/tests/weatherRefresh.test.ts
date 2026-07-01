import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sampleWeatherRecord } from "../data/sampleSchemaData";
import { CompleteCruisingDb } from "../db/completeCruisingDb";
import { seedSampleData } from "../db/seedDatabase";
import { getLatestWeatherSnapshotForItineraryDay } from "../db/repositories/weatherRepository";
import { refreshWeatherForItineraryDay } from "../features/weather/weatherRefreshService";

function mockOpenMeteoFetch() {
  return vi.fn(async () => ({
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

describe("manual weather refresh service", () => {
  let database: CompleteCruisingDb;

  beforeEach(async () => {
    database = new CompleteCruisingDb(`completeCruisingDb-weather-${crypto.randomUUID()}`);
    await seedSampleData(database);
    await database.ports.update("port-naples", {
      geo: {
        latitude: 40.841,
        longitude: 14.263,
        geocodeConfidence: "medium",
      },
    });
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it("handles offline refresh attempts without clearing local weather", async () => {
    const result = await refreshWeatherForItineraryDay(
      "sailing-sun-princess-med-2026",
      "day-02-naples",
      database,
      {
        currentDate: "2026-06-29",
        offline: true,
      },
    );

    expect(result.status).toBe("offline");
    expect(result.buttonState).toBe("offline");
    expect(result.message).toMatch(/needs a connection/i);
  });

  it("creates a weather-now snapshot that keeps visit-date readiness false outside the forecast window", async () => {
    const result = await refreshWeatherForItineraryDay(
      "sailing-sun-princess-med-2026",
      "day-02-naples",
      database,
      {
        currentDate: "2026-06-29",
        fetchImpl: mockOpenMeteoFetch(),
      },
    );

    expect(result.status).toBe("saved");
    expect(result.buttonState).toBe("refreshed");
    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0]).toMatchObject({
      sourceName: "Open-Meteo",
      sourceAttribution: "Weather data by Open-Meteo",
      weatherContext: "weather_now_in_port",
      isVisitDateForecast: false,
      satisfiesVisitForecastReadiness: false,
      forecastExpectedFrom: "2026-07-17",
    });
  });

  it("does not overwrite reviewed or verified snapshots", async () => {
    const snapshot = await getLatestWeatherSnapshotForItineraryDay("day-02-naples", database);
    await database.weatherSnapshots.update(snapshot!.id, {
      confidence: {
        ...snapshot!.confidence,
        confidence: "confirmed",
        reviewStatus: "reviewed",
        refreshRecommended: false,
      },
    });

    const result = await refreshWeatherForItineraryDay(
      "sailing-sun-princess-med-2026",
      "day-02-naples",
      database,
      {
        currentDate: "2026-06-29",
        fetchImpl: mockOpenMeteoFetch(),
      },
    );

    expect(result.status).toBe("blocked");
    expect(result.buttonState).toBe("blocked");
    expect(result.message).toMatch(/trusted snapshot preserved/i);
  });

  it("preserves manual observed snapshots instead of replacing them", async () => {
    const observedSnapshot = {
      ...sampleWeatherRecord,
      id: "observed-weather-day-02",
      date: "2026-08-02",
      visitDate: "2026-08-02",
      forecastDate: "2026-08-02",
      capturedAt: "2026-06-29T12:00:00.000Z",
      snapshotType: "observed" as const,
      weatherContext: "observed" as const,
      sourceName: "Family weather note",
      sourceType: "user_entered" as const,
      confidence: {
        ...sampleWeatherRecord.confidence,
        confidence: "confirmed" as const,
        reviewStatus: "reviewed" as const,
        sourceType: "user_entered" as const,
        refreshRecommended: false,
      },
    };
    await database.weatherSnapshots.put(observedSnapshot);
    await database.itineraryDays.update("day-02-naples", { weatherSnapshotId: observedSnapshot.id });

    const result = await refreshWeatherForItineraryDay(
      "sailing-sun-princess-med-2026",
      "day-02-naples",
      database,
      {
        currentDate: "2026-06-29",
        fetchImpl: mockOpenMeteoFetch(),
      },
    );

    expect(result.status).toBe("blocked");
    expect(result.snapshots[0]?.id).toBe("observed-weather-day-02");
    expect(await database.itineraryDays.get("day-02-naples")).toMatchObject({
      weatherSnapshotId: "observed-weather-day-02",
    });
  });
});
