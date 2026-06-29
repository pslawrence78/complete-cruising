import { db, type CompleteCruisingDb } from "../completeCruisingDb";
import type { WeatherSnapshot } from "../../types";

export const getWeatherSnapshotsForSailing = (sailingId: string, database: CompleteCruisingDb = db) =>
  database.weatherSnapshots.where("sailingId").equals(sailingId).sortBy("date");

export const getWeatherSnapshotsForItineraryDay = (itineraryDayId: string, database: CompleteCruisingDb = db) =>
  database.weatherSnapshots.where("itineraryDayId").equals(itineraryDayId).sortBy("capturedAt");

export async function getLatestWeatherSnapshotForItineraryDay(itineraryDayId: string, database: CompleteCruisingDb = db) {
  const snapshots = await getWeatherSnapshotsForItineraryDay(itineraryDayId, database);
  return snapshots.at(-1);
}

export async function getWeatherSnapshotForSailingDay(sailingId: string, itineraryDayId: string, database: CompleteCruisingDb = db) {
  const snapshots = await database.weatherSnapshots.where("[sailingId+itineraryDayId+capturedAt]").between([sailingId, itineraryDayId, ""], [sailingId, itineraryDayId, "\uffff"]).toArray();
  return snapshots.at(-1);
}

export async function getWeatherSnapshotForDate(sailingId: string, date: string, database: CompleteCruisingDb = db) {
  const snapshots = await database.weatherSnapshots.where("[sailingId+date]").equals([sailingId, date]).sortBy("capturedAt");
  return snapshots.at(-1);
}

export async function getLatestWeatherSnapshotsByDay(sailingId: string, database: CompleteCruisingDb = db) {
  const snapshots = await getWeatherSnapshotsForSailing(sailingId, database);
  const byDay = new Map<string, WeatherSnapshot>();
  for (const snapshot of snapshots) {
    const current = byDay.get(snapshot.itineraryDayId);
    if (!current || current.capturedAt < snapshot.capturedAt) byDay.set(snapshot.itineraryDayId, snapshot);
  }
  return byDay;
}

export async function getRefreshStateSnapshots(sailingId: string, database: CompleteCruisingDb = db) {
  return database.weatherSnapshots.where("sailingId").equals(sailingId).toArray();
}

export async function upsertWeatherSnapshot(snapshot: WeatherSnapshot, database: CompleteCruisingDb = db) {
  await database.weatherSnapshots.put(snapshot);
  return snapshot;
}

