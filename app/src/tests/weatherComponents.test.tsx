import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sampleTodayData } from "../data/sampleTodayData";
import { WeatherRefreshButton } from "../features/weather/WeatherRefreshButton";
import { WeatherTile } from "../features/today/components/WeatherTile";

describe("weather UI surfaces", () => {
  it("renders visit date, weather data date and Open-Meteo attribution distinctly", () => {
    render(
      <WeatherTile
        buttonState="idle"
        onRefresh={() => undefined}
        weather={sampleTodayData.weather}
      />,
    );

    expect(screen.getByText("Visit date")).toBeInTheDocument();
    expect(screen.getByText("16 August 2026")).toBeInTheDocument();
    expect(screen.getByText("Weather data")).toBeInTheDocument();
    expect(screen.getByText("29 June 2026")).toBeInTheDocument();
    expect(screen.getByText("Weather data by Open-Meteo")).toBeInTheDocument();
  });

  it("shows clear refresh button state transitions", () => {
    const { rerender } = render(
      <WeatherRefreshButton className="test-refresh-button" onClick={() => undefined} state="idle" />,
    );

    expect(screen.getByRole("button", { name: "Refresh weather" })).toBeEnabled();

    rerender(
      <WeatherRefreshButton className="test-refresh-button" onClick={() => undefined} state="refreshing" />,
    );
    expect(screen.getByRole("button", { name: "Refreshing..." })).toBeDisabled();

    rerender(
      <WeatherRefreshButton className="test-refresh-button" onClick={() => undefined} state="failed" />,
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });
});
