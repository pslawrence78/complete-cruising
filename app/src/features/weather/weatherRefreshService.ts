import { db, type CompleteCruisingDb } from "../../db/completeCruisingDb";
import { getItineraryDayById, getItineraryDaysForSailing } from "../../db/repositories";
import { getLatestWeatherSnapshotForItineraryDay, upsertWeatherSnapshot } from "../../db/repositories/weatherRepository";
import { WeatherSnapshotSchema } from "../../schemas";
import type { ItineraryDayRecord, Port } from "../../types";
import { fetchOpenMeteoWeather, weatherCodeToConditionSummary, type OpenMeteoCurrentResponse, type OpenMeteoDailyResponse } from "./openMeteoClient";
import { buildWeatherCardModelFromSnapshot } from "./weatherStateService";
import { deriveClothingGuidance, deriveComfortSummary, derivePlanImpact } from "./weatherPresentation";
import { getForecastExpectedFrom, getWeatherRefreshMode } from "./weatherReadiness";
import type { WeatherContext, WeatherRefreshMode, WeatherRefreshOutcome, WeatherSnapshotRecord } from "./weatherTypes";

function buildAudit(now = new Date().toISOString(), existing?: WeatherSnapshotRecord) {
  return {
    createdAt: existing?.audit.createdAt ?? now,
    updatedAt: now,
    createdBy: existing?.audit.createdBy ?? "weather-refresh",
    updatedBy: "weather-refresh",
  } as const;
}

function makeSnapshotId(dayId: string, weatherDate: string) {
  return `weather-${dayId}-${weatherDate}-${Date.now()}`;
}

function isTrustedSnapshot(snapshot?: WeatherSnapshotRecord) {
  if (!snapshot) return false;
  return snapshot.confidence.reviewStatus === "reviewed"
    || snapshot.confidence.reviewStatus === "verified"
    || snapshot.confidence.confidence === "confirmed"
    || snapshot.snapshotType === "observed"
    || snapshot.sourceType === "user_entered"
    || snapshot.sourceType === "family_note";
}

function deriveSnapshotType(context: WeatherContext) {
  switch (context) {
    case "same_day_check":
      return "same_day" as const;
    case "observed":
      return "observed" as const;
    case "weather_now_in_port":
      return "manual" as const;
    case "climate_context":
      return "climate" as const;
    case "visit_date_forecast":
    default:
      return "forecast" as const;
  }
}

function deriveLegacyWeatherState(context: WeatherContext) {
  switch (context) {
    case "visit_date_forecast":
    case "same_day_check":
      return "forecast_recent" as const;
    case "weather_now_in_port":
      return "climate_expectation" as const;
    case "observed":
      return "day_locked" as const;
    case "climate_context":
    default:
      return "forecast_pending" as const;
  }
}

function buildConfidence(context: WeatherContext, now: string, forecastExpectedFrom?: string) {
  const refreshReason = context === "weather_now_in_port"
    ? forecastExpectedFrom
      ? `Visit-date forecast is expected from ${forecastExpectedFrom}.`
      : "Visit-date forecast is not yet available."
    : undefined;
  return {
    confidence: context === "same_day_check" || context === "visit_date_forecast"
      ? "high"
      : context === "weather_now_in_port"
        ? "low"
        : context === "observed"
          ? "confirmed"
          : "inferred",
    reviewStatus: "needs_user_review" as const,
    sourceType: "weather_service" as const,
    sourceSummary: "Open-Meteo",
    lastReviewedAt: null,
    refreshRecommended: context === "weather_now_in_port",
    refreshReason,
  };
}

function combineReading(
  daily: OpenMeteoDailyResponse | undefined,
  current: OpenMeteoCurrentResponse | undefined,
) {
  return {
    weatherCode: current?.weatherCode ?? daily?.weatherCode,
    temperatureHighC: daily?.temperatureHighC,
    temperatureLowC: daily?.temperatureLowC,
    temperatureCurrentC: current?.temperatureCurrentC,
    apparentTemperatureC: current?.apparentTemperatureC,
    precipitationChance: daily?.precipitationChance,
    precipitationMm: current?.precipitationMm,
    windSpeedKph: current?.windSpeedKph ?? daily?.windSpeedKph,
    humidity: current?.humidity,
    uvIndex: daily?.uvIndex,
    sunrise: daily?.sunrise,
    sunset: daily?.sunset,
  };
}

function buildSnapshotRecord(input: {
  request: {
    sailingId: string;
    itineraryDayId: string;
    portId?: string;
    latitude: number;
    longitude: number;
  };
  day: Pick<ItineraryDayRecord, "date">;
  weatherDate: string;
  context: WeatherContext;
  daily?: OpenMeteoDailyResponse;
  current?: OpenMeteoCurrentResponse;
  forecastExpectedFrom?: string;
  sourceUrl: string;
  sourceName: string;
  sourceAttribution: string;
  existing?: WeatherSnapshotRecord;
}) {
  const now = new Date().toISOString();
  const reading = combineReading(input.daily, input.current);
  const confidence = buildConfidence(input.context, now, input.forecastExpectedFrom);
  const isVisitDateForecast = input.context === "visit_date_forecast" || input.context === "same_day_check";
  const satisfiesVisitForecastReadiness = isVisitDateForecast && input.weatherDate === input.day.date;

  return WeatherSnapshotSchema.parse({
    id: input.existing?.id ?? makeSnapshotId(input.request.itineraryDayId, input.weatherDate),
    sailingId: input.request.sailingId,
    itineraryDayId: input.request.itineraryDayId,
    portId: input.request.portId,
    date: input.weatherDate,
    latitude: input.request.latitude,
    longitude: input.request.longitude,
    sourceName: input.sourceName,
    sourceUrl: input.sourceUrl,
    sourceAttribution: input.sourceAttribution,
    sourceType: "weather_service",
    snapshotType: deriveSnapshotType(input.context),
    weatherState: deriveLegacyWeatherState(input.context),
    weatherContext: input.context,
    capturedAt: now,
    generatedAt: now,
    validFrom: input.weatherDate,
    validUntil: input.weatherDate,
    lastRefreshAttemptAt: now,
    visitDate: input.day.date,
    forecastDate: input.weatherDate,
    forecastExpectedFrom: input.forecastExpectedFrom,
    isVisitDateForecast,
    satisfiesVisitForecastReadiness,
    refreshState: "updated",
    refreshRecommended: confidence.refreshRecommended,
    refreshReason: confidence.refreshReason,
    refreshError: undefined,
    conditionSummary: weatherCodeToConditionSummary(reading.weatherCode),
    temperatureHighC: reading.temperatureHighC,
    temperatureLowC: reading.temperatureLowC,
    temperatureCurrentC: reading.temperatureCurrentC,
    apparentTemperatureC: reading.apparentTemperatureC,
    precipitationChance: reading.precipitationChance,
    precipitationMm: reading.precipitationMm,
    windSpeedKph: reading.windSpeedKph,
    humidity: reading.humidity,
    uvIndex: reading.uvIndex,
    sunrise: reading.sunrise,
    sunset: reading.sunset,
    comfortSummary: deriveComfortSummary(reading),
    clothingGuidance: deriveClothingGuidance(reading),
    planImpact: derivePlanImpact({
      temperatureHighC: reading.temperatureHighC,
      temperatureCurrentC: reading.temperatureCurrentC,
      precipitationChance: reading.precipitationChance,
      windSpeedKph: reading.windSpeedKph,
      weatherContext: input.context,
    }),
    confidence,
    audit: buildAudit(now, input.existing),
  });
}

function buildSingleOutcome(outcome: Omit<WeatherRefreshOutcome, "refreshed" | "skipped" | "blocked" | "snapshots" | "errors"> & {
  snapshot?: WeatherSnapshotRecord;
  error?: string;
}) {
  return {
    ...outcome,
    refreshed: outcome.status === "saved" ? 1 : 0,
    skipped: outcome.status === "saved" ? 0 : 1,
    blocked: outcome.status === "blocked" ? 1 : 0,
    snapshots: outcome.snapshot ? [outcome.snapshot] : [],
    errors: outcome.error ? [outcome.error] : [],
  };
}

export async function refreshWeatherForItineraryDay(
  sailingId: string,
  itineraryDayId: string,
  database: CompleteCruisingDb = db,
  options: {
    currentDate?: string;
    fetchImpl?: typeof fetch;
    offline?: boolean;
  } = {},
): Promise<WeatherRefreshOutcome> {
  const day = await getItineraryDayById(itineraryDayId, database);
  if (!day || day.sailingId !== sailingId) {
    return buildSingleOutcome({
      status: "failed",
      buttonState: "failed",
      message: "Weather refresh could not complete. Your existing local weather context has been preserved.",
      error: "Itinerary day not found.",
    });
  }

  if (day.dayType === "sea" || day.dayType === "scenic_cruising") {
    return buildSingleOutcome({
      status: "unavailable",
      buttonState: "unavailable",
      message: "Sea days do not use forced port weather refresh.",
    });
  }

  const port = day.portId ? await database.ports.get(day.portId) : undefined;
  const latitude = port?.geo?.latitude;
  const longitude = port?.geo?.longitude;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return buildSingleOutcome({
      status: "skipped",
      buttonState: "missing_coordinates",
      message: "Weather refresh needs port coordinates before it can continue.",
    });
  }

  if (options.offline) {
    return buildSingleOutcome({
      status: "offline",
      buttonState: "offline",
      message: "Weather refresh needs a connection. Your existing local weather context has been preserved.",
    });
  }

  const latestSnapshot = await getLatestWeatherSnapshotForItineraryDay(day.id, database);
  if (isTrustedSnapshot(latestSnapshot)) {
    return buildSingleOutcome({
      status: "blocked",
      buttonState: "blocked",
      message: "Trusted snapshot preserved. Complete Cruising did not overwrite reviewed or observed weather.",
      snapshot: latestSnapshot,
    });
  }

  const currentDate = options.currentDate ?? new Date().toISOString().slice(0, 10);
  const refreshMode = getWeatherRefreshMode(day.date, currentDate);
  if (refreshMode === "past_day") {
    return buildSingleOutcome({
      status: "unavailable",
      buttonState: "unavailable",
      message: "Live refresh is not used for past days. Keep observed weather separately if you add it later.",
    });
  }

  const fetched = await fetchOpenMeteoWeather({
    latitude: latitude as number,
    longitude: longitude as number,
    date: refreshMode === "weather_now_in_port" ? currentDate : day.date,
    mode: refreshMode,
  }, options.fetchImpl);

  if (!fetched.ok) {
    return buildSingleOutcome({
      status: "failed",
      buttonState: "failed",
      message: "Weather refresh could not complete. Your existing local weather context has been preserved.",
      error: fetched.errorMessage,
    });
  }

  const daily = fetched.readings[0];
  const context: WeatherContext =
    refreshMode === "same_day_check"
      ? "same_day_check"
      : refreshMode === "visit_date_forecast"
        ? "visit_date_forecast"
        : "weather_now_in_port";
  const forecastExpectedFrom = context === "weather_now_in_port" ? getForecastExpectedFrom(day.date) : undefined;
  const weatherDate = context === "weather_now_in_port"
    ? fetched.current?.date ?? daily?.date ?? currentDate
    : daily?.date ?? day.date;

  const snapshot = buildSnapshotRecord({
    request: {
      sailingId,
      itineraryDayId: day.id,
      portId: day.portId,
      latitude: latitude as number,
      longitude: longitude as number,
    },
    day,
    weatherDate,
    context,
    daily,
    current: fetched.current,
    forecastExpectedFrom,
    sourceUrl: fetched.sourceUrl,
    sourceName: fetched.sourceName,
    sourceAttribution: fetched.sourceAttribution,
  });

  await upsertWeatherSnapshot(snapshot, database);
  if (!day.weatherSnapshotId) {
    await database.itineraryDays.update(day.id, { weatherSnapshotId: snapshot.id });
  }

  return buildSingleOutcome({
    status: "saved",
    buttonState: "refreshed",
    message: day.weatherSnapshotId
      ? "Weather refreshed and stored locally. Review the competing snapshots before changing the preferred view."
      : "Weather refreshed and stored locally.",
    snapshot,
  });
}

export async function refreshCruiseWeatherForSailing(
  sailingId: string,
  database: CompleteCruisingDb = db,
  options: {
    itineraryDayId?: string;
    currentDate?: string;
    fetchImpl?: typeof fetch;
    offline?: boolean;
    allowHistoricalLookup?: boolean;
  } = {},
): Promise<WeatherRefreshOutcome> {
  if (options.itineraryDayId) {
    return refreshWeatherForItineraryDay(sailingId, options.itineraryDayId, database, options);
  }

  const sailing = await database.sailings.get(sailingId);
  if (!sailing) {
    return {
      status: "failed",
      buttonState: "failed",
      refreshed: 0,
      skipped: 0,
      blocked: 0,
      message: "Weather refresh could not complete. Your existing local weather context has been preserved.",
      snapshots: [],
      errors: ["Sailing not found."],
    };
  }

  const days = await getItineraryDaysForSailing(sailingId, database);
  const snapshots: WeatherSnapshotRecord[] = [];
  const errors: string[] = [];
  let refreshed = 0;
  let skipped = 0;
  let blocked = 0;

  for (const day of days) {
    const result = await refreshWeatherForItineraryDay(sailingId, day.id, database, options);
    refreshed += result.refreshed;
    skipped += result.skipped;
    blocked += result.blocked;
    snapshots.push(...result.snapshots);
    errors.push(...result.errors);
  }

  const status =
    refreshed > 0 ? "saved"
      : blocked > 0 ? "blocked"
        : options.offline ? "offline"
          : errors.length ? "failed"
            : "skipped";
  const message =
    refreshed > 0
      ? blocked > 0
        ? `Weather refreshed for ${refreshed} port day${refreshed === 1 ? "" : "s"}. ${blocked} trusted snapshot${blocked === 1 ? " was" : "s were"} preserved.`
        : `Weather refreshed for ${refreshed} port day${refreshed === 1 ? "" : "s"}.`
      : blocked > 0
        ? "Trusted snapshots were preserved. Complete Cruising did not overwrite reviewed or observed weather."
        : options.offline
          ? "Weather refresh needs a connection. Your existing local weather context has been preserved."
          : errors.length
            ? "Weather refresh could not complete. Your existing local weather context has been preserved."
            : "No weather updates were needed.";

  return {
    status,
    buttonState:
      status === "saved" ? "refreshed"
        : status === "blocked" ? "blocked"
          : status === "offline" ? "offline"
            : status === "failed" ? "failed"
              : "idle",
    refreshed,
    skipped,
    blocked,
    message,
    snapshots,
    errors,
  };
}

export function buildWeatherCardForDay(day: ItineraryDayRecord, port: Port | undefined, snapshot?: WeatherSnapshotRecord) {
  return buildWeatherCardModelFromSnapshot({ day, port, snapshot });
}
