import {
  AppSettingSchema,
  AttractionSchema,
  CountrySchema,
  CruiseLineSchema,
  DayGuideSchema,
  EnrichmentSectionSchema,
  ItineraryDaySchema,
  MemoryEntrySchema,
  PortSchema,
  SailingSchema,
  ShipSchema,
  ShorePlanSchema,
  WeatherSnapshotSchema,
} from "../schemas";
import {
  illustrativeConfidence,
  sampleAlmanacPreview,
  sampleAttractionRecords,
  sampleAudit,
  sampleDayGuideRecord,
  sampleEnrichmentSections,
  sampleItineraryDayRecord,
  sampleMemoryEntries,
  samplePortRecord,
  sampleSailingRecord,
  sampleShipRecord,
  sampleShorePlanRecords,
  sampleWeatherRecord,
} from "../data/sampleSchemaData";
import { sampleItineraryData } from "../data/sampleItineraryData";
import { db, type CompleteCruisingDb } from "./completeCruisingDb";

export const ACTIVE_SAILING_SETTING = "activeSailingId";
export const SELECTED_TODAY_DAY_SETTING = "selectedTodayDayId";

const cruiseLine = CruiseLineSchema.parse({
  id: "cruise-line-princess",
  name: "Princess Cruises",
  audit: sampleAudit,
  confidence: illustrativeConfidence,
});

const countries = CountrySchema.array().parse([
  { id: "country-italy", name: "Italy", isoCode: "IT", flagEmoji: "🇮🇹", primaryLanguage: "Italian", currencyCode: "EUR", currencyName: "Euro", sebFact: "Italy's Campania coast curves around the Bay of Naples beneath Mount Vesuvius.", audit: sampleAudit, confidence: illustrativeConfidence },
  { id: "country-greece", name: "Greece", isoCode: "GR", audit: sampleAudit, confidence: illustrativeConfidence },
  { id: "country-turkiye", name: "Türkiye", isoCode: "TR", audit: sampleAudit, confidence: illustrativeConfidence },
  { id: "country-montenegro", name: "Montenegro", isoCode: "ME", audit: sampleAudit, confidence: illustrativeConfidence },
  { id: "country-spain", name: "Spain", isoCode: "ES", audit: sampleAudit, confidence: illustrativeConfidence },
]);

const supportingPortSpecs = [
  ["port-civitavecchia", "Civitavecchia", "country-italy"],
  ["port-chania", "Souda Bay / Chania", "country-greece"],
  ["port-kusadasi", "Kusadasi / Ephesus", "country-turkiye"],
  ["port-mykonos", "Mykonos", "country-greece"],
  ["port-piraeus", "Athens / Piraeus", "country-greece"],
  ["port-santorini", "Santorini", "country-greece"],
  ["port-bar", "Bar", "country-montenegro"],
  ["port-corfu", "Corfu", "country-greece"],
  ["port-messina", "Messina", "country-italy"],
  ["port-barcelona", "Barcelona", "country-spain"],
] as const;

const supportingPorts = PortSchema.array().parse(supportingPortSpecs.map(([id, name, countryId]) => ({
  id,
  name,
  countryId,
  overview: "Illustrative itinerary reference; reusable guidebook enrichment has not started.",
  confidence: illustrativeConfidence,
  audit: sampleAudit,
  sampleOnly: true,
  dataCaveat: "Illustrative port shell only. Port logistics and visit details remain unconfirmed.",
})));

const itineraryPortIds: Record<string, string> = {
  "day-01-civitavecchia": "port-civitavecchia",
  "day-04-chania": "port-chania",
  "day-06-ephesus": "port-kusadasi",
  "day-07-mykonos": "port-mykonos",
  "day-08-athens": "port-piraeus",
  "day-09-santorini": "port-santorini",
  "day-11-bar": "port-bar",
  "day-12-corfu": "port-corfu",
  "day-13-messina": "port-messina",
  "day-15-barcelona": "port-barcelona",
};

const itineraryDays = ItineraryDaySchema.array().parse(sampleItineraryData.days.map((day) => {
  if (day.id === sampleItineraryDayRecord.id) return sampleItineraryDayRecord;
  const date = `2026-08-${String(day.dayNumber).padStart(2, "0")}`;
  return {
    id: day.id,
    sailingId: sampleSailingRecord.id,
    dayNumber: day.dayNumber,
    date,
    dayType: day.dayType,
    title: day.title,
    portId: itineraryPortIds[day.id],
    arrivalTime: day.arrivalTime,
    departureTime: day.departureTime,
    allAboardTime: day.allAboardTime,
    operationalWarnings: ["Illustrative itinerary shell; confirm all operational details before travel."],
    confidence: { ...illustrativeConfidence, confidence: day.confidence.level },
    audit: sampleAudit,
    sampleOnly: true,
    dataCaveat: "Illustrative itinerary shell derived from the existing presentation sample.",
  };
}));

const activeSailingSetting = AppSettingSchema.parse({
  id: "setting-active-sailing",
  key: ACTIVE_SAILING_SETTING,
  value: sampleSailingRecord.id,
  audit: sampleAudit,
});

const selectedTodaySetting = AppSettingSchema.parse({
  id: "setting-selected-today-day",
  key: SELECTED_TODAY_DAY_SETTING,
  value: sampleItineraryDayRecord.id,
  audit: sampleAudit,
});

/** Validate all canonical records before a single transaction writes them. */
function validatedSeed() {
  return {
    sailing: SailingSchema.parse(sampleSailingRecord),
    ship: ShipSchema.parse(sampleShipRecord),
    port: PortSchema.parse(samplePortRecord),
    itineraryDays,
    attractions: AttractionSchema.array().parse(sampleAttractionRecords),
    shorePlans: ShorePlanSchema.array().parse(sampleShorePlanRecords),
    dayGuide: DayGuideSchema.parse(sampleDayGuideRecord),
    weather: WeatherSnapshotSchema.parse(sampleWeatherRecord),
    enrichment: EnrichmentSectionSchema.array().parse(sampleEnrichmentSections),
    memories: MemoryEntrySchema.array().parse(sampleMemoryEntries),
  };
}

export async function seedSampleData(database: CompleteCruisingDb = db): Promise<void> {
  // A seeded sailing may since have been reviewed or edited locally. Never replace it silently.
  if (await database.sailings.get(sampleSailingRecord.id)) return;
  const seed = validatedSeed();
  await database.transaction("rw", database.tables, async () => {
    await database.cruiseLines.put(cruiseLine);
    await database.countries.bulkPut(countries);
    await database.ships.put(seed.ship);
    await database.ports.bulkPut([seed.port, ...supportingPorts]);
    await database.sailings.put(seed.sailing);
    await database.itineraryDays.bulkPut(seed.itineraryDays);
    await database.attractions.bulkPut(seed.attractions);
    await database.shorePlans.bulkPut(seed.shorePlans);
    await database.dayGuides.put(seed.dayGuide);
    await database.weatherSnapshots.put(seed.weather);
    await database.enrichmentSections.bulkPut(seed.enrichment);
    await database.memoryEntries.bulkPut(seed.memories);
    await database.adventureAlmanacExports.put(sampleAlmanacPreview);
    await database.appSettings.bulkPut([activeSailingSetting, selectedTodaySetting]);
  });
}

export async function ensureSampleData(database: CompleteCruisingDb = db): Promise<void> {
  if (!(await database.sailings.get(sampleSailingRecord.id))) await seedSampleData(database);
}
