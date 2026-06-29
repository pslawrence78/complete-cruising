import { buildWeatherContextMessage, formatWeatherTimestamp, getWeatherButtonLabel, getWeatherContextLabel, getWeatherReadinessLabel } from "./weatherCopy";
import type { WeatherButtonState, WeatherCardModel, WeatherContext, WeatherReadinessState, WeatherState } from "./weatherTypes";

export function formatTemperature(value?: number) {
  return value === undefined ? "Pending" : `${Math.round(value)} C`;
}

export function formatChance(value?: number) {
  return value === undefined ? "Pending" : `${Math.round(value)}%`;
}

export function formatWind(value?: number) {
  return value === undefined ? "Pending" : `${Math.round(value)} km/h`;
}

export function summariseWeatherCondition(model: Pick<WeatherCardModel, "summary" | "contextMessage" | "refreshReason">) {
  return model.summary || model.contextMessage || model.refreshReason;
}

export function deriveComfortSummary(model: {
  temperatureHighC?: number;
  temperatureCurrentC?: number;
  precipitationChance?: number;
  windSpeedKph?: number;
  uvIndex?: number;
}) {
  const referenceTemperature = model.temperatureCurrentC ?? model.temperatureHighC;
  const pieces: string[] = [];
  if (referenceTemperature !== undefined) {
    pieces.push(referenceTemperature >= 27 ? "Warm port feel" : referenceTemperature <= 17 ? "Cooler port feel" : "Comfortable port feel");
  }
  if (model.precipitationChance !== undefined && model.precipitationChance >= 40) pieces.push("rain possible");
  if (model.windSpeedKph !== undefined && model.windSpeedKph >= 28) pieces.push("breezy");
  if (model.uvIndex !== undefined && model.uvIndex >= 6) pieces.push("shade matters");
  if (!pieces.length) return "Comfort looks manageable.";
  return `${pieces.join(", ")}.`;
}

export function deriveClothingGuidance(model: {
  temperatureHighC?: number;
  temperatureCurrentC?: number;
  precipitationChance?: number;
  windSpeedKph?: number;
  uvIndex?: number;
}) {
  const referenceTemperature = model.temperatureCurrentC ?? model.temperatureHighC;
  const notes: string[] = [];
  if (referenceTemperature !== undefined && referenceTemperature >= 27) notes.push("hats and water");
  if (model.precipitationChance !== undefined && model.precipitationChance >= 40) notes.push("a light waterproof");
  if (model.windSpeedKph !== undefined && model.windSpeedKph >= 28) notes.push("something wind-resistant");
  if (model.uvIndex !== undefined && model.uvIndex >= 6) notes.push("sun cream and shade breaks");
  if (!notes.length) return "Light layers should be enough.";
  if (notes.length === 1) return `${notes[0].replace(/^./, (value) => value.toUpperCase())} are worth packing.`;
  return `${notes.slice(0, -1).join(", ")} and ${notes.at(-1)} are worth packing.`;
}

export function derivePlanImpact(model: {
  temperatureHighC?: number;
  temperatureCurrentC?: number;
  precipitationChance?: number;
  windSpeedKph?: number;
  weatherContext?: WeatherContext;
  readinessState?: WeatherReadinessState;
}) {
  if (model.readinessState === "missing_coordinates") return "Refresh is unavailable until usable port coordinates are available.";
  if (model.weatherContext === "weather_now_in_port") return "Use this as destination context only while the visit-date forecast remains pending.";
  if (model.precipitationChance !== undefined && model.precipitationChance >= 50) return "Rain may make the plan feel softer and slower.";
  if (model.windSpeedKph !== undefined && model.windSpeedKph >= 32) return "Higher wind may affect exposed viewpoints or tender comfort.";
  const referenceTemperature = model.temperatureCurrentC ?? model.temperatureHighC;
  if (referenceTemperature !== undefined && referenceTemperature >= 28) return "Shade, water and lighter pacing may matter ashore.";
  return "Keep the plan flexible, then let the day stay cruise-shaped rather than weather-led.";
}

export function deriveWeatherStateLabel(state: WeatherState) {
  switch (state) {
    case "climate_expectation":
      return "Context only";
    case "forecast_pending":
      return "Forecast pending";
    case "forecast_available":
    case "forecast_recent":
      return "Forecast available";
    case "forecast_stale":
      return "Forecast stale";
    case "day_locked":
      return "Observed";
    case "historical_lookup_available":
      return "Past day";
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
    default:
      return "refresh" as const;
  }
}

export function deriveWeatherBadgeLabel(model: {
  readinessState: WeatherReadinessState;
  weatherTypeLabel: string;
  temperatureHighC?: number;
  temperatureCurrentC?: number;
  precipitationChance?: number;
}) {
  if (model.readinessState === "forecast_pending") return "Forecast pending";
  if (model.readinessState === "missing_coordinates") return "Coords needed";
  const pieces: string[] = [];
  const referenceTemperature = model.temperatureCurrentC ?? model.temperatureHighC;
  if (referenceTemperature !== undefined) pieces.push(`${Math.round(referenceTemperature)} C`);
  if (model.precipitationChance !== undefined) pieces.push(`rain ${Math.round(model.precipitationChance)}%`);
  if (!pieces.length) return model.weatherTypeLabel;
  return pieces.join(" | ");
}

export function createWeatherCardModel(input: {
  portName: string;
  visitDate: string;
  visitDateLabel: string;
  weatherDate?: string;
  weatherDateLabel: string;
  weatherContext?: WeatherContext;
  forecastExpectedFrom?: string;
  forecastExpectedFromLabel?: string;
  readinessState: WeatherReadinessState;
  state: WeatherState;
  conditionSummary: string;
  capturedAt?: string;
  sourceName: string;
  sourceAttribution: string;
  temperatureHighC?: number;
  temperatureLowC?: number;
  temperatureCurrentC?: number;
  precipitationChance?: number;
  precipitationMm?: number;
  windSpeedKph?: number;
  uvIndex?: number;
  apparentTemperatureC?: number;
  refreshState: WeatherCardModel["refreshState"];
  refreshReason?: string;
  refreshError?: string;
  refreshRecommended: boolean;
  buttonState: WeatherButtonState;
  isVisitDateForecast: boolean;
  satisfiesVisitForecastReadiness: boolean;
  lockedLabel?: string;
}): WeatherCardModel {
  const confidenceLevel: WeatherCardModel["confidenceLevel"] =
    input.readinessState === "visit_forecast_ready" || input.readinessState === "same_day_checked"
      ? "high"
      : input.readinessState === "weather_now_context_only"
        ? "low"
        : input.readinessState === "forecast_pending"
          ? "unknown"
          : input.readinessState === "stale"
            ? "low"
            : input.readinessState === "missing_coordinates"
              ? "unknown"
              : "inferred";
  const readinessLabel = getWeatherReadinessLabel(input.readinessState);
  const weatherTypeLabel = getWeatherContextLabel(input.weatherContext);
  const badgeTone = deriveWeatherBadgeTone(input.state);

  return {
    confidenceLabel: `${confidenceLevel.replaceAll("_", " ")} confidence`,
    confidenceLevel,
    state: input.state,
    stateLabel: deriveWeatherStateLabel(input.state),
    readinessState: input.readinessState,
    readinessLabel,
    badgeLabel: deriveWeatherBadgeLabel({
      readinessState: input.readinessState,
      weatherTypeLabel,
      temperatureHighC: input.temperatureHighC,
      temperatureCurrentC: input.temperatureCurrentC,
      precipitationChance: input.precipitationChance,
    }),
    badgeTone,
    summary: input.conditionSummary,
    contextMessage: buildWeatherContextMessage({
      portName: input.portName,
      visitDateLabel: input.visitDateLabel,
      weatherDateLabel: input.weatherDateLabel,
      weatherContext: input.weatherContext,
      forecastExpectedFromLabel: input.forecastExpectedFromLabel,
    }),
    portName: input.portName,
    visitDate: input.visitDate,
    visitDateLabel: input.visitDateLabel,
    weatherDate: input.weatherDate,
    weatherDateLabel: input.weatherDateLabel,
    weatherTypeLabel,
    weatherContext: input.weatherContext,
    forecastExpectedFrom: input.forecastExpectedFrom,
    forecastExpectedFromLabel: input.forecastExpectedFromLabel,
    sourceName: input.sourceName,
    temperatureLabel: input.temperatureHighC !== undefined || input.temperatureLowC !== undefined
      ? `${formatTemperature(input.temperatureHighC)} / ${formatTemperature(input.temperatureLowC)}`
      : formatTemperature(input.temperatureCurrentC),
    rainLabel:
      input.precipitationChance === undefined && input.precipitationMm === undefined
        ? "Rain pending"
        : input.precipitationMm !== undefined
          ? `${formatChance(input.precipitationChance)}, ${input.precipitationMm.toFixed(1)} mm`
          : `${formatChance(input.precipitationChance)} rain`,
    windLabel: formatWind(input.windSpeedKph),
    uvLabel: input.uvIndex === undefined ? undefined : `UV ${Math.round(input.uvIndex)}`,
    comfortSummary: deriveComfortSummary(input),
    clothingGuidance: deriveClothingGuidance(input),
    planImpact: derivePlanImpact(input),
    sourceLabel: input.sourceName,
    attributionLabel: input.sourceAttribution,
    updatedLabel: formatWeatherTimestamp(input.capturedAt),
    refreshLabel: getWeatherButtonLabel(input.buttonState),
    refreshState: input.refreshState,
    refreshReason: input.refreshReason,
    refreshError: input.refreshError,
    canRefresh: input.buttonState === "idle" || input.buttonState === "failed" || input.buttonState === "refreshed",
    buttonState: input.buttonState,
    isVisitDateForecast: input.isVisitDateForecast,
    satisfiesVisitForecastReadiness: input.satisfiesVisitForecastReadiness,
    lockedLabel: input.lockedLabel,
  };
}
