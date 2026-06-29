import { describe, expect, it, vi } from "vitest";
import { buildOpenMeteoUrl, fetchOpenMeteoWeather, weatherCodeToConditionSummary } from "../features/weather/openMeteoClient";

describe("Open-Meteo client", () => {
  it("maps forecast and current fields from a mocked Open-Meteo response", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        current: {
          time: "2026-06-29T09:30",
          weather_code: 3,
          temperature_2m: 28.6,
          apparent_temperature: 31.1,
          precipitation: 0.3,
          wind_speed_10m: 19.2,
          relative_humidity_2m: 62,
        },
        daily: {
          time: ["2026-06-29"],
          weather_code: [2],
          temperature_2m_max: [29.4],
          temperature_2m_min: [22.1],
          precipitation_probability_max: [35],
          wind_speed_10m_max: [21.3],
          uv_index_max: [8.1],
          sunrise: ["2026-06-29T05:40"],
          sunset: ["2026-06-29T20:29"],
        },
      }),
    })) as unknown as typeof fetch;

    const result = await fetchOpenMeteoWeather({
      latitude: 40.841,
      longitude: 14.263,
      date: "2026-06-29",
      mode: "weather_now_in_port",
    }, fetchImpl);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sourceName).toBe("Open-Meteo");
    expect(result.sourceAttribution).toBe("Weather data by Open-Meteo");
    expect(result.current).toMatchObject({
      date: "2026-06-29",
      temperatureCurrentC: 28.6,
      apparentTemperatureC: 31.1,
      humidity: 62,
    });
    expect(result.readings[0]).toMatchObject({
      date: "2026-06-29",
      temperatureHighC: 29.4,
      temperatureLowC: 22.1,
      precipitationChance: 35,
      windSpeedKph: 21.3,
      uvIndex: 8.1,
    });
  });

  it("builds a current-context URL without hidden background semantics", () => {
    const url = buildOpenMeteoUrl({
      latitude: 40.841,
      longitude: 14.263,
      date: "2026-06-29",
      mode: "weather_now_in_port",
    });

    expect(url.searchParams.get("forecast_days")).toBe("1");
    expect(url.searchParams.get("current")).toContain("temperature_2m");
    expect(url.searchParams.get("daily")).toContain("weather_code");
  });

  it("maps weather codes to concise cruise-friendly labels", () => {
    expect(weatherCodeToConditionSummary(0)).toBe("Clear");
    expect(weatherCodeToConditionSummary(2)).toBe("Partly cloudy");
    expect(weatherCodeToConditionSummary(63)).toBe("Rain");
    expect(weatherCodeToConditionSummary(81)).toBe("Showers");
    expect(weatherCodeToConditionSummary(95)).toBe("Thunderstorm");
  });
});
