import { db, type CompleteCruisingDb } from "../completeCruisingDb";
import type { WeatherSnapshotReviewEvent } from "../../types";

export async function getWeatherSnapshotReviewEventsForSailing(sailingId: string, database: CompleteCruisingDb = db) {
  return database.weatherSnapshotReviewEvents.where("sailingId").equals(sailingId).sortBy("createdAt");
}

export async function addWeatherSnapshotReviewEvent(event: WeatherSnapshotReviewEvent, database: CompleteCruisingDb = db) {
  await database.weatherSnapshotReviewEvents.put(event);
  return event;
}
