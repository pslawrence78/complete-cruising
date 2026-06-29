import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleAudit, samplePortRecord, sampleSailingRecord, sampleWeatherRecord } from "../data/sampleSchemaData";
import { WeatherSnapshotReviewPage } from "../features/weather/WeatherSnapshotReviewPage";

const useWeatherSnapshotReviewMock = vi.fn();
const selectPreferredWeatherSnapshotMock = vi.fn();
const acknowledgeWeatherSnapshotConflictMock = vi.fn();
const loadWeatherReviewDemoMock = vi.fn();
const restoreWeatherReviewCalmStateMock = vi.fn();

vi.mock("../hooks/useLocalData", () => ({
  useWeatherSnapshotReview: () => useWeatherSnapshotReviewMock(),
}));

vi.mock("../features/weather/weatherSnapshotReviewService", () => ({
  selectPreferredWeatherSnapshot: (...args: unknown[]) => selectPreferredWeatherSnapshotMock(...args),
  acknowledgeWeatherSnapshotConflict: (...args: unknown[]) => acknowledgeWeatherSnapshotConflictMock(...args),
  describeSnapshotTiming: (snapshot: { generatedAt?: string; capturedAt: string }) => snapshot.generatedAt ?? snapshot.capturedAt,
}));

vi.mock("../features/weather/weatherReviewDemoService", () => ({
  loadWeatherReviewDemo: (...args: unknown[]) => loadWeatherReviewDemoMock(...args),
  restoreWeatherReviewCalmState: (...args: unknown[]) => restoreWeatherReviewCalmStateMock(...args),
}));

function makeDay(overrides: Record<string, unknown> = {}) {
  return {
    id: "day-02-naples",
    sailingId: sampleSailingRecord.id,
    dayNumber: 2,
    date: "2026-08-02",
    dayType: "port",
    title: "Naples, Italy",
    portId: samplePortRecord.id,
    weatherSnapshotId: sampleWeatherRecord.id,
    audit: sampleAudit,
    ...overrides,
  };
}

function makePort(overrides: Record<string, unknown> = {}) {
  return {
    id: samplePortRecord.id,
    name: "Naples",
    countryId: samplePortRecord.countryId,
    audit: sampleAudit,
    ...overrides,
  };
}

function makeSnapshot(overrides: Record<string, unknown> = {}) {
  return {
    ...sampleWeatherRecord,
    audit: sampleAudit,
    ...overrides,
  };
}

function makeBundle(input: {
  itinerary: Array<{ day: ReturnType<typeof makeDay>; port?: ReturnType<typeof makePort> }>;
  weather: Array<ReturnType<typeof makeSnapshot>>;
  weatherReviewEvents?: Array<Record<string, unknown>>;
}) {
  return {
    sailing: sampleSailingRecord,
    itinerary: input.itinerary,
    weather: input.weather,
    weatherReviewEvents: input.weatherReviewEvents ?? [],
  };
}

describe("WeatherSnapshotReviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the calm empty state when no review items are competing", () => {
    useWeatherSnapshotReviewMock.mockReturnValue({
      loading: false,
      data: makeBundle({ itinerary: [], weather: [] }),
    });

    render(<WeatherSnapshotReviewPage />);

    expect(screen.getByText("No weather conflicts need review.")).toBeInTheDocument();
    expect(screen.getByText("Preferred snapshots are clear for the current sailing.")).toBeInTheDocument();
  });

  it("renders a single stored snapshot as stable instead of a false conflict", () => {
    const day = makeDay({ id: "day-04-chania", dayNumber: 4, date: "2026-08-04", title: "Souda Bay / Chania", portId: "port-chania", weatherSnapshotId: "weather-chania" });
    const port = makePort({ id: "port-chania", name: "Souda Bay / Chania" });
    const snapshot = makeSnapshot({
      id: "weather-chania",
      itineraryDayId: day.id,
      portId: port.id,
      date: "2026-08-04",
      forecastDate: "2026-08-04",
      visitDate: "2026-08-04",
      weatherContext: "visit_date_forecast",
      capturedAt: "2026-08-01T09:15:00.000Z",
      generatedAt: "2026-08-01T09:00:00.000Z",
      sourceName: "Open-Meteo visit-date forecast",
      conditionSummary: "Warm harbour sunshine",
      confidence: { ...sampleWeatherRecord.confidence, reviewStatus: "reviewed", refreshRecommended: false },
    });

    useWeatherSnapshotReviewMock.mockReturnValue({
      loading: false,
      data: makeBundle({ itinerary: [{ day, port }], weather: [snapshot] }),
    });

    render(<WeatherSnapshotReviewPage />);

    expect(screen.getByText("Days without a weather conflict")).toBeInTheDocument();
    expect(screen.getByText("Only one snapshot is stored")).toBeInTheDocument();
    expect(screen.getByText("Current preferred")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /select as preferred/i })).not.toBeInTheDocument();
  });

  it("renders a guided why-this-needs-review summary for competing snapshots", () => {
    const preferred = makeSnapshot({
      weatherContext: "visit_date_forecast",
      forecastDate: "2026-08-02",
      visitDate: "2026-08-02",
    });
    const competing = makeSnapshot({
      id: "weather-naples-same-day",
      itineraryDayId: "day-02-naples",
      date: "2026-08-02",
      forecastDate: "2026-08-02",
      visitDate: "2026-08-02",
      weatherContext: "same_day_check",
      sourceName: "Open-Meteo same-day check",
      capturedAt: "2026-08-02T07:10:00.000Z",
      generatedAt: "2026-08-02T07:00:00.000Z",
      conditionSummary: "Hotter with a late thunderstorm risk",
      temperatureHighC: 33,
      precipitationChance: 35,
    });

    useWeatherSnapshotReviewMock.mockReturnValue({
      loading: false,
      data: makeBundle({
        itinerary: [{ day: makeDay(), port: makePort() }],
        weather: [preferred, competing],
      }),
    });

    render(<WeatherSnapshotReviewPage />);

    expect(screen.getByText("Snapshots needing review")).toBeInTheDocument();
    expect(screen.getByText("Why this needs review")).toBeInTheDocument();
    expect(screen.getByText(/Choose the snapshot that should drive Today, Itinerary, Dashboard and Ports weather copy/i)).toBeInTheDocument();
    expect(screen.getByText("A visit-date forecast and a later same-day check are both stored for this itinerary day.")).toBeInTheDocument();
  });

  it("shows resolved state and user-facing audit details after a preferred selection", () => {
    const day = makeDay({ id: "day-06-ephesus", dayNumber: 6, date: "2026-08-06", title: "Kusadasi / Ephesus", portId: "port-kusadasi", weatherSnapshotId: "weather-ephesus-same-day" });
    const port = makePort({ id: "port-kusadasi", name: "Kusadasi / Ephesus" });
    const forecast = makeSnapshot({
      id: "weather-ephesus-forecast",
      itineraryDayId: day.id,
      portId: port.id,
      date: "2026-08-06",
      forecastDate: "2026-08-06",
      visitDate: "2026-08-06",
      weatherContext: "visit_date_forecast",
      sourceName: "Open-Meteo visit-date forecast",
      capturedAt: "2026-08-03T08:30:00.000Z",
      generatedAt: "2026-08-03T08:00:00.000Z",
      conditionSummary: "Dry heat with a bright afternoon",
      confidence: { ...sampleWeatherRecord.confidence, reviewStatus: "reviewed", refreshRecommended: false },
    });
    const preferred = makeSnapshot({
      id: "weather-ephesus-same-day",
      itineraryDayId: day.id,
      portId: port.id,
      date: "2026-08-06",
      forecastDate: "2026-08-06",
      visitDate: "2026-08-06",
      weatherContext: "same_day_check",
      sourceName: "Open-Meteo same-day check",
      capturedAt: "2026-08-06T06:45:00.000Z",
      generatedAt: "2026-08-06T06:30:00.000Z",
      conditionSummary: "Slightly cooler with a stronger breeze",
      confidence: { ...sampleWeatherRecord.confidence, reviewStatus: "verified", refreshRecommended: false },
    });

    useWeatherSnapshotReviewMock.mockReturnValue({
      loading: false,
      data: makeBundle({
        itinerary: [{ day, port }],
        weather: [forecast, preferred],
        weatherReviewEvents: [{
          id: "weather-review-ephesus",
          sailingId: sampleSailingRecord.id,
          itineraryDayId: day.id,
          forecastDate: "2026-08-06",
          action: "preferred_snapshot_selected",
          fromSnapshotId: forecast.id,
          toSnapshotId: preferred.id,
          candidateSnapshotIds: [forecast.id, preferred.id],
          reason: "Illustrative demo selection of the later same-day check for onboard guidance.",
          notes: "The visit-date forecast is still preserved for comparison.",
          createdAt: "2026-08-06T06:55:00.000Z",
          createdBy: "system",
        }],
      }),
    });

    render(<WeatherSnapshotReviewPage />);

    expect(screen.getByText("Preferred snapshots already selected")).toBeInTheDocument();
    expect(screen.getAllByText("Resolved").length).toBeGreaterThan(0);
    expect(screen.getByText(/This day now uses the selected preferred snapshot while preserving the other snapshots for audit and comparison/i)).toBeInTheDocument();
    expect(screen.getByText("Preferred snapshot selected")).toBeInTheDocument();
    expect(screen.getByText(/Selected: Same-day check, refreshed/i)).toBeInTheDocument();
    expect(screen.getByText(/Previous: Visit-date forecast, refreshed/i)).toBeInTheDocument();
    expect(screen.getByText(/Other snapshots preserved for history/i)).toBeInTheDocument();
  });

  it("keeps sea-day copy neutral even when a weather-now context snapshot is stored", () => {
    const day = makeDay({ id: "day-05-sea", dayNumber: 5, date: "2026-08-05", dayType: "sea", title: "At sea", portId: undefined, weatherSnapshotId: "weather-sea" });
    const snapshot = makeSnapshot({
      id: "weather-sea",
      itineraryDayId: day.id,
      portId: undefined,
      date: "2026-08-05",
      forecastDate: "2026-08-05",
      visitDate: "2026-08-05",
      weatherContext: "weather_now_in_port",
      sourceName: "Illustrative sea-day comfort note",
      capturedAt: "2026-08-04T18:20:00.000Z",
      generatedAt: "2026-08-04T18:00:00.000Z",
      conditionSummary: "Warm deck weather with a steadier breeze",
    });

    useWeatherSnapshotReviewMock.mockReturnValue({
      loading: false,
      data: makeBundle({ itinerary: [{ day }], weather: [snapshot] }),
    });

    render(<WeatherSnapshotReviewPage />);

    expect(screen.getByText("Sea-day guardrail")).toBeInTheDocument();
    expect(screen.getByText("Sea-day weather")).toBeInTheDocument();
    expect(screen.queryByText(/^Weather now in port$/i)).not.toBeInTheDocument();
  });
});
