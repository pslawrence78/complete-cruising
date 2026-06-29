import { db, type CompleteCruisingDb } from "../../db/completeCruisingDb";
import { addWeatherSnapshotReviewEvent } from "../../db/repositories";
import type { WeatherSnapshot, WeatherSnapshotReviewEvent } from "../../types";

function makeReviewEvent(input: Omit<WeatherSnapshotReviewEvent, "id" | "createdAt">): WeatherSnapshotReviewEvent {
  return {
    ...input,
    id: `weather-review-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
}

export async function selectPreferredWeatherSnapshot(input: {
  itineraryDayId: string;
  snapshotId: string;
  notes?: string;
  reason?: string;
}, database: CompleteCruisingDb = db) {
  const day = await database.itineraryDays.get(input.itineraryDayId);
  const snapshot = await database.weatherSnapshots.get(input.snapshotId);
  if (!day || !snapshot || snapshot.itineraryDayId !== input.itineraryDayId) {
    throw new Error("Preferred weather snapshot could not be selected.");
  }

  const previousSnapshotId = day.weatherSnapshotId;
  await database.itineraryDays.update(day.id, { weatherSnapshotId: snapshot.id });

  const event = makeReviewEvent({
    sailingId: day.sailingId,
    itineraryDayId: day.id,
    forecastDate: snapshot.forecastDate ?? snapshot.date,
    action: previousSnapshotId === snapshot.id
      ? "preferred_snapshot_restored"
      : "preferred_snapshot_selected",
    fromSnapshotId: previousSnapshotId,
    toSnapshotId: snapshot.id,
    candidateSnapshotIds: (await database.weatherSnapshots.where("itineraryDayId").equals(day.id).toArray()).map((candidate) => candidate.id),
    reason: input.reason,
    notes: input.notes,
    createdBy: "user",
  });
  await addWeatherSnapshotReviewEvent(event, database);
  return event;
}

export async function acknowledgeWeatherSnapshotConflict(input: {
  itineraryDayId: string;
  snapshotIds: readonly string[];
  notes?: string;
  reason?: string;
}, database: CompleteCruisingDb = db) {
  const day = await database.itineraryDays.get(input.itineraryDayId);
  if (!day) throw new Error("Weather snapshot conflict could not be acknowledged.");

  const preferred = day.weatherSnapshotId ? await database.weatherSnapshots.get(day.weatherSnapshotId) : undefined;
  const event = makeReviewEvent({
    sailingId: day.sailingId,
    itineraryDayId: day.id,
    forecastDate: preferred?.forecastDate ?? preferred?.date ?? day.date,
    action: "conflict_acknowledged",
    fromSnapshotId: day.weatherSnapshotId,
    toSnapshotId: day.weatherSnapshotId,
    candidateSnapshotIds: [...input.snapshotIds],
    reason: input.reason,
    notes: input.notes,
    createdBy: "user",
  });
  await addWeatherSnapshotReviewEvent(event, database);
  return event;
}

export function describeSnapshotTiming(snapshot: WeatherSnapshot) {
  return snapshot.generatedAt ?? snapshot.capturedAt;
}
