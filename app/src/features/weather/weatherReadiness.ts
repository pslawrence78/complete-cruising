import type { ItineraryDayRecord, Port } from "../../types";
import type { WeatherCardModel, WeatherContext, WeatherRefreshMode, WeatherReadinessState, WeatherSnapshotRecord } from "./weatherTypes";

export const OPEN_METEO_FORECAST_WINDOW_DAYS = 16;
export const WEATHER_STALE_AFTER_MS = 72 * 60 * 60 * 1000;

function startOfIsoDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function addDays(date: string, offset: number) {
  const value = startOfIsoDate(date);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

export function compareIsoDates(left: string, right: string) {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

export function getWeatherRefreshMode(
  itineraryDate: string,
  currentDate: string,
  forecastWindowDays = OPEN_METEO_FORECAST_WINDOW_DAYS,
): WeatherRefreshMode {
  if (compareIsoDates(itineraryDate, currentDate) < 0) return "past_day";
  if (itineraryDate === currentDate) return "same_day_check";
  return compareIsoDates(itineraryDate, addDays(currentDate, forecastWindowDays)) <= 0
    ? "visit_date_forecast"
    : "weather_now_in_port";
}

export function getForecastExpectedFrom(
  itineraryDate: string,
  forecastWindowDays = OPEN_METEO_FORECAST_WINDOW_DAYS,
) {
  return addDays(itineraryDate, -forecastWindowDays);
}

export function hasPortCoordinates(
  port?: Pick<Port, "geo"> | null,
  snapshot?: Pick<WeatherSnapshotRecord, "latitude" | "longitude">,
) {
  return Boolean(
    (port?.geo
      && Number.isFinite(port.geo.latitude)
      && Number.isFinite(port.geo.longitude))
    || (snapshot
      && Number.isFinite(snapshot.latitude)
      && Number.isFinite(snapshot.longitude)),
  );
}

function inferWeatherContext(snapshot: Pick<WeatherSnapshotRecord, "snapshotType" | "weatherContext" | "forecastDate" | "date">, refreshMode: WeatherRefreshMode, todayIso: string, visitDate: string): WeatherContext {
  if (snapshot.weatherContext) return snapshot.weatherContext;
  switch (snapshot.snapshotType) {
    case "climate":
      return "climate_context";
    case "observed":
      return "observed";
    case "same_day":
      return "same_day_check";
    case "forecast":
      if ((snapshot.forecastDate ?? snapshot.date) === visitDate) {
        return visitDate === todayIso ? "same_day_check" : "visit_date_forecast";
      }
      return refreshMode === "weather_now_in_port" ? "weather_now_in_port" : "visit_date_forecast";
    default:
      return refreshMode === "weather_now_in_port" ? "weather_now_in_port" : "visit_date_forecast";
  }
}

export function isWeatherSnapshotStale(snapshot?: Pick<WeatherSnapshotRecord, "capturedAt" | "weatherContext" | "snapshotType">, now = Date.now()) {
  if (!snapshot?.capturedAt) return false;
  if (snapshot.weatherContext === "observed" || snapshot.snapshotType === "observed" || snapshot.snapshotType === "climate") return false;
  return now - new Date(snapshot.capturedAt).getTime() > WEATHER_STALE_AFTER_MS;
}

export function deriveWeatherReadinessState(input: {
  day: Pick<ItineraryDayRecord, "date" | "dayType">;
  port?: Pick<Port, "geo"> | null;
  snapshot?: WeatherSnapshotRecord;
  todayIso: string;
  offlineAttempted?: boolean;
}): WeatherReadinessState {
  if (input.day.dayType === "sea" || input.day.dayType === "scenic_cruising") return "not_applicable";
  if (input.offlineAttempted) return "offline_unavailable";
  if (!hasPortCoordinates(input.port, input.snapshot)) return "missing_coordinates";

  const refreshMode = getWeatherRefreshMode(input.day.date, input.todayIso);
  const snapshot = input.snapshot;
  const context = snapshot ? inferWeatherContext(snapshot, refreshMode, input.todayIso, input.day.date) : undefined;

  if (!snapshot) return refreshMode === "past_day" ? "not_applicable" : "forecast_pending";
  if (isWeatherSnapshotStale(snapshot)) return "stale";

  switch (context) {
    case "visit_date_forecast":
      return snapshot.satisfiesVisitForecastReadiness && snapshot.forecastDate === input.day.date
        ? "visit_forecast_ready"
        : "forecast_pending";
    case "same_day_check":
      return input.day.date === input.todayIso ? "same_day_checked" : "forecast_pending";
    case "weather_now_in_port":
      return "weather_now_context_only";
    case "observed":
      return "not_applicable";
    case "climate_context":
    default:
      return refreshMode === "past_day" ? "not_applicable" : "forecast_pending";
  }
}

export function deriveLegacyWeatherState(model: {
  readinessState: WeatherReadinessState;
  refreshMode: WeatherRefreshMode;
  snapshot?: WeatherSnapshotRecord;
}) {
  if (model.snapshot?.weatherContext === "climate_context" || model.snapshot?.snapshotType === "climate") {
    return "climate_expectation" as const;
  }
  if (model.snapshot?.weatherContext === "observed" || model.snapshot?.snapshotType === "observed") {
    return "day_locked" as const;
  }
  switch (model.readinessState) {
    case "visit_forecast_ready":
    case "same_day_checked":
      return "forecast_recent" as const;
    case "weather_now_context_only":
      return "climate_expectation" as const;
    case "missing_coordinates":
      return "missing_coordinates" as const;
    case "stale":
      return "forecast_stale" as const;
    case "not_applicable":
      return model.refreshMode === "past_day" ? "day_locked" as const : "climate_expectation" as const;
    case "offline_unavailable":
    case "forecast_pending":
    default:
      return model.refreshMode === "past_day" ? "historical_lookup_available" as const : "forecast_pending" as const;
  }
}

export function weatherRefreshModeFromCard(weather: Pick<WeatherCardModel, "weatherContext" | "visitDate">, todayIso: string): WeatherRefreshMode {
  if (weather.weatherContext === "same_day_check") return "same_day_check";
  if (weather.weatherContext === "visit_date_forecast") return "visit_date_forecast";
  if (weather.weatherContext === "weather_now_in_port") return "weather_now_in_port";
  return getWeatherRefreshMode(weather.visitDate, todayIso);
}
