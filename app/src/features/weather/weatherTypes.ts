import type { z } from "zod";
import type { WeatherRefreshStateSchema, WeatherSnapshotSchema, WeatherStateSchema } from "../../schemas";

export type WeatherState = z.infer<typeof WeatherStateSchema>;
export type WeatherRefreshState = z.infer<typeof WeatherRefreshStateSchema>;
export type WeatherSnapshotRecord = z.infer<typeof WeatherSnapshotSchema>;

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
  status: "saved" | "skipped" | "failed";
  refreshed: number;
  skipped: number;
  message: string;
  snapshots: readonly WeatherSnapshotRecord[];
  errors: readonly string[];
}

export interface WeatherCardModel {
  confidenceLabel?: string;
  confidenceLevel: "confirmed" | "high" | "medium" | "low" | "inferred" | "unknown";
  state: WeatherState;
  stateLabel: string;
  badgeLabel: string;
  badgeTone: "confirmed" | "review" | "refresh";
  summary: string;
  temperatureLabel: string;
  rainLabel: string;
  windLabel: string;
  uvLabel?: string;
  comfortSummary: string;
  clothingGuidance: string;
  planImpact: string;
  sourceLabel: string;
  updatedLabel: string;
  refreshLabel: string;
  refreshState: WeatherRefreshState;
  refreshReason?: string;
  refreshError?: string;
  canRefresh: boolean;
  lockedLabel?: string;
}
