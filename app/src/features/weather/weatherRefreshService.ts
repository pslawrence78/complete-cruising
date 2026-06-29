import { db, type CompleteCruisingDb } from "../../db/completeCruisingDb";
import { getItineraryDaysForSailing } from "../../db/repositories";
import { getLatestWeatherSnapshotForItineraryDay, upsertWeatherSnapshot } from "../../db/repositories/weatherRepository";
import { WeatherSnapshotSchema } from "../../schemas";
import type { ItineraryDayRecord, Port } from "../../types";
import { fetchOpenMeteoWeather, weatherCodeToConditionSummary, type OpenMeteoDailyResponse } from "./openMeteoClient";
import { buildWeatherCardModelFromSnapshot, canRefreshWeatherForDay, deriveWeatherStateForDay } from "./weatherStateService";
import { deriveClothingGuidance, deriveComfortSummary, derivePlanImpact } from "./weatherPresentation";
import type { WeatherRefreshOutcome, WeatherRefreshRequest, WeatherSnapshotRecord, WeatherState } from "./weatherTypes";

function buildAudit(now = new Date().toISOString()) {
  return {
    createdAt: now,
    updatedAt: now,
    createdBy: "weather-refresh",
    updatedBy: "weather-refresh",
  } as const;
}

function makeSnapshotId(dayId: string, date: string) {
  return `weather-${dayId}-${date}-${Date.now()}`;
}

function buildConfidence(state: WeatherState, sourceName: string, now = new Date().toISOString()) {
  const confidenceLevel =
    state === "day_locked" ? "confirmed"
      : state === "forecast_recent" ? "high"
        : state === "forecast_available" ? "medium"
          : state === "forecast_stale" ? "low"
            : state === "climate_expectation" ? "inferred"
              : "unknown";
  return {
    confidence: confidenceLevel,
    reviewStatus: state === "day_locked" ? "reviewed" : "needs_user_review",
    sourceType: "weather_service",
    sourceSummary: sourceName,
    lastReviewedAt: state === "day_locked" ? now : null,
    refreshRecommended: state !== "forecast_recent" && state !== "day_locked",
    refreshReason:
      state === "missing_coordinates" ? "Coordinates are missing."
        : state === "climate_expectation" ? "Forecast window is not yet useful."
          : state === "forecast_pending" ? "Forecast data is not available yet."
            : state === "forecast_stale" ? "Snapshot is getting old."
              : state === "historical_lookup_available" ? "Historical lookup may help capture this day."
                : undefined,
  } as const;
}

function buildSnapshotRecord(
  request: WeatherRefreshRequest,
  reading: OpenMeteoDailyResponse,
  sourceName: string,
  sourceUrl: string,
  state: WeatherState,
) {
  const now = new Date().toISOString();
  const confidence = buildConfidence(state, sourceName, now);
  return WeatherSnapshotSchema.parse({
    id: makeSnapshotId(request.itineraryDayId, request.date),
    sailingId: request.sailingId,
    itineraryDayId: request.itineraryDayId,
    portId: request.portId,
    date: request.date,
    latitude: request.latitude,
    longitude: request.longitude,
    sourceName,
    sourceUrl,
    sourceType: "weather_service",
    snapshotType: request.allowHistoricalLookup ? "observed" : "forecast",
    weatherState: state,
    capturedAt: now,
    validFrom: request.date,
    validUntil: request.date,
    lastRefreshAttemptAt: now,
    refreshState: "updated",
    refreshRecommended: confidence.refreshRecommended,
    refreshReason: confidence.refreshReason,
    refreshError: undefined,
    conditionSummary: weatherCodeToConditionSummary(reading.weatherCode),
    temperatureHighC: reading.temperatureHighC,
    temperatureLowC: reading.temperatureLowC,
    precipitationChance: reading.precipitationChance,
    precipitationMm: reading.precipitationMm,
    windSpeedKph: reading.windSpeedKph,
    windGustKph: reading.windGustKph,
    uvIndex: reading.uvIndex,
    sunrise: reading.sunrise,
    sunset: reading.sunset,
    comfortSummary: deriveComfortSummary(reading),
    clothingGuidance: deriveClothingGuidance(reading),
    planImpact: derivePlanImpact({ weatherState: state, ...reading }),
    confidence,
    audit: buildAudit(now),
  });
}

export async function refreshCruiseWeatherForSailing(
  sailingId: string,
  database: CompleteCruisingDb = db,
  options: { allowHistoricalLookup?: boolean; itineraryDayId?: string } = {},
): Promise<WeatherRefreshOutcome> {
  const sailing = await database.sailings.get(sailingId);
  if (!sailing) {
    return {
      status: "failed",
      refreshed: 0,
      skipped: 0,
      message: "Active sailing is not available.",
      snapshots: [],
      errors: ["Sailing not found."],
    };
  }

  const days = await getItineraryDaysForSailing(sailingId, database);
  const selectedDays = options.itineraryDayId ? days.filter((day) => day.id === options.itineraryDayId) : days;
  const snapshots: WeatherSnapshotRecord[] = [];
  const errors: string[] = [];
  let refreshed = 0;
  let skipped = 0;
  const todayIso = new Date().toISOString().slice(0, 10);

  for (const day of selectedDays) {
    if (day.dayType === "sea") {
      skipped += 1;
      continue;
    }

    const port = day.portId ? await database.ports.get(day.portId) : undefined;
    const latitude = port?.geo?.latitude;
    const longitude = port?.geo?.longitude;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      skipped += 1;
      continue;
    }
    const safeLatitude = latitude as number;
    const safeLongitude = longitude as number;

    const latestSnapshot = await getLatestWeatherSnapshotForItineraryDay(day.id, database);
    const state = deriveWeatherStateForDay({
      day: day as ItineraryDayRecord,
      port: port as Port | undefined,
      snapshot: latestSnapshot,
      todayIso,
    });
    if (!canRefreshWeatherForDay({
      day,
      port,
      snapshot: latestSnapshot,
      todayIso,
      allowHistoricalLookup: options.allowHistoricalLookup,
    })) {
      skipped += 1;
      continue;
    }

    const shouldUseArchive = Boolean(options.allowHistoricalLookup && day.date < todayIso);
    if (state === "climate_expectation" && !shouldUseArchive) {
      skipped += 1;
      continue;
    }
    if (state === "historical_lookup_available" && !shouldUseArchive) {
      skipped += 1;
      continue;
    }

    const fetched = await fetchOpenMeteoWeather({
      latitude: safeLatitude,
      longitude: safeLongitude,
      date: day.date,
      mode: shouldUseArchive ? "archive" : "forecast",
    });
    if (!fetched.ok) {
      errors.push(`${day.title ?? day.id}: ${fetched.errorMessage}`);
      skipped += 1;
      continue;
    }

    const reading = fetched.readings[0];
    if (!reading) {
      skipped += 1;
      continue;
    }

    const snapshot = buildSnapshotRecord(
      {
        sailingId,
        itineraryDayId: day.id,
        date: day.date,
        latitude: safeLatitude,
        longitude: safeLongitude,
        portId: day.portId,
        allowHistoricalLookup: shouldUseArchive,
      },
      reading,
      fetched.sourceName,
      fetched.sourceUrl,
      shouldUseArchive ? "day_locked" : "forecast_recent",
    );

    await upsertWeatherSnapshot(snapshot, database);
    await database.itineraryDays.update(day.id, { weatherSnapshotId: snapshot.id });
    snapshots.push(snapshot);
    refreshed += 1;
  }

  const status = refreshed > 0 ? "saved" : errors.length ? "failed" : "skipped";
  const message = refreshed > 0
    ? `${refreshed} weather snapshot${refreshed === 1 ? "" : "s"} saved locally.`
    : errors.length
      ? "Weather refresh could not complete."
      : "No weather updates were needed.";

  return {
    status,
    refreshed,
    skipped,
    message,
    snapshots,
    errors,
  };
}

export function buildWeatherCardForDay(day: ItineraryDayRecord, port: Port | undefined, snapshot?: WeatherSnapshotRecord) {
  return buildWeatherCardModelFromSnapshot({ day, port, snapshot });
}
