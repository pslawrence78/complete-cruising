import type { ItineraryDayRecord, Port, WeatherSnapshot, WeatherSnapshotReviewEvent } from "../../types";
import type { WeatherSnapshotConflict, WeatherSnapshotDifference, WeatherSnapshotThresholds } from "./weatherSnapshotReviewTypes";

export const WEATHER_SNAPSHOT_REVIEW_THRESHOLDS: WeatherSnapshotThresholds = {
  temperatureHighDeltaC: 2,
  temperatureLowDeltaC: 2,
  precipitationProbabilityDelta: 15,
  windSpeedDeltaKph: 10,
};

function formatValue(value?: string | number | boolean) {
  if (value === undefined) return "not recorded";
  if (typeof value === "boolean") return value ? "yes" : "no";
  return String(value);
}

function buildNumericDifference(
  field: string,
  label: string,
  preferredValue: number | undefined,
  competingValue: number | undefined,
  threshold: number,
  unit: string,
) {
  if (preferredValue === undefined && competingValue === undefined) return undefined;
  const delta = Math.abs((competingValue ?? 0) - (preferredValue ?? 0));
  const material = preferredValue === undefined || competingValue === undefined || delta >= threshold;
  return {
    field,
    preferredValue,
    competingValue,
    material,
    explanation: preferredValue === undefined || competingValue === undefined
      ? `${label} is only recorded in one snapshot.`
      : `${label} has changed from ${Math.round(preferredValue)}${unit} to ${Math.round(competingValue)}${unit}.`,
  } satisfies WeatherSnapshotDifference;
}

function buildDifference(
  field: string,
  preferredValue: string | number | boolean | undefined,
  competingValue: string | number | boolean | undefined,
  explanation: string,
  material = true,
) {
  if (preferredValue === competingValue) return undefined;
  return {
    field,
    preferredValue,
    competingValue,
    material,
    explanation,
  } satisfies WeatherSnapshotDifference;
}

export function compareWeatherSnapshots(
  preferredSnapshot: WeatherSnapshot,
  competingSnapshot: WeatherSnapshot,
  thresholds: WeatherSnapshotThresholds = WEATHER_SNAPSHOT_REVIEW_THRESHOLDS,
) {
  const differences: WeatherSnapshotDifference[] = [];
  const add = (difference: WeatherSnapshotDifference | undefined) => {
    if (difference) differences.push(difference);
  };

  add(buildNumericDifference(
    "temperatureHighC",
    "High temperature",
    preferredSnapshot.temperatureHighC,
    competingSnapshot.temperatureHighC,
    thresholds.temperatureHighDeltaC,
    "C",
  ));
  add(buildNumericDifference(
    "temperatureLowC",
    "Low temperature",
    preferredSnapshot.temperatureLowC,
    competingSnapshot.temperatureLowC,
    thresholds.temperatureLowDeltaC,
    "C",
  ));
  add(buildNumericDifference(
    "precipitationChance",
    "Rain probability",
    preferredSnapshot.precipitationChance,
    competingSnapshot.precipitationChance,
    thresholds.precipitationProbabilityDelta,
    "%",
  ));
  add(buildNumericDifference(
    "windSpeedKph",
    "Wind speed",
    preferredSnapshot.windSpeedKph,
    competingSnapshot.windSpeedKph,
    thresholds.windSpeedDeltaKph,
    " km/h",
  ));
  add(buildDifference(
    "conditionSummary",
    preferredSnapshot.conditionSummary,
    competingSnapshot.conditionSummary,
    `Condition summary has changed from ${formatValue(preferredSnapshot.conditionSummary)} to ${formatValue(competingSnapshot.conditionSummary)}.`,
  ));
  add(buildDifference(
    "weatherContext",
    preferredSnapshot.weatherContext,
    competingSnapshot.weatherContext,
    `The preferred snapshot is ${formatValue(preferredSnapshot.weatherContext).replaceAll("_", " ")}, while the competing snapshot is ${formatValue(competingSnapshot.weatherContext).replaceAll("_", " ")}.`,
  ));
  add(buildDifference(
    "confidence",
    preferredSnapshot.confidence.confidence,
    competingSnapshot.confidence.confidence,
    `Confidence differs from ${formatValue(preferredSnapshot.confidence.confidence)} to ${formatValue(competingSnapshot.confidence.confidence)}.`,
  ));
  add(buildDifference(
    "reviewStatus",
    preferredSnapshot.confidence.reviewStatus,
    competingSnapshot.confidence.reviewStatus,
    `Review status differs from ${formatValue(preferredSnapshot.confidence.reviewStatus).replaceAll("_", " ")} to ${formatValue(competingSnapshot.confidence.reviewStatus).replaceAll("_", " ")}.`,
  ));
  add(buildDifference(
    "refreshState",
    preferredSnapshot.refreshState,
    competingSnapshot.refreshState,
    `Refresh status differs from ${formatValue(preferredSnapshot.refreshState)} to ${formatValue(competingSnapshot.refreshState)}.`,
  ));
  add(buildDifference(
    "sourceName",
    preferredSnapshot.sourceName,
    competingSnapshot.sourceName,
    `Source differs from ${formatValue(preferredSnapshot.sourceName)} to ${formatValue(competingSnapshot.sourceName)}.`,
    false,
  ));
  add(buildDifference(
    "capturedAt",
    preferredSnapshot.capturedAt,
    competingSnapshot.capturedAt,
    "A newer snapshot exists alongside the current preferred selection.",
  ));

  return differences;
}

export function buildWeatherSnapshotConflicts(input: {
  itineraryDays: readonly { day: ItineraryDayRecord; port?: Port }[];
  snapshots: readonly WeatherSnapshot[];
  reviewEvents?: readonly WeatherSnapshotReviewEvent[];
  thresholds?: WeatherSnapshotThresholds;
}) {
  const snapshotsByDay = new Map<string, WeatherSnapshot[]>();
  for (const snapshot of input.snapshots) {
    snapshotsByDay.set(snapshot.itineraryDayId, [...(snapshotsByDay.get(snapshot.itineraryDayId) ?? []), snapshot]);
  }

  return input.itineraryDays.map(({ day, port }) => {
    const candidates = (snapshotsByDay.get(day.id) ?? []).slice().sort((left, right) => left.capturedAt.localeCompare(right.capturedAt));
    const preferredSnapshot = candidates.find((snapshot) => snapshot.id === day.weatherSnapshotId) ?? candidates.at(-1);
    const competingSnapshots = candidates.filter((snapshot) => snapshot.id !== preferredSnapshot?.id);
    const materialDifferences = preferredSnapshot
      ? competingSnapshots.flatMap((snapshot) => compareWeatherSnapshots(preferredSnapshot, snapshot, input.thresholds))
      : [];
    const hasMaterialDifference = materialDifferences.some((difference) => difference.material);
    const newerCompetingSnapshot = preferredSnapshot
      ? competingSnapshots.some((snapshot) => snapshot.capturedAt > preferredSnapshot.capturedAt)
      : false;
    const reviewEvents = (input.reviewEvents ?? []).filter((event) => event.itineraryDayId === day.id);

    const recommendedReviewState =
      candidates.length <= 1
        ? "no_conflict"
        : preferredSnapshot && newerCompetingSnapshot && hasMaterialDifference
          ? "stale_preferred"
          : preferredSnapshot && !hasMaterialDifference
            ? "preferred_selected"
            : "review_recommended";

    return {
      itineraryDayId: day.id,
      forecastDate: preferredSnapshot?.forecastDate ?? preferredSnapshot?.date ?? day.date,
      dayTitle: port?.name ?? day.title ?? `Day ${day.dayNumber}`,
      dayType: day.dayType,
      portName: day.portId ? port?.name : undefined,
      preferredSnapshotId: preferredSnapshot?.id,
      candidateSnapshotIds: candidates.map((snapshot) => snapshot.id),
      materialDifferences,
      recommendedReviewState,
      preferredSnapshot,
      competingSnapshots,
      reviewEvents,
    } satisfies WeatherSnapshotConflict;
  }).filter((conflict) => conflict.candidateSnapshotIds.length > 0);
}
