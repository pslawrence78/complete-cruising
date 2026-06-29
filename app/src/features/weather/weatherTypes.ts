import type { z } from "zod";
import type { WeatherContextSchema, WeatherRefreshStateSchema, WeatherSnapshotSchema, WeatherStateSchema } from "../../schemas";

export type WeatherState = z.infer<typeof WeatherStateSchema>;
export type WeatherContext = z.infer<typeof WeatherContextSchema>;
export type WeatherRefreshState = z.infer<typeof WeatherRefreshStateSchema>;
export type WeatherSnapshotRecord = z.infer<typeof WeatherSnapshotSchema>;
export type WeatherRefreshMode = "visit_date_forecast" | "weather_now_in_port" | "same_day_check" | "past_day";
export type WeatherReadinessState =
  | "visit_forecast_ready"
  | "same_day_checked"
  | "weather_now_context_only"
  | "forecast_pending"
  | "missing_coordinates"
  | "stale"
  | "offline_unavailable"
  | "not_applicable";
export type WeatherButtonState =
  | "idle"
  | "refreshing"
  | "refreshed"
  | "offline"
  | "unavailable"
  | "missing_coordinates"
  | "failed"
  | "blocked";

export interface WeatherDailyReading {
  date: string;
  temperatureHighC?: number;
  temperatureLowC?: number;
  precipitationChance?: number;
  precipitationMm?: number;
  windSpeedKph?: number;
  windGustKph?: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
  weatherCode?: number;
  temperatureCurrentC?: number;
  apparentTemperatureC?: number;
  humidity?: number;
}

export interface WeatherRefreshRequest {
  sailingId: string;
  itineraryDayId: string;
  date: string;
  latitude: number;
  longitude: number;
  portId?: string;
  sourceName?: string;
  sourceUrl?: string;
  allowHistoricalLookup?: boolean;
}

export interface WeatherRefreshOutcome {
  status: "saved" | "skipped" | "failed" | "offline" | "blocked" | "unavailable";
  buttonState: WeatherButtonState;
  refreshed: number;
  skipped: number;
  blocked: number;
  message: string;
  snapshots: readonly WeatherSnapshotRecord[];
  errors: readonly string[];
}

export interface WeatherCardModel {
  confidenceLabel?: string;
  confidenceLevel: "confirmed" | "high" | "medium" | "low" | "inferred" | "unknown";
  state: WeatherState;
  stateLabel: string;
  readinessState: WeatherReadinessState;
  readinessLabel: string;
  badgeLabel: string;
  badgeTone: "confirmed" | "review" | "refresh";
  summary: string;
  contextMessage: string;
  portName: string;
  visitDate: string;
  visitDateLabel: string;
  weatherDate?: string;
  weatherDateLabel: string;
  weatherTypeLabel: string;
  weatherContext?: WeatherContext;
  forecastExpectedFrom?: string;
  forecastExpectedFromLabel?: string;
  sourceName: string;
  temperatureLabel: string;
  rainLabel: string;
  windLabel: string;
  uvLabel?: string;
  comfortSummary: string;
  clothingGuidance: string;
  planImpact: string;
  sourceLabel: string;
  attributionLabel: string;
  updatedLabel: string;
  refreshLabel: string;
  refreshState: WeatherRefreshState;
  refreshReason?: string;
  refreshError?: string;
  canRefresh: boolean;
  buttonState: WeatherButtonState;
  isVisitDateForecast: boolean;
  satisfiesVisitForecastReadiness: boolean;
  lockedLabel?: string;
}
