import {
  AppSettingSchema,
  CountrySchema,
  CruiseLineSchema,
  ItineraryDaySchema,
  PortSchema,
  SailingSchema,
  ShipSchema,
} from "../schemas";
import type { CompleteCruisingDb } from "./completeCruisingDb";
import { db } from "./completeCruisingDb";
import { ACTIVE_SAILING_SETTING, SELECTED_TODAY_DAY_SETTING } from "./seedDatabase";

export const REAL_SUN_PRINCESS_SAILING_ID = "sailing-eastern-mediterranean-cruise-mqxo1afu";

const audit = {
  createdAt: "2026-06-28T09:00:00.000Z",
  updatedAt: "2026-06-28T09:00:00.000Z",
  createdBy: "tranche-18b-onboarding",
  updatedBy: "tranche-18b-onboarding",
} as const;

const needsReviewConfidence = {
  confidence: "medium",
  reviewStatus: "needs_user_review",
  sourceType: "user_entered",
  sourceSummary: "Real Sun Princess 2026 sailing shell onboarded locally for MVP planning.",
  lastReviewedAt: null,
  refreshRecommended: true,
  refreshReason: "Check operational details against Princess material before travel.",
} as const;

const countries = CountrySchema.array().parse([
  { id: "country-italy", name: "Italy", isoCode: "IT", primaryLanguage: "Italian", currencyCode: "EUR", currencyName: "Euro", audit, confidence: needsReviewConfidence },
  { id: "country-greece", name: "Greece", isoCode: "GR", primaryLanguage: "Greek", currencyCode: "EUR", currencyName: "Euro", audit, confidence: needsReviewConfidence },
  { id: "country-turkiye", name: "Turkiye", isoCode: "TR", primaryLanguage: "Turkish", currencyCode: "TRY", currencyName: "Turkish lira", audit, confidence: needsReviewConfidence },
  { id: "country-montenegro", name: "Montenegro", isoCode: "ME", primaryLanguage: "Montenegrin", currencyCode: "EUR", currencyName: "Euro", audit, confidence: needsReviewConfidence },
  { id: "country-spain", name: "Spain", isoCode: "ES", primaryLanguage: "Spanish", currencyCode: "EUR", currencyName: "Euro", audit, confidence: needsReviewConfidence },
]);

const approximatePortGeo = {
  civitavecchia: { latitude: 42.0933, longitude: 11.7967, mapLabel: "Civitavecchia", locationNotes: "Approximate public port-area position for visual orientation only; terminal details are not confirmed." },
  naples: { latitude: 40.841, longitude: 14.263, mapLabel: "Naples", locationNotes: "Approximate port-city area for visual orientation only; berth and terminal details are not confirmed." },
  chania: { latitude: 35.493, longitude: 24.066, mapLabel: "Souda Bay / Chania", locationNotes: "Approximate Souda Bay / Chania area for visual orientation only; shuttle and docking details are not confirmed." },
  kusadasi: { latitude: 37.858, longitude: 27.263, mapLabel: "Kusadasi", locationNotes: "Approximate Kusadasi port area for visual orientation only; excursion start points are not confirmed." },
  mykonos: { latitude: 37.4467, longitude: 25.3289, mapLabel: "Mykonos", locationNotes: "Approximate Mykonos port/island area for visual orientation only; tender or shuttle arrangements are not confirmed." },
  piraeus: { latitude: 37.942, longitude: 23.646, mapLabel: "Piraeus", locationNotes: "Approximate Piraeus port area for visual orientation only; Athens transfer details are not confirmed." },
  santorini: { latitude: 36.393, longitude: 25.461, mapLabel: "Santorini", locationNotes: "Approximate Santorini island area for visual orientation only; tender landing details are not confirmed." },
  bar: { latitude: 42.093, longitude: 19.089, mapLabel: "Bar", locationNotes: "Approximate Bar port area for visual orientation only; local logistics are not confirmed." },
  corfu: { latitude: 39.624, longitude: 19.922, mapLabel: "Corfu", locationNotes: "Approximate Corfu port-town area for visual orientation only; arrival details are not confirmed." },
  messina: { latitude: 38.193, longitude: 15.556, mapLabel: "Messina", locationNotes: "Approximate Messina port-city area for visual orientation only; berth details are not confirmed." },
  barcelona: { latitude: 41.352, longitude: 2.173, mapLabel: "Barcelona", locationNotes: "Approximate Barcelona cruise port area for visual orientation only; terminal and onward travel details are not confirmed." },
} as const;

const visualGeoConfidence = { geocodeConfidence: "medium" as const };

const ports = PortSchema.array().parse([
  { id: "port-civitavecchia", name: "Civitavecchia", countryId: "country-italy", portType: "city", returnRiskDefault: "unknown", overview: "Rome's cruise gateway for embarkation. Terminal and transfer details still need review.", geo: { ...approximatePortGeo.civitavecchia, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-naples", name: "Naples", countryId: "country-italy", portType: "city", returnRiskDefault: "medium", overview: "A Mediterranean gateway for Naples, Vesuvius and Pompeii planning.", geo: { ...approximatePortGeo.naples, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-chania", name: "Souda Bay / Chania", countryId: "country-greece", portType: "mixed", returnRiskDefault: "unknown", overview: "Crete port call shell. Docking, shuttle and timings are not confirmed.", geo: { ...approximatePortGeo.chania, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-kusadasi", name: "Kusadasi / Ephesus", countryId: "country-turkiye", portType: "city", returnRiskDefault: "unknown", overview: "Turkiye port call shell for Ephesus planning. Excursion and return details need review.", geo: { ...approximatePortGeo.kusadasi, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-mykonos", name: "Mykonos", countryId: "country-greece", portType: "island", returnRiskDefault: "unknown", overview: "Island port shell. Tender or shuttle status is not confirmed locally.", geo: { ...approximatePortGeo.mykonos, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-piraeus", name: "Athens / Piraeus", countryId: "country-greece", portType: "city", returnRiskDefault: "unknown", overview: "Athens gateway shell. Transport and timing decisions need review.", geo: { ...approximatePortGeo.piraeus, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-santorini", name: "Santorini", countryId: "country-greece", portType: "tender", returnRiskDefault: "unknown", overview: "Santorini port shell. Tender status must remain user-confirmed only.", geo: { ...approximatePortGeo.santorini, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-bar", name: "Bar", countryId: "country-montenegro", portType: "mixed", returnRiskDefault: "unknown", overview: "Montenegro port shell. Local logistics remain unverified.", geo: { ...approximatePortGeo.bar, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-corfu", name: "Corfu", countryId: "country-greece", portType: "mixed", returnRiskDefault: "unknown", overview: "Corfu port shell. Keep Taranto/Corfu uncertainty visible where imported later.", geo: { ...approximatePortGeo.corfu, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-messina", name: "Messina", countryId: "country-italy", portType: "city", returnRiskDefault: "unknown", overview: "Sicily port shell. Local route options need enrichment and review.", geo: { ...approximatePortGeo.messina, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
  { id: "port-barcelona", name: "Barcelona", countryId: "country-spain", portType: "city", returnRiskDefault: "unknown", overview: "Disembarkation gateway shell. Terminal and onward travel details need review.", geo: { ...approximatePortGeo.barcelona, ...visualGeoConfidence }, audit, confidence: needsReviewConfidence },
]);

const daySpecs = [
  ["embarkation", "port-civitavecchia", "Civitavecchia"],
  ["port", "port-naples", "Naples"],
  ["sea", undefined, "At sea"],
  ["port", "port-chania", "Souda Bay / Chania"],
  ["sea", undefined, "At sea"],
  ["port", "port-kusadasi", "Kusadasi / Ephesus"],
  ["port", "port-mykonos", "Mykonos"],
  ["port", "port-piraeus", "Athens / Piraeus"],
  ["port", "port-santorini", "Santorini"],
  ["sea", undefined, "At sea"],
  ["port", "port-bar", "Bar"],
  ["port", "port-corfu", "Corfu"],
  ["port", "port-messina", "Messina"],
  ["sea", undefined, "At sea"],
  ["disembarkation", "port-barcelona", "Barcelona"],
] as const;

function addDays(date: string, offset: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

export function buildSunPrincess2026ItineraryRows(sailingId = REAL_SUN_PRINCESS_SAILING_ID) {
  return ItineraryDaySchema.array().parse(daySpecs.map(([dayType, portId, title], index) => ({
    id: `${sailingId}-day-${String(index + 1).padStart(2, "0")}`,
    sailingId,
    dayNumber: index + 1,
    date: addDays("2026-08-15", index),
    dayType,
    title,
    portId,
    tenderStatus: portId ? "unknown" : "not_applicable",
    operationalWarnings: ["Operational port times, all-aboard times and tender details are not confirmed in this local shell."],
    confidence: needsReviewConfidence,
    audit,
    dataCaveat: "Real local sailing shell. Operational details remain unverified until checked against Princess material.",
  })));
}

export async function ensureRealSunPrincessSailing(database: CompleteCruisingDb = db) {
  const cruiseLine = CruiseLineSchema.parse({ id: "cruise-line-princess", name: "Princess Cruises", audit, confidence: needsReviewConfidence });
  const ship = ShipSchema.parse({
    id: "ship-sun-princess",
    cruiseLineId: cruiseLine.id,
    name: "Sun Princess",
    shipClass: "Sphere class",
    shipOverview: "Reusable Sun Princess guidebook shell for the August 2026 sailing.",
    familySuitabilitySummary: "Guidebook content is held separately from sailing-specific itinerary records.",
    audit,
    confidence: needsReviewConfidence,
  });
  const sailing = SailingSchema.parse({
    id: REAL_SUN_PRINCESS_SAILING_ID,
    name: "Eastern Mediterranean Cruise",
    cruiseLineId: cruiseLine.id,
    shipId: ship.id,
    status: "upcoming",
    departureDate: "2026-08-15",
    returnDate: "2026-08-29",
    routeSummary: "Rome/Civitavecchia to Barcelona",
    embarkationPortId: "port-civitavecchia",
    disembarkationPortId: "port-barcelona",
    planningSummary: "Real local planning shell for the Lawrence family Sun Princess August 2026 sailing.",
    enrichmentStatus: "not_started",
    visual: { featured: true, colourTheme: "ocean-luxe" },
    audit,
    confidence: needsReviewConfidence,
    dataCaveat: "Real sailing shell stored locally. Do not treat port times, tendering or all-aboard details as confirmed.",
  });

  const rows = buildSunPrincess2026ItineraryRows(sailing.id);
  await database.transaction("rw", database.tables, async () => {
    const existingLine = await database.cruiseLines.get(cruiseLine.id);
    await database.cruiseLines.put({ ...cruiseLine, ...existingLine });
    await database.countries.bulkPut(countries);
    const existingShip = await database.ships.get(ship.id);
    const { sampleOnly: _shipSampleOnly, ...shipToStore } = { ...ship, ...existingShip, dataCaveat: existingShip?.dataCaveat ?? ship.dataCaveat };
    await database.ships.put(shipToStore);
    for (const port of ports) {
      const existingPort = await database.ports.get(port.id);
      const { sampleOnly: _portSampleOnly, ...portToStore } = { ...port, ...existingPort, dataCaveat: existingPort?.dataCaveat ?? port.dataCaveat };
      await database.ports.put(portToStore);
    }

    const existing = await database.sailings.get(sailing.id);
    if (!existing) {
      await database.sailings.put(sailing);
    }

    const existingRows = await database.itineraryDays.where("sailingId").equals(sailing.id).toArray();
    const existingByDate = new Set(existingRows.map((day) => day.date));
    const missingRows = rows.filter((day) => !existingByDate.has(day.date));
    if (missingRows.length) await database.itineraryDays.bulkPut(missingRows);

    const selectedDay = existingRows[0]?.id ?? rows[0].id;
    await database.appSettings.bulkPut([
      AppSettingSchema.parse({ id: "setting-active-sailing", key: ACTIVE_SAILING_SETTING, value: sailing.id, audit }),
      AppSettingSchema.parse({ id: "setting-selected-today-day", key: SELECTED_TODAY_DAY_SETTING, value: selectedDay, audit }),
    ]);
  });
}
