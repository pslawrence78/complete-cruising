import type { ItineraryDayRecord, Port } from "../../types";
import { createWeatherCardModel } from "./weatherPresentation";
import type { WeatherCardModel, WeatherRefreshRequest, WeatherSnapshotRecord, WeatherState } from "./weatherTypes";
import { weatherCodeToConditionSummary } from "./openMeteoClient";

const RECENT_REFRESH_MS = 36 * 60 * 60 * 1000;
const STALE_REFRESH_MS = 72 * 60 * 60 * 1000;
const DEFAULT_FORECAST_WINDOW_DAYS = 16;

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, offset: number) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

function compareIsoDates(left: string, right: string) {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function hasCoordinates(port?: Pick<Port, "geo"> | null, request?: Pick<WeatherRefreshRequest, "latitude" | "longitude">) {
  if (request) return Number.isFinite(request.latitude) && Number.isFinite(request.longitude);
  return Boolean(port?.geo && Number.isFinite(port.geo.latitude) && Number.isFinite(port.geo.longitude));
}

export function deriveWeatherStateForDay(input: {
  day: Pick<ItineraryDayRecord, "date">;
  port?: Pick<Port, "geo" | "weatherSeasonalitySummary" | "confidence"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso?: string;
  forecastWindowDays?: number;
}): WeatherState {
  const todayIso = input.todayIso ?? getTodayIso();
  if (!hasCoordinates(input.port, input.snapshot ? { latitude: input.snapshot.latitude, longitude: input.snapshot.longitude } : undefined)) return "missing_coordinates";
  if (compareIsoDates(input.day.date, todayIso) < 0) return input.snapshot ? "day_locked" : "historical_lookup_available";

  if (!input.snapshot) {
    return compareIsoDates(input.day.date, addDays(todayIso, input.forecastWindowDays ?? DEFAULT_FORECAST_WINDOW_DAYS)) <= 0
      ? "forecast_pending"
      : "climate_expectation";
  }

  if (input.snapshot.snapshotType === "climate") return "climate_expectation";

  const ageMs = Date.now() - new Date(input.snapshot.capturedAt).getTime();
  if (ageMs <= RECENT_REFRESH_MS) return "forecast_recent";
  if (ageMs <= STALE_REFRESH_MS) return "forecast_available";
  return input.day.date < todayIso ? "day_locked" : "forecast_stale";
}

export function canRefreshWeatherForDay(input: {
  day: Pick<ItineraryDayRecord, "date">;
  port?: Pick<Port, "geo"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso?: string;
  allowHistoricalLookup?: boolean;
}) {
  const state = deriveWeatherStateForDay({
    day: input.day,
    port: input.port,
    snapshot: input.snapshot,
    todayIso: input.todayIso,
  });
  if (state === "missing_coordinates") return false;
  if (state === "day_locked" || state === "historical_lookup_available") return Boolean(input.allowHistoricalLookup);
  return true;
}

export function buildWeatherCardModelFromSnapshot(input: {
  day: Pick<ItineraryDayRecord, "date">;
  port?: Pick<Port, "geo" | "weatherSeasonalitySummary" | "confidence"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso?: string;
  forecastWindowDays?: number;
  allowHistoricalLookup?: boolean;
}): WeatherCardModel {
  const state = deriveWeatherStateForDay(input);
  const snapshot = input.snapshot;
  const sourceName = snapshot?.sourceName ?? (input.port?.weatherSeasonalitySummary ? "Local seasonality notes" : "Open-Meteo");
  return createWeatherCardModel({
    state,
    conditionSummary: snapshot?.conditionSummary ?? (state === "climate_expectation" ? input.port?.weatherSeasonalitySummary ?? "Seasonal expectation only" : state === "forecast_pending" ? "Forecast pending" : state === "missing_coordinates" ? "Coordinates missing" : "Weather snapshot pending"),
    capturedAt: snapshot?.capturedAt,
    sourceName,
    temperatureHighC: snapshot?.temperatureHighC,
    temperatureLowC: snapshot?.temperatureLowC,
    precipitationChance: snapshot?.precipitationChance,
    precipitationMm: snapshot?.precipitationMm,
    windSpeedKph: snapshot?.windSpeedKph,
    windGustKph: snapshot?.windGustKph,
    uvIndex: snapshot?.uvIndex,
    sunrise: snapshot?.sunrise,
    sunset: snapshot?.sunset,
    refreshState: snapshot?.refreshState ?? "ready",
    refreshReason: snapshot?.refreshReason,
    refreshError: snapshot?.refreshError,
    refreshRecommended: snapshot?.refreshRecommended ?? state !== "forecast_recent",
    lockedLabel: state === "day_locked" ? "Captured for this day" : undefined,
  });
}

export function buildWeatherBadgeLabel(model: WeatherCardModel) {
  return model.badgeLabel;
}

export function buildWeatherStateHint(snapshot?: WeatherSnapshotRecord) {
  if (!snapshot) return undefined;
  if (snapshot.weatherState === "day_locked") return "Captured for this day";
  if (snapshot.weatherState === "forecast_stale") return "Forecast is stale";
  return undefined;
}

export function weatherCodeToCardSummary(code?: number) {
  return weatherCodeToConditionSummary(code);
}
