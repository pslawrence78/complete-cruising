import type { WeatherCardModel, WeatherState } from "./weatherTypes";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatTemperature(value?: number) {
  return value === undefined ? "Pending" : `${Math.round(value)} C`;
}

export function formatChance(value?: number) {
  return value === undefined ? "Pending" : `${Math.round(value)}%`;
}

export function formatWind(value?: number) {
  return value === undefined ? "Pending" : `${Math.round(value)} km/h`;
}

export function summariseWeatherCondition(model: Pick<WeatherCardModel, "stateLabel" | "summary" | "refreshReason">) {
  return model.summary || model.refreshReason || model.stateLabel;
}

export function deriveComfortSummary(model: {
  temperatureHighC?: number;
  temperatureLowC?: number;
  precipitationChance?: number;
  windSpeedKph?: number;
  uvIndex?: number;
}) {
  const pieces: string[] = [];
  if (model.temperatureHighC !== undefined) {
    pieces.push(model.temperatureHighC >= 27 ? "Warm port day" : model.temperatureHighC <= 17 ? "Cooler port day" : "Comfortable port day");
  }
  if (model.precipitationChance !== undefined && model.precipitationChance >= 40) pieces.push("rain possible");
  if (model.windSpeedKph !== undefined && model.windSpeedKph >= 28) pieces.push("breezy");
  if (model.uvIndex !== undefined && model.uvIndex >= 6) pieces.push("shade matters");
  if (!pieces.length) return "Comfort looks manageable.";
  return `${pieces.join(", ")}.`;
}

export function deriveClothingGuidance(model: {
  temperatureHighC?: number;
  precipitationChance?: number;
  windSpeedKph?: number;
  uvIndex?: number;
}) {
  const notes: string[] = [];
  if (model.temperatureHighC !== undefined && model.temperatureHighC >= 27) notes.push("hats and water");
  if (model.precipitationChance !== undefined && model.precipitationChance >= 40) notes.push("a light rain layer");
  if (model.windSpeedKph !== undefined && model.windSpeedKph >= 28) notes.push("something wind-resistant");
  if (model.uvIndex !== undefined && model.uvIndex >= 6) notes.push("shade breaks");
  if (!notes.length) return "Light layers should be enough.";
  if (notes.length === 1) return `${notes[0].replace(/^./, (value) => value.toUpperCase())} are worth packing.`;
  return `${notes.slice(0, -1).join(", ")} and ${notes.at(-1)} are worth packing.`;
}

export function derivePlanImpact(model: {
  temperatureHighC?: number;
  precipitationChance?: number;
  windSpeedKph?: number;
  weatherState?: WeatherState;
}) {
  if (model.weatherState === "day_locked") return "Captured for this day. Keep the remembered weather with the sailing memory.";
  if (model.weatherState === "missing_coordinates") return "Refresh is unavailable until usable port coordinates are available.";
  if (model.precipitationChance !== undefined && model.precipitationChance >= 50) return "Rain may make the plan feel softer and slower.";
  if (model.windSpeedKph !== undefined && model.windSpeedKph >= 32) return "Breezier conditions can make exposed viewpoints feel cooler.";
  if (model.temperatureHighC !== undefined && model.temperatureHighC >= 28) return "Shade, water and shorter bursts ashore may matter.";
  return "Keep the plan flexible, then let the day stay cruise-shaped rather than weather-led.";
}

export function formatWeatherUpdatedAt(value?: string) {
  if (!value) return "Not refreshed yet";
  return `Updated ${formatter.format(new Date(value))}`;
}

export function deriveWeatherStateLabel(state: WeatherState) {
  switch (state) {
    case "climate_expectation":
      return "Climate expectation";
    case "forecast_pending":
      return "Forecast pending";
    case "forecast_available":
      return "Forecast available";
    case "forecast_recent":
      return "Forecast recent";
    case "forecast_stale":
      return "Forecast stale";
    case "day_locked":
      return "Day locked";
    case "historical_lookup_available":
      return "Historical lookup available";
    case "missing_coordinates":
      return "Coordinates missing";
    default:
      return "Weather pending";
  }
}

export function deriveWeatherBadgeTone(state: WeatherState) {
  switch (state) {
    case "forecast_recent":
      return "confirmed" as const;
    case "forecast_available":
    case "forecast_pending":
    case "climate_expectation":
      return "review" as const;
    case "forecast_stale":
    case "day_locked":
    case "historical_lookup_available":
    case "missing_coordinates":
      return "refresh" as const;
    default:
      return "review" as const;
  }
}

export function deriveWeatherBadgeLabel(model: {
  state: WeatherState;
  temperatureHighC?: number;
  precipitationChance?: number;
  conditionSummary: string;
}) {
  if (model.state === "climate_expectation") return "Climate only";
  if (model.state === "forecast_pending") return "Forecast pending";
  if (model.state === "missing_coordinates") return "Coords missing";
  const pieces: string[] = [];
  if (model.temperatureHighC !== undefined) pieces.push(`${Math.round(model.temperatureHighC)} C`);
  if (model.precipitationChance !== undefined) pieces.push(`rain ${Math.round(model.precipitationChance)}%`);
  if (!pieces.length) return model.conditionSummary;
  return pieces.join(" | ");
}

export function createWeatherCardModel(input: {
  state: WeatherState;
  conditionSummary: string;
  capturedAt?: string;
  sourceName: string;
  temperatureHighC?: number;
  temperatureLowC?: number;
  precipitationChance?: number;
  precipitationMm?: number;
  windSpeedKph?: number;
  windGustKph?: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
  refreshState: WeatherCardModel["refreshState"];
  refreshReason?: string;
  refreshError?: string;
  refreshRecommended: boolean;
  lockedLabel?: string;
}): WeatherCardModel {
  const confidenceLevel: WeatherCardModel["confidenceLevel"] = input.state === "day_locked"
    ? "confirmed"
    : input.state === "forecast_recent"
      ? "high"
      : input.state === "forecast_available"
        ? "medium"
        : input.state === "forecast_stale"
          ? "low"
          : input.state === "climate_expectation"
            ? "inferred"
            : "unknown";

  return {
    confidenceLabel: `${confidenceLevel.replaceAll("_", " ")} confidence`,
    confidenceLevel,
    state: input.state,
    stateLabel: deriveWeatherStateLabel(input.state),
    badgeLabel: deriveWeatherBadgeLabel({
      state: input.state,
      temperatureHighC: input.temperatureHighC,
      precipitationChance: input.precipitationChance,
      conditionSummary: input.conditionSummary,
    }),
    badgeTone: deriveWeatherBadgeTone(input.state),
    summary: input.conditionSummary,
    temperatureLabel: `${formatTemperature(input.temperatureHighC)} / ${formatTemperature(input.temperatureLowC)}`,
    rainLabel:
      input.precipitationChance === undefined && input.precipitationMm === undefined
        ? "Rain pending"
        : input.precipitationMm !== undefined
          ? `${formatChance(input.precipitationChance)}, ${input.precipitationMm.toFixed(1)} mm`
          : `${formatChance(input.precipitationChance)} rain`,
    windLabel: input.windGustKph !== undefined
      ? `${formatWind(input.windSpeedKph)}, gusts ${formatWind(input.windGustKph)}`
      : formatWind(input.windSpeedKph),
    uvLabel: input.uvIndex === undefined ? undefined : `UV ${Math.round(input.uvIndex)}`,
    comfortSummary: deriveComfortSummary(input),
    clothingGuidance: deriveClothingGuidance(input),
    planImpact: derivePlanImpact(input),
    sourceLabel: input.sourceName,
    updatedLabel: formatWeatherUpdatedAt(input.capturedAt),
    refreshLabel: input.refreshRecommended ? "Refresh recommended" : "No refresh needed",
    refreshState: input.refreshState,
    refreshReason: input.refreshReason,
    refreshError: input.refreshError,
    canRefresh: input.refreshState !== "refreshing" && input.state !== "day_locked" && input.state !== "missing_coordinates",
    lockedLabel: input.lockedLabel,
  };
}
