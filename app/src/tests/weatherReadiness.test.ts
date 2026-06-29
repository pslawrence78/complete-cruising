import { describe, expect, it } from "vitest";
import { sampleItineraryDayRecord, sampleWeatherRecord } from "../data/sampleSchemaData";
import { deriveWeatherReadinessState, getForecastExpectedFrom, getWeatherRefreshMode } from "../features/weather/weatherReadiness";

const portWithCoordinates = {
  name: "Naples",
  geo: {
    latitude: 40.841,
    longitude: 14.263,
    geocodeConfidence: "medium" as const,
  },
};

describe("weather readiness helpers", () => {
  it("classifies the forecast window deterministically", () => {
    expect(getWeatherRefreshMode("2026-06-29", "2026-06-29")).toBe("same_day_check");
    expect(getWeatherRefreshMode("2026-07-10", "2026-06-29")).toBe("visit_date_forecast");
    expect(getWeatherRefreshMode("2026-08-16", "2026-06-29")).toBe("weather_now_in_port");
    expect(getWeatherRefreshMode("2026-06-20", "2026-06-29")).toBe("past_day");
  });

  it("does not let weather-now context satisfy visit-date forecast readiness", () => {
    const day = { ...sampleItineraryDayRecord, date: "2026-08-16" };
    const snapshot = {
      ...sampleWeatherRecord,
      date: "2026-06-29",
      forecastDate: "2026-06-29",
      visitDate: day.date,
      weatherContext: "weather_now_in_port" as const,
      snapshotType: "manual" as const,
      isVisitDateForecast: false,
      satisfiesVisitForecastReadiness: false,
      capturedAt: "2026-06-29T10:00:00.000Z",
    };

    expect(deriveWeatherReadinessState({
      day,
      port: portWithCoordinates,
      snapshot,
      todayIso: "2026-06-29",
    })).toBe("weather_now_context_only");
  });

  it("only marks visit-date forecasts ready when the dates match", () => {
    const day = { ...sampleItineraryDayRecord, date: "2026-07-10" };
    const matchingSnapshot = {
      ...sampleWeatherRecord,
      date: day.date,
      forecastDate: day.date,
      visitDate: day.date,
      weatherContext: "visit_date_forecast" as const,
      satisfiesVisitForecastReadiness: true,
      isVisitDateForecast: true,
      capturedAt: "2026-06-29T10:00:00.000Z",
    };
    const mismatchedSnapshot = {
      ...matchingSnapshot,
      forecastDate: "2026-07-09",
      date: "2026-07-09",
      satisfiesVisitForecastReadiness: false,
    };

    expect(deriveWeatherReadinessState({
      day,
      port: portWithCoordinates,
      snapshot: matchingSnapshot,
      todayIso: "2026-06-29",
    })).toBe("visit_forecast_ready");
    expect(deriveWeatherReadinessState({
      day,
      port: portWithCoordinates,
      snapshot: mismatchedSnapshot,
      todayIso: "2026-06-29",
    })).toBe("forecast_pending");
  });

  it("calculates when a visit-date forecast should become available", () => {
    expect(getForecastExpectedFrom("2026-08-15")).toBe("2026-07-30");
  });

  it("surfaces missing coordinates when no live or stored position exists", () => {
    expect(deriveWeatherReadinessState({
      day: sampleItineraryDayRecord,
      port: { geo: { geocodeConfidence: "unknown" as const } },
      todayIso: "2026-06-29",
    })).toBe("missing_coordinates");
  });
});
