import type { ItineraryDayRecord, Port } from "../../types";
import { formatWeatherDateLabel } from "./weatherCopy";
import { createWeatherCardModel } from "./weatherPresentation";
import { deriveLegacyWeatherState, deriveWeatherReadinessState, getForecastExpectedFrom, getWeatherRefreshMode, OPEN_METEO_FORECAST_WINDOW_DAYS } from "./weatherReadiness";
import type { WeatherButtonState, WeatherCardModel, WeatherRefreshRequest, WeatherSnapshotRecord, WeatherState } from "./weatherTypes";

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function hasCoordinates(port?: Pick<Port, "geo"> | null, request?: Pick<WeatherRefreshRequest, "latitude" | "longitude">) {
  if (request) return Number.isFinite(request.latitude) && Number.isFinite(request.longitude);
  return Boolean(port?.geo && Number.isFinite(port.geo.latitude) && Number.isFinite(port.geo.longitude));
}

export function deriveWeatherStateForDay(input: {
  day: Pick<ItineraryDayRecord, "date" | "dayType">;
  port?: Pick<Port, "geo"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso?: string;
  forecastWindowDays?: number;
  offlineAttempted?: boolean;
}): WeatherState {
  const todayIso = input.todayIso ?? getTodayIso();
  const refreshMode = getWeatherRefreshMode(input.day.date, todayIso, input.forecastWindowDays ?? OPEN_METEO_FORECAST_WINDOW_DAYS);
  const readinessState = deriveWeatherReadinessState({
    day: input.day,
    port: input.port,
    snapshot: input.snapshot,
    todayIso,
    offlineAttempted: input.offlineAttempted,
  });
  return deriveLegacyWeatherState({ readinessState, refreshMode, snapshot: input.snapshot });
}

export function canRefreshWeatherForDay(input: {
  day: Pick<ItineraryDayRecord, "date" | "dayType">;
  port?: Pick<Port, "geo"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso?: string;
  allowHistoricalLookup?: boolean;
}) {
  if (!hasCoordinates(input.port)) return false;
  if (input.day.dayType === "sea" || input.day.dayType === "scenic_cruising") return false;
  const todayIso = input.todayIso ?? getTodayIso();
  return getWeatherRefreshMode(input.day.date, todayIso) !== "past_day";
}

export function buildWeatherCardModelFromSnapshot(input: {
  day: Pick<ItineraryDayRecord, "date" | "dayType" | "title">;
  port?: Pick<Port, "geo" | "weatherSeasonalitySummary" | "confidence" | "name"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso?: string;
  forecastWindowDays?: number;
  allowHistoricalLookup?: boolean;
  offlineAttempted?: boolean;
}): WeatherCardModel {
  const todayIso = input.todayIso ?? getTodayIso();
  const refreshMode = getWeatherRefreshMode(input.day.date, todayIso, input.forecastWindowDays ?? OPEN_METEO_FORECAST_WINDOW_DAYS);
  const readinessState = deriveWeatherReadinessState({
    day: input.day,
    port: input.port,
    snapshot: input.snapshot,
    todayIso,
    offlineAttempted: input.offlineAttempted,
  });
  const state = deriveLegacyWeatherState({ readinessState, refreshMode, snapshot: input.snapshot });
  const snapshot = input.snapshot;
  const portName = input.port?.name ?? input.day.title ?? "Port not recorded";
  const visitDateLabel = formatWeatherDateLabel(input.day.date);
  const weatherDate = snapshot?.forecastDate ?? snapshot?.date;
  const weatherDateLabel = weatherDate ? formatWeatherDateLabel(weatherDate) : "Not refreshed yet";
  const forecastExpectedFrom = refreshMode === "weather_now_in_port"
    ? snapshot?.forecastExpectedFrom ?? getForecastExpectedFrom(input.day.date, input.forecastWindowDays ?? OPEN_METEO_FORECAST_WINDOW_DAYS)
    : snapshot?.forecastExpectedFrom;
  const forecastExpectedFromLabel = forecastExpectedFrom ? formatWeatherDateLabel(forecastExpectedFrom) : undefined;
  const weatherContext = snapshot?.weatherContext
    ?? (refreshMode === "same_day_check"
      ? "same_day_check"
      : refreshMode === "visit_date_forecast"
        ? "visit_date_forecast"
        : refreshMode === "weather_now_in_port"
          ? "weather_now_in_port"
          : "observed");
  const buttonState: WeatherButtonState =
    readinessState === "missing_coordinates" ? "missing_coordinates"
      : refreshMode === "past_day" ? "unavailable"
        : input.offlineAttempted ? "offline"
          : "idle";

  return createWeatherCardModel({
    portName,
    visitDate: input.day.date,
    visitDateLabel,
    weatherDate,
    weatherDateLabel,
    weatherContext,
    forecastExpectedFrom,
    forecastExpectedFromLabel,
    readinessState,
    state,
    conditionSummary: snapshot?.conditionSummary
      ?? (readinessState === "forecast_pending"
        ? "Forecast pending"
        : readinessState === "missing_coordinates"
          ? "Coordinates needed"
          : readinessState === "weather_now_context_only"
            ? "Current destination context"
            : (input.port?.weatherSeasonalitySummary ?? "Weather not refreshed yet")),
    capturedAt: snapshot?.capturedAt,
    sourceName: snapshot?.sourceName ?? "Open-Meteo",
    sourceAttribution: snapshot?.sourceAttribution ?? "Weather data by Open-Meteo",
    temperatureHighC: snapshot?.temperatureHighC,
    temperatureLowC: snapshot?.temperatureLowC,
    temperatureCurrentC: snapshot?.temperatureCurrentC,
    precipitationChance: snapshot?.precipitationChance,
    precipitationMm: snapshot?.precipitationMm,
    windSpeedKph: snapshot?.windSpeedKph,
    uvIndex: snapshot?.uvIndex,
    apparentTemperatureC: snapshot?.apparentTemperatureC,
    refreshState: snapshot?.refreshState ?? "ready",
    refreshReason: snapshot?.refreshReason,
    refreshError: snapshot?.refreshError,
    refreshRecommended: snapshot?.refreshRecommended ?? (readinessState === "forecast_pending" || readinessState === "stale"),
    buttonState,
    isVisitDateForecast: snapshot?.isVisitDateForecast ?? (weatherContext === "visit_date_forecast" || weatherContext === "same_day_check"),
    satisfiesVisitForecastReadiness: snapshot?.satisfiesVisitForecastReadiness ?? false,
    lockedLabel: weatherContext === "observed" ? "Observed weather preserved" : undefined,
  });
}

export function buildWeatherBadgeLabel(model: WeatherCardModel) {
  return model.badgeLabel;
}

export function buildWeatherStateHint(snapshot?: WeatherSnapshotRecord) {
  if (!snapshot) return undefined;
  if (snapshot.weatherContext === "observed") return "Observed weather preserved";
  if (snapshot.refreshRecommended) return "Refresh recommended";
  return undefined;
}
