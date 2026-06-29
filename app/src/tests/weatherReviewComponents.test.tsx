import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildWeatherCardModelFromSnapshot } from "../features/weather/weatherStateService";

describe("weather review copy and sea-day handling", () => {
  it("sea-day dashboard timeline copy does not render weather now in port", () => {
    const weather = buildWeatherCardModelFromSnapshot({
      day: {
        date: "2026-08-03",
        dayType: "sea",
        title: "Sea Day",
      },
    });

    render(
      <div>
        <span>{weather.weatherTypeLabel}</span>
        {weather.showContextCaption ? <p>{weather.contextMessage}</p> : null}
      </div>,
    );

    expect(screen.queryByText(/weather now in port/i)).not.toBeInTheDocument();
    expect(screen.getByText("Sea-day weather")).toBeInTheDocument();
  });

  it("port days can still render valid port-weather wording", () => {
    const weather = buildWeatherCardModelFromSnapshot({
      day: {
        date: "2026-08-02",
        dayType: "port",
        title: "Naples",
      },
      port: {
        name: "Naples",
        geo: { latitude: 40.841, longitude: 14.263, geocodeConfidence: "medium" },
      },
      snapshot: {
        id: "weather-port",
        sailingId: "sailing",
        itineraryDayId: "day-port",
        date: "2026-06-29",
        latitude: 40.841,
        longitude: 14.263,
        sourceName: "Open-Meteo",
        sourceType: "weather_service",
        snapshotType: "manual",
        weatherState: "climate_expectation",
        weatherContext: "weather_now_in_port",
        capturedAt: "2026-06-29T10:15:00.000Z",
        validFrom: "2026-06-29",
        validUntil: "2026-06-29",
        refreshState: "updated",
        refreshRecommended: true,
        conditionSummary: "Warm and bright",
        comfortSummary: "Warm port feel.",
        clothingGuidance: "Hats and water are worth packing.",
        planImpact: "Use this as destination context only while the visit-date forecast remains pending.",
        confidence: {
          confidence: "low",
          reviewStatus: "needs_user_review",
          sourceType: "weather_service",
          refreshRecommended: true,
        },
        audit: {
          createdAt: "2026-06-29T10:15:00.000Z",
          updatedAt: "2026-06-29T10:15:00.000Z",
          createdBy: "test",
          updatedBy: "test",
        },
      },
    });

    render(<p>{weather.contextMessage}</p>);
    expect(screen.getByText(/here is what Naples feels like today/i)).toBeInTheDocument();
  });
});
