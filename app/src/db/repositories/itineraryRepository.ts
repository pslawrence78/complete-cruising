import { db, type CompleteCruisingDb } from "../completeCruisingDb";
import { getSelectedTodayDayId } from "./appSettingsRepository";

export const getItineraryDaysForSailing = (sailingId: string, database: CompleteCruisingDb = db) =>
  database.itineraryDays.where("sailingId").equals(sailingId).sortBy("dayNumber");
export const getItineraryDayById = (id: string, database: CompleteCruisingDb = db) => database.itineraryDays.get(id);

export async function getTodayItineraryDay(sailingId: string, database: CompleteCruisingDb = db) {
  const selectedId = await getSelectedTodayDayId(database);
  const selected = selectedId ? await database.itineraryDays.get(selectedId) : undefined;
  if (selected?.sailingId === sailingId) return selected;
  return database.itineraryDays.where("sailingId").equals(sailingId).sortBy("dayNumber").then((days) => days[0]);
}

export async function getItineraryWithPorts(sailingId: string, database: CompleteCruisingDb = db) {
  const days = await getItineraryDaysForSailing(sailingId, database);
  return Promise.all(days.map(async (day) => ({ day, port: day.portId ? await database.ports.get(day.portId) : undefined })));
}

