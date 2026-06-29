import { describe, expect, it } from "vitest";
import { sampleWeatherRecord } from "../data/sampleSchemaData";
import { buildWeatherSnapshotConflicts } from "../features/weather/weatherSnapshotConflictService";

const itineraryDay = {
  day: {
    id: "day-02-naples",
    sailingId: "sailing-sun-princess-med-2026",
    dayNumber: 2,
    date: "2026-08-02",
    dayType: "port" as const,
    title: "Naples",
    portId: "port-naples",
    weatherSnapshotId: sampleWeatherRecord.id,
    audit: sampleWeatherRecord.audit,
  },
  port: {
    id: "port-naples",
    name: "Naples",
    countryId: "country-italy",
    audit: sampleWeatherRecord.audit,
  },
};

describe("weather snapshot conflict service", () => {
  it("returns no conflict for a single snapshot", () => {
    const conflicts = buildWeatherSnapshotConflicts({
      itineraryDays: [itineraryDay],
      snapshots: [sampleWeatherRecord],
    });

    expect(conflicts[0]?.recommendedReviewState).toBe("no_conflict");
    expect(conflicts[0]?.materialDifferences).toEqual([]);
  });

  it("identifies material temperature differences", () => {
    const conflicts = buildWeatherSnapshotConflicts({
      itineraryDays: [itineraryDay],
      snapshots: [
        sampleWeatherRecord,
        { ...sampleWeatherRecord, id: "warmer", capturedAt: "2026-06-21T09:00:00.000Z", temperatureHighC: 32 },
      ],
    });

    expect(conflicts[0]?.materialDifferences.some((difference) => difference.field === "temperatureHighC" && difference.material)).toBe(true);
  });

  it("identifies material precipitation differences", () => {
    const conflicts = buildWeatherSnapshotConflicts({
      itineraryDays: [itineraryDay],
      snapshots: [
        sampleWeatherRecord,
        { ...sampleWeatherRecord, id: "wetter", capturedAt: "2026-06-21T09:00:00.000Z", precipitationChance: 40 },
      ],
    });

    expect(conflicts[0]?.materialDifferences.some((difference) => difference.field === "precipitationChance" && difference.material)).toBe(true);
  });

  it("identifies source and context differences", () => {
    const conflicts = buildWeatherSnapshotConflicts({
      itineraryDays: [itineraryDay],
      snapshots: [
        { ...sampleWeatherRecord, weatherContext: "visit_date_forecast", sourceName: "Open-Meteo" },
        {
          ...sampleWeatherRecord,
          id: "port-now",
          capturedAt: "2026-06-21T09:00:00.000Z",
          weatherContext: "weather_now_in_port",
          sourceName: "Family note",
          sourceType: "user_entered",
        },
      ],
    });

    expect(conflicts[0]?.materialDifferences.some((difference) => difference.field === "weatherContext")).toBe(true);
    expect(conflicts[0]?.materialDifferences.some((difference) => difference.field === "sourceName")).toBe(true);
  });
});
