import type { WeatherDailyReading, WeatherRefreshMode } from "./weatherTypes";

export interface OpenMeteoRequest {
  latitude: number;
  longitude: number;
  date: string;
  mode: Exclude<WeatherRefreshMode, "past_day">;
}

export interface OpenMeteoCurrentResponse {
  date: string;
  weatherCode?: number;
  temperatureCurrentC?: number;
  apparentTemperatureC?: number;
  precipitationMm?: number;
  windSpeedKph?: number;
  humidity?: number;
}

export interface OpenMeteoDailyResponse {
  date: string;
  weatherCode?: number;
  temperatureHighC?: number;
  temperatureLowC?: number;
  precipitationChance?: number;
  precipitationMm?: number;
  windSpeedKph?: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
}

export type OpenMeteoFetchResult = {
  ok: true;
  current?: OpenMeteoCurrentResponse;
  readings: readonly OpenMeteoDailyResponse[];
  sourceName: string;
  sourceUrl: string;
  sourceAttribution: string;
} | {
  ok: false;
  errorMessage: string;
};

const OPEN_METEO_DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "sunrise",
  "sunset",
  "uv_index_max",
].join(",");

const OPEN_METEO_CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "weather_code",
  "precipitation",
  "wind_speed_10m",
  "relative_humidity_2m",
].join(",");

const OPEN_METEO_SOURCE_URL = "https://open-meteo.com/en/docs";
const OPEN_METEO_ATTRIBUTION = "Weather data by Open-Meteo";

function toNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function toText(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function normaliseIsoDateTime(value?: string) {
  if (!value) return undefined;
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return `${value}:00Z`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) return `${value}Z`;
  return value;
}

function normaliseDateTimeToDate(value?: string) {
  return value?.slice(0, 10);
}

export function buildOpenMeteoUrl({ latitude, longitude, date, mode }: OpenMeteoRequest) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude.toFixed(4));
  url.searchParams.set("longitude", longitude.toFixed(4));
  url.searchParams.set("current", OPEN_METEO_CURRENT_FIELDS);
  url.searchParams.set("daily", OPEN_METEO_DAILY_FIELDS);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("temperature_unit", "celsius");
  url.searchParams.set("wind_speed_unit", "kmh");
  url.searchParams.set("precipitation_unit", "mm");

  if (mode === "weather_now_in_port") {
    url.searchParams.set("forecast_days", "1");
  } else {
    url.searchParams.set("start_date", date);
    url.searchParams.set("end_date", date);
  }

  return url;
}

export function weatherCodeToConditionSummary(code?: number): string {
  switch (code) {
    case 0:
      return "Clear";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Fog";
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return "Drizzle";
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return "Rain";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "Snow";
    case 80:
    case 81:
    case 82:
      return "Showers";
    case 95:
    case 96:
    case 99:
      return "Thunderstorm";
    default:
      return "Mixed conditions";
  }
}

function normaliseDailyResponse(payload: Record<string, unknown>): OpenMeteoDailyResponse[] {
  const daily = payload.daily as Record<string, unknown> | undefined;
  if (!daily) return [];
  const dates = Array.isArray(daily.time) ? daily.time.map((value) => typeof value === "string" ? value : "") : [];
  return dates.flatMap((value, index) => {
    if (!value) return [];
    return [{
      date: value,
      weatherCode: toNumber(Array.isArray(daily.weather_code) ? daily.weather_code[index] : undefined),
      temperatureHighC: toNumber(Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max[index] : undefined),
      temperatureLowC: toNumber(Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min[index] : undefined),
      precipitationChance: toNumber(Array.isArray(daily.precipitation_probability_max) ? daily.precipitation_probability_max[index] : undefined),
      windSpeedKph: toNumber(Array.isArray(daily.wind_speed_10m_max) ? daily.wind_speed_10m_max[index] : undefined),
      uvIndex: toNumber(Array.isArray(daily.uv_index_max) ? daily.uv_index_max[index] : undefined),
      sunrise: normaliseIsoDateTime(toText(Array.isArray(daily.sunrise) ? daily.sunrise[index] : undefined)),
      sunset: normaliseIsoDateTime(toText(Array.isArray(daily.sunset) ? daily.sunset[index] : undefined)),
    }];
  });
}

function normaliseCurrentResponse(payload: Record<string, unknown>): OpenMeteoCurrentResponse | undefined {
  const current = payload.current as Record<string, unknown> | undefined;
  if (!current) return undefined;
  const date = normaliseDateTimeToDate(normaliseIsoDateTime(toText(current.time)));
  if (!date) return undefined;
  return {
    date,
    weatherCode: toNumber(current.weather_code),
    temperatureCurrentC: toNumber(current.temperature_2m),
    apparentTemperatureC: toNumber(current.apparent_temperature),
    precipitationMm: toNumber(current.precipitation),
    windSpeedKph: toNumber(current.wind_speed_10m),
    humidity: toNumber(current.relative_humidity_2m),
  };
}

export async function fetchOpenMeteoWeather(
  request: OpenMeteoRequest,
  fetchImpl: typeof fetch = globalThis.fetch,
): Promise<OpenMeteoFetchResult> {
  try {
    const url = buildOpenMeteoUrl(request);
    const response = await fetchImpl(url);
    if (!response.ok) {
      return { ok: false, errorMessage: `Open-Meteo responded with ${response.status}.` };
    }

    const payload = await response.json() as Record<string, unknown>;
    return {
      ok: true,
      current: normaliseCurrentResponse(payload),
      readings: normaliseDailyResponse(payload),
      sourceName: "Open-Meteo",
      sourceUrl: OPEN_METEO_SOURCE_URL,
      sourceAttribution: OPEN_METEO_ATTRIBUTION,
    };
  } catch {
    return { ok: false, errorMessage: "Weather refresh is unavailable right now." };
  }
}

export function readingHasUsefulWeather(reading: WeatherDailyReading) {
  return reading.temperatureHighC !== undefined
    || reading.temperatureLowC !== undefined
    || reading.temperatureCurrentC !== undefined
    || reading.precipitationChance !== undefined
    || reading.windSpeedKph !== undefined;
}
