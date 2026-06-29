import type { WeatherDailyReading } from "./weatherTypes";

export type OpenMeteoMode = "forecast" | "archive";

export interface OpenMeteoRequest {
  latitude: number;
  longitude: number;
  date: string;
  mode?: OpenMeteoMode;
}

export interface OpenMeteoDailyResponse {
  date: string;
  weatherCode?: number;
  temperatureHighC?: number;
  temperatureLowC?: number;
  precipitationChance?: number;
  precipitationMm?: number;
  windSpeedKph?: number;
  windGustKph?: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
}

export type OpenMeteoFetchResult = {
  ok: true;
  readings: readonly OpenMeteoDailyResponse[];
  sourceName: string;
  sourceUrl: string;
} | {
  ok: false;
  errorMessage: string;
};

const OPEN_METEO_DAILY_FIELDS = [
  "weathercode",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "precipitation_sum",
  "windspeed_10m_max",
  "windgusts_10m_max",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

export function buildOpenMeteoUrl({ latitude, longitude, date, mode = "forecast" }: OpenMeteoRequest) {
  const endpoint = mode === "archive" ? "archive" : "forecast";
  const url = new URL(`https://api.open-meteo.com/v1/${endpoint}`);
  url.searchParams.set("latitude", latitude.toFixed(4));
  url.searchParams.set("longitude", longitude.toFixed(4));
  url.searchParams.set("daily", OPEN_METEO_DAILY_FIELDS);
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("temperature_unit", "celsius");
  url.searchParams.set("wind_speed_unit", "kmh");
  url.searchParams.set("precipitation_unit", "mm");
  return url;
}

function toNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function toText(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

export function weatherCodeToConditionSummary(code?: number): string {
  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Fog or haze";
    case 51:
    case 53:
    case 55:
      return "Light drizzle";
    case 56:
    case 57:
      return "Freezing drizzle";
    case 61:
    case 63:
    case 65:
      return "Rain possible";
    case 66:
    case 67:
      return "Freezing rain";
    case 71:
    case 73:
    case 75:
    case 77:
      return "Snow possible";
    case 80:
    case 81:
    case 82:
      return "Rain showers";
    case 85:
    case 86:
      return "Snow showers";
    case 95:
      return "Thunderstorms";
    case 96:
    case 99:
      return "Thunderstorms with hail";
    default:
      return "Mixed conditions";
  }
}

function normaliseDailyResponse(payload: Record<string, unknown>): OpenMeteoDailyResponse[] {
  const daily = payload.daily as Record<string, unknown> | undefined;
  if (!daily) return [];
  const dates = Array.isArray(daily.time) ? daily.time.map((value) => typeof value === "string" ? value : "") : [];
  return dates.flatMap((date, index) => {
    if (!date) return [];
    return [{
      date,
      weatherCode: toNumber(Array.isArray(daily.weathercode) ? daily.weathercode[index] : undefined),
      temperatureHighC: toNumber(Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max[index] : undefined),
      temperatureLowC: toNumber(Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min[index] : undefined),
      precipitationChance: toNumber(Array.isArray(daily.precipitation_probability_max) ? daily.precipitation_probability_max[index] : undefined),
      precipitationMm: toNumber(Array.isArray(daily.precipitation_sum) ? daily.precipitation_sum[index] : undefined),
      windSpeedKph: toNumber(Array.isArray(daily.windspeed_10m_max) ? daily.windspeed_10m_max[index] : undefined),
      windGustKph: toNumber(Array.isArray(daily.windgusts_10m_max) ? daily.windgusts_10m_max[index] : undefined),
      uvIndex: toNumber(Array.isArray(daily.uv_index_max) ? daily.uv_index_max[index] : undefined),
      sunrise: toText(Array.isArray(daily.sunrise) ? daily.sunrise[index] : undefined),
      sunset: toText(Array.isArray(daily.sunset) ? daily.sunset[index] : undefined),
    }];
  });
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
      readings: normaliseDailyResponse(payload),
      sourceName: request.mode === "archive" ? "Open-Meteo archive" : "Open-Meteo forecast",
      sourceUrl: "https://open-meteo.com/",
    };
  } catch {
    return { ok: false, errorMessage: "Weather refresh is unavailable right now." };
  }
}

export function readingHasUsefulWeather(reading: WeatherDailyReading) {
  return reading.temperatureHighC !== undefined
    || reading.temperatureLowC !== undefined
    || reading.precipitationChance !== undefined
    || reading.windSpeedKph !== undefined
    || reading.windGustKph !== undefined;
}
