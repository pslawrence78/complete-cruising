import { sampleAudit, sampleSailingRecord, sampleWeatherRecord } from "../../data/sampleSchemaData";
import { db, type CompleteCruisingDb } from "../../db/completeCruisingDb";
import { setActiveSailingId, setSelectedTodayDayId } from "../../db/repositories";
import { seedSampleData } from "../../db/seedDatabase";
import type { WeatherSnapshot, WeatherSnapshotReviewEvent } from "../../types";

const WEATHER_REVIEW_DEMO_DAYS = {
  conflict: "day-02-naples",
  stable: "day-04-chania",
  sea: "day-05-sea",
  resolved: "day-06-ephesus",
} as const;

const WEATHER_REVIEW_DEMO_SNAPSHOT_IDS = {
  naplesSameDay: "weather-demo-naples-same-day-check",
  chaniaStable: "weather-demo-chania-visit-forecast",
  seaContext: "weather-demo-sea-day-context",
  ephesusForecast: "weather-demo-ephesus-visit-forecast",
  ephesusSameDay: "weather-demo-ephesus-same-day-check",
} as const;

const WEATHER_REVIEW_DEMO_EVENT_IDS = {
  naplesAcknowledged: "weather-review-demo-naples-acknowledged",
  ephesusSelected: "weather-review-demo-ephesus-selected",
} as const;

const WEATHER_REVIEW_DEMO_SNAPSHOT_ID_LIST = Object.values(WEATHER_REVIEW_DEMO_SNAPSHOT_IDS);
const WEATHER_REVIEW_DEMO_EVENT_ID_LIST = Object.values(WEATHER_REVIEW_DEMO_EVENT_IDS);

function buildDemoSnapshot(overrides: Partial<WeatherSnapshot> & Pick<WeatherSnapshot, "id" | "itineraryDayId" | "date">): WeatherSnapshot {
  return {
    ...sampleWeatherRecord,
    ...overrides,
    id: overrides.id,
    sailingId: sampleSailingRecord.id,
    itineraryDayId: overrides.itineraryDayId,
    date: overrides.date,
    forecastDate: overrides.forecastDate,
    visitDate: overrides.visitDate,
    validFrom: overrides.validFrom ?? overrides.date,
    validUntil: overrides.validUntil ?? overrides.date,
    audit: {
      ...sampleAudit,
      updatedAt: overrides.audit?.updatedAt ?? sampleAudit.updatedAt,
      updatedBy: overrides.audit?.updatedBy ?? "weather-review-demo",
    },
    sampleOnly: true,
    dataCaveat: "Illustrative weather review demo data for manual smoke testing only.",
  };
}

const WEATHER_REVIEW_DEMO_SNAPSHOTS: readonly WeatherSnapshot[] = [
  buildDemoSnapshot({
    id: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.naplesSameDay,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.conflict,
    portId: "port-naples",
    date: "2026-08-02",
    forecastDate: "2026-08-02",
    visitDate: "2026-08-02",
    sourceName: "Open-Meteo same-day check",
    snapshotType: "forecast",
    weatherState: "forecast_recent",
    weatherContext: "same_day_check",
    capturedAt: "2026-08-02T07:10:00.000Z",
    generatedAt: "2026-08-02T07:00:00.000Z",
    lastRefreshAttemptAt: "2026-08-02T07:10:00.000Z",
    refreshState: "updated",
    refreshRecommended: false,
    conditionSummary: "Hotter with a late thunderstorm risk",
    temperatureHighC: 33,
    temperatureLowC: 24,
    precipitationChance: 35,
    precipitationMm: 1.6,
    windSpeedKph: 21,
    windGustKph: 31,
    comfortSummary: "Warmer pavements and a later storm chance make shade and return discipline more important.",
    clothingGuidance: "Prioritise hats, water and a light layer for a possible late shower.",
    planImpact: "A shorter city loop or an earlier ship return may feel wiser if clouds build.",
    confidence: {
      ...sampleWeatherRecord.confidence,
      confidence: "high",
      reviewStatus: "needs_user_review",
      sourceSummary: "Illustrative same-day Open-Meteo check for demo review.",
      lastReviewedAt: "2026-08-02T07:10:00.000Z",
    },
    audit: {
      ...sampleAudit,
      createdAt: "2026-08-02T07:10:00.000Z",
      updatedAt: "2026-08-02T07:10:00.000Z",
      createdBy: "weather-review-demo",
      updatedBy: "weather-review-demo",
    },
  }),
  buildDemoSnapshot({
    id: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.chaniaStable,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.stable,
    portId: "port-chania",
    latitude: 35.5138,
    longitude: 24.018,
    date: "2026-08-04",
    forecastDate: "2026-08-04",
    visitDate: "2026-08-04",
    sourceName: "Open-Meteo visit-date forecast",
    snapshotType: "forecast",
    weatherState: "forecast_recent",
    weatherContext: "visit_date_forecast",
    capturedAt: "2026-08-01T09:15:00.000Z",
    generatedAt: "2026-08-01T09:00:00.000Z",
    lastRefreshAttemptAt: "2026-08-01T09:15:00.000Z",
    refreshState: "updated",
    refreshRecommended: false,
    conditionSummary: "Warm harbour sunshine",
    temperatureHighC: 30,
    temperatureLowC: 23,
    precipitationChance: 8,
    precipitationMm: 0,
    windSpeedKph: 16,
    windGustKph: 24,
    comfortSummary: "A settled warm forecast suits a straightforward old-town wander.",
    clothingGuidance: "Light clothing, hats and water should be enough.",
    planImpact: "No weather conflict is competing with this stored forecast.",
    confidence: {
      ...sampleWeatherRecord.confidence,
      confidence: "high",
      reviewStatus: "reviewed",
      refreshRecommended: false,
      sourceSummary: "Illustrative visit-date forecast for manual review smoke testing.",
      lastReviewedAt: "2026-08-01T09:15:00.000Z",
    },
    audit: {
      ...sampleAudit,
      createdAt: "2026-08-01T09:15:00.000Z",
      updatedAt: "2026-08-01T09:15:00.000Z",
      createdBy: "weather-review-demo",
      updatedBy: "weather-review-demo",
    },
  }),
  buildDemoSnapshot({
    id: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.seaContext,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.sea,
    date: "2026-08-05",
    forecastDate: "2026-08-05",
    visitDate: "2026-08-05",
    latitude: 36.1,
    longitude: 25.4,
    sourceName: "Illustrative sea-day comfort note",
    sourceType: "inferred",
    snapshotType: "forecast",
    weatherState: "forecast_recent",
    weatherContext: "weather_now_in_port",
    capturedAt: "2026-08-04T18:20:00.000Z",
    generatedAt: "2026-08-04T18:00:00.000Z",
    lastRefreshAttemptAt: "2026-08-04T18:20:00.000Z",
    refreshState: "updated",
    refreshRecommended: false,
    conditionSummary: "Warm deck weather with a steadier breeze",
    temperatureHighC: 28,
    temperatureLowC: 22,
    precipitationChance: 12,
    precipitationMm: 0.2,
    windSpeedKph: 26,
    windGustKph: 34,
    comfortSummary: "Use this only as broad sea-day guidance, not as port weather.",
    clothingGuidance: "Layers for breezier decks and plenty of water remain sensible.",
    planImpact: "Deck comfort may change through the day, but no port-weather choice is required.",
    confidence: {
      ...sampleWeatherRecord.confidence,
      confidence: "medium",
      reviewStatus: "needs_user_review",
      sourceType: "inferred",
      sourceSummary: "Illustrative sea-day demo snapshot to verify neutral copy.",
      lastReviewedAt: "2026-08-04T18:20:00.000Z",
    },
    audit: {
      ...sampleAudit,
      createdAt: "2026-08-04T18:20:00.000Z",
      updatedAt: "2026-08-04T18:20:00.000Z",
      createdBy: "weather-review-demo",
      updatedBy: "weather-review-demo",
    },
  }),
  buildDemoSnapshot({
    id: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusForecast,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.resolved,
    portId: "port-kusadasi",
    latitude: 37.8608,
    longitude: 27.2576,
    date: "2026-08-06",
    forecastDate: "2026-08-06",
    visitDate: "2026-08-06",
    sourceName: "Open-Meteo visit-date forecast",
    snapshotType: "forecast",
    weatherState: "forecast_recent",
    weatherContext: "visit_date_forecast",
    capturedAt: "2026-08-03T08:30:00.000Z",
    generatedAt: "2026-08-03T08:00:00.000Z",
    lastRefreshAttemptAt: "2026-08-03T08:30:00.000Z",
    refreshState: "updated",
    refreshRecommended: false,
    conditionSummary: "Dry heat with a bright afternoon",
    temperatureHighC: 34,
    temperatureLowC: 23,
    precipitationChance: 4,
    precipitationMm: 0,
    windSpeedKph: 14,
    windGustKph: 22,
    comfortSummary: "A classic hot archaeology day with strong sun exposure.",
    clothingGuidance: "Sun hats, refillable water and careful pacing matter.",
    planImpact: "This remains a useful baseline forecast for the visit date.",
    confidence: {
      ...sampleWeatherRecord.confidence,
      confidence: "high",
      reviewStatus: "reviewed",
      refreshRecommended: false,
      sourceSummary: "Illustrative visit-date forecast preserved in demo history.",
      lastReviewedAt: "2026-08-03T08:30:00.000Z",
    },
    audit: {
      ...sampleAudit,
      createdAt: "2026-08-03T08:30:00.000Z",
      updatedAt: "2026-08-03T08:30:00.000Z",
      createdBy: "weather-review-demo",
      updatedBy: "weather-review-demo",
    },
  }),
  buildDemoSnapshot({
    id: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusSameDay,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.resolved,
    portId: "port-kusadasi",
    latitude: 37.8608,
    longitude: 27.2576,
    date: "2026-08-06",
    forecastDate: "2026-08-06",
    visitDate: "2026-08-06",
    sourceName: "Open-Meteo same-day check",
    snapshotType: "forecast",
    weatherState: "forecast_recent",
    weatherContext: "same_day_check",
    capturedAt: "2026-08-06T06:45:00.000Z",
    generatedAt: "2026-08-06T06:30:00.000Z",
    lastRefreshAttemptAt: "2026-08-06T06:45:00.000Z",
    refreshState: "updated",
    refreshRecommended: false,
    conditionSummary: "Slightly cooler with a stronger breeze",
    temperatureHighC: 31,
    temperatureLowC: 22,
    precipitationChance: 10,
    precipitationMm: 0,
    windSpeedKph: 22,
    windGustKph: 30,
    comfortSummary: "The same-day check softens the heat a little but adds more breeze.",
    clothingGuidance: "Light layers and sun protection remain the safest choice.",
    planImpact: "This preferred same-day check now drives day guidance across the app.",
    confidence: {
      ...sampleWeatherRecord.confidence,
      confidence: "high",
      reviewStatus: "verified",
      refreshRecommended: false,
      sourceSummary: "Illustrative same-day check chosen as the preferred snapshot.",
      lastReviewedAt: "2026-08-06T06:45:00.000Z",
    },
    audit: {
      ...sampleAudit,
      createdAt: "2026-08-06T06:45:00.000Z",
      updatedAt: "2026-08-06T06:45:00.000Z",
      createdBy: "weather-review-demo",
      updatedBy: "weather-review-demo",
    },
  }),
];

const WEATHER_REVIEW_DEMO_EVENTS: readonly WeatherSnapshotReviewEvent[] = [
  {
    id: WEATHER_REVIEW_DEMO_EVENT_IDS.naplesAcknowledged,
    sailingId: sampleSailingRecord.id,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.conflict,
    forecastDate: "2026-08-02",
    action: "conflict_acknowledged",
    fromSnapshotId: sampleWeatherRecord.id,
    toSnapshotId: sampleWeatherRecord.id,
    candidateSnapshotIds: [sampleWeatherRecord.id, WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.naplesSameDay],
    reason: "Illustrative demo acknowledgement while the family decides which Naples snapshot should lead.",
    notes: "Other snapshots remain preserved for history.",
    createdAt: "2026-08-01T20:10:00.000Z",
    createdBy: "system",
  },
  {
    id: WEATHER_REVIEW_DEMO_EVENT_IDS.ephesusSelected,
    sailingId: sampleSailingRecord.id,
    itineraryDayId: WEATHER_REVIEW_DEMO_DAYS.resolved,
    forecastDate: "2026-08-06",
    action: "preferred_snapshot_selected",
    fromSnapshotId: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusForecast,
    toSnapshotId: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusSameDay,
    candidateSnapshotIds: [WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusForecast, WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusSameDay],
    reason: "Illustrative demo selection of the later same-day check for onboard guidance.",
    notes: "The visit-date forecast is still preserved for comparison.",
    createdAt: "2026-08-06T06:55:00.000Z",
    createdBy: "system",
  },
];

async function applyDemoPointers(database: CompleteCruisingDb) {
  await Promise.all([
    database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.conflict, { weatherSnapshotId: sampleWeatherRecord.id }),
    database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.stable, { weatherSnapshotId: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.chaniaStable }),
    database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.sea, { weatherSnapshotId: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.seaContext }),
    database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.resolved, { weatherSnapshotId: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS.ephesusSameDay }),
  ]);
}

export async function loadWeatherReviewDemo(database: CompleteCruisingDb = db) {
  await seedSampleData(database);
  await database.transaction("rw", database.tables, async () => {
    await database.weatherSnapshots.bulkPut(WEATHER_REVIEW_DEMO_SNAPSHOTS);
    await database.weatherSnapshotReviewEvents.bulkPut(WEATHER_REVIEW_DEMO_EVENTS);
    await applyDemoPointers(database);
    await setActiveSailingId(sampleSailingRecord.id, database);
    await setSelectedTodayDayId(WEATHER_REVIEW_DEMO_DAYS.conflict, database);
  });
}

export async function restoreWeatherReviewCalmState(database: CompleteCruisingDb = db) {
  await seedSampleData(database);
  await database.transaction("rw", database.tables, async () => {
    await database.weatherSnapshots.bulkDelete(WEATHER_REVIEW_DEMO_SNAPSHOT_ID_LIST);
    await database.weatherSnapshotReviewEvents.bulkDelete(WEATHER_REVIEW_DEMO_EVENT_ID_LIST);
    await Promise.all([
      database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.conflict, { weatherSnapshotId: sampleWeatherRecord.id }),
      database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.stable, { weatherSnapshotId: undefined }),
      database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.sea, { weatherSnapshotId: undefined }),
      database.itineraryDays.update(WEATHER_REVIEW_DEMO_DAYS.resolved, { weatherSnapshotId: undefined }),
    ]);
    await setActiveSailingId(sampleSailingRecord.id, database);
    await setSelectedTodayDayId(WEATHER_REVIEW_DEMO_DAYS.conflict, database);
  });
}

export const WEATHER_REVIEW_DEMO_IDS = {
  dayIds: WEATHER_REVIEW_DEMO_DAYS,
  snapshotIds: WEATHER_REVIEW_DEMO_SNAPSHOT_IDS,
  eventIds: WEATHER_REVIEW_DEMO_EVENT_IDS,
} as const;
