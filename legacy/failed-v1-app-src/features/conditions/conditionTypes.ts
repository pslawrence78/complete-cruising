import type { ConfidenceMetadata, DayGuide, ItineraryDayRecord, ShorePlanRecord, WeatherSnapshot } from "../../types";

export type CruiseConditionStatus =
  | "ready"
  | "review_needed"
  | "forecast_pending"
  | "climate_only"
  | "same_day_check_needed"
  | "stale"
  | "missing"
  | "not_applicable";

export type DayReadinessStatus =
  | "ready_for_today"
  | "usable_with_cautions"
  | "needs_review"
  | "not_ready";

export type ReadinessSeverity =
  | "positive"
  | "notice"
  | "caution"
  | "critical"
  | "neutral";

export interface ReadinessFlag {
  id: string;
  label: string;
  severity: ReadinessSeverity;
}

export interface ReadinessDimension {
  key: "timing" | "weather" | "plan" | "family" | "trust";
  label: string;
  score: 0 | 1 | 2;
  status: CruiseConditionStatus;
  summary: string;
  flags: readonly ReadinessFlag[];
}

export interface DayReadinessInput {
  day: ItineraryDayRecord;
  weather?: WeatherSnapshot;
  guide?: DayGuide;
  plans: readonly ShorePlanRecord[];
  todayIso?: string;
}

export interface DayReadinessAssessment {
  status: DayReadinessStatus;
  statusLabel: string;
  severity: ReadinessSeverity;
  readinessScore: number;
  summary: string;
  cruiseConditionLabel: string;
  cruiseConditionStatus: CruiseConditionStatus;
  timing: ReadinessDimension;
  weather: ReadinessDimension;
  plan: ReadinessDimension;
  family: ReadinessDimension;
  trust: ReadinessDimension;
  nextActions: readonly string[];
  badges: readonly string[];
  metadata: {
    confidenceLevel: ConfidenceMetadata["confidence"];
    reviewStatus: ConfidenceMetadata["reviewStatus"] | "not_reviewed";
    refreshRecommended: boolean;
  };
}

export interface CruiseConditionsSummary {
  readyDays: number;
  usableDays: number;
  reviewDays: number;
  notReadyDays: number;
  climateOnlyDays: number;
  forecastPendingDays: number;
  nextAttentionDay?: {
    dayId: string;
    title: string;
    reason: string;
  };
  activeDay?: {
    dayId: string;
    title: string;
    statusLabel: string;
  };
}
