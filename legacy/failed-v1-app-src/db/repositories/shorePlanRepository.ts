import { db, type CompleteCruisingDb } from "../completeCruisingDb";

export const getShorePlansForItineraryDay = (dayId: string, database: CompleteCruisingDb = db) =>
  database.shorePlans.where("itineraryDayId").equals(dayId).toArray();

export async function getSelectedShorePlanForDay(dayId: string, database: CompleteCruisingDb = db) {
  const plans = await getShorePlansForItineraryDay(dayId, database);
  return plans.find(({ status }) => status === "selected" || status === "booked");
}
