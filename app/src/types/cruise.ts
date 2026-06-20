import type { z } from "zod";
import type { AppSettingSchema, CabinSchema, CountrySchema, CruiseLineSchema, DocumentItemSchema, FamilyNoteSchema, ItineraryDaySchema, SailingSchema, TravellerSchema, WeatherSnapshotSchema } from "../schemas";

export type CruiseLine = z.infer<typeof CruiseLineSchema>;
export type Cabin = z.infer<typeof CabinSchema>;
export type Traveller = z.infer<typeof TravellerSchema>;
export type Sailing = z.infer<typeof SailingSchema>;
export type ItineraryDayRecord = z.infer<typeof ItineraryDaySchema>;
export type Country = z.infer<typeof CountrySchema>;
export type WeatherSnapshot = z.infer<typeof WeatherSnapshotSchema>;
export type DocumentItem = z.infer<typeof DocumentItemSchema>;
export type FamilyNote = z.infer<typeof FamilyNoteSchema>;
export type AppSetting = z.infer<typeof AppSettingSchema>;
