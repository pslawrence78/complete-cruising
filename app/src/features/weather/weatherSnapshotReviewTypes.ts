import type { ItineraryDayRecord, WeatherSnapshot, WeatherSnapshotReviewEvent } from "../../types";

export interface WeatherSnapshotDifference {
  field: string;
  preferredValue?: string | number | boolean;
  competingValue?: string | number | boolean;
  material: boolean;
  explanation: string;
}

export interface WeatherSnapshotConflict {
  itineraryDayId: string;
  forecastDate: string;
  dayTitle: string;
  dayType: ItineraryDayRecord["dayType"];
  portName?: string;
  preferredSnapshotId?: string;
  candidateSnapshotIds: string[];
  materialDifferences: WeatherSnapshotDifference[];
  recommendedReviewState: "no_conflict" | "review_recommended" | "preferred_selected" | "stale_preferred";
  preferredSnapshot?: WeatherSnapshot;
  competingSnapshots: readonly WeatherSnapshot[];
  reviewEvents: readonly WeatherSnapshotReviewEvent[];
}

export interface WeatherSnapshotThresholds {
  temperatureHighDeltaC: number;
  temperatureLowDeltaC: number;
  precipitationProbabilityDelta: number;
  windSpeedDeltaKph: number;
}
