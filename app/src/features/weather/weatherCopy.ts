import type { WeatherButtonState, WeatherContext, WeatherReadinessState } from "./weatherTypes";

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timestampFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatWeatherDateLabel(value?: string) {
  if (!value) return "Not refreshed yet";
  return shortDateFormatter.format(new Date(`${value}T12:00:00`));
}

export function formatWeatherTimestamp(value?: string) {
  if (!value) return "Not refreshed yet";
  return `Last checked ${timestampFormatter.format(new Date(value))}`;
}

export function getWeatherContextLabel(context?: WeatherContext) {
  switch (context) {
    case "visit_date_forecast":
      return "Visit-date forecast";
    case "weather_now_in_port":
      return "Weather now in port";
    case "same_day_check":
      return "Same-day check";
    case "climate_context":
      return "Climate context";
    case "observed":
      return "Observed weather";
    default:
      return "Weather context";
  }
}

export function getWeatherReadinessLabel(state: WeatherReadinessState) {
  switch (state) {
    case "visit_forecast_ready":
      return "Forecast available";
    case "same_day_checked":
      return "Same-day check";
    case "weather_now_context_only":
      return "Forecast not available yet";
    case "forecast_pending":
      return "Forecast not available yet";
    case "missing_coordinates":
      return "Coordinates needed";
    case "stale":
      return "Last checked earlier";
    case "offline_unavailable":
      return "Offline";
    case "not_applicable":
    default:
      return "Not applicable";
  }
}

export function getWeatherButtonLabel(state: WeatherButtonState) {
  switch (state) {
    case "refreshing":
      return "Refreshing...";
    case "refreshed":
      return "Weather refreshed";
    case "offline":
      return "Offline";
    case "unavailable":
      return "Unavailable";
    case "missing_coordinates":
      return "Coordinates needed";
    case "failed":
      return "Try again";
    case "blocked":
      return "Trusted snapshot preserved";
    case "idle":
    default:
      return "Refresh weather";
  }
}

export function buildWeatherContextMessage(input: {
  dayType?: "embarkation" | "port" | "sea" | "disembarkation" | "scenic_cruising" | "overnight_port";
  hasPortContext?: boolean;
  portName: string;
  visitDateLabel: string;
  weatherDateLabel: string;
  weatherContext?: WeatherContext;
  forecastExpectedFromLabel?: string;
}) {
  if (input.dayType === "sea" || input.dayType === "scenic_cruising" || input.hasPortContext === false) {
    return "Sea-day weather not set.";
  }
  switch (input.weatherContext) {
    case "visit_date_forecast":
      return `Applies to your ${input.portName} call on ${input.visitDateLabel}.`;
    case "same_day_check":
      return `Applies to today in ${input.portName} and should be read as a same-day check refreshed on ${input.weatherDateLabel}.`;
    case "weather_now_in_port":
      return input.forecastExpectedFromLabel
        ? `We cannot forecast your ${input.portName} visit yet, but here is what ${input.portName} feels like today. Complete Cruising will switch to the actual visit-date forecast when it becomes available from ${input.forecastExpectedFromLabel}.`
        : `This is current destination context in ${input.portName}, not the forecast for your visit on ${input.visitDateLabel}.`;
    case "observed":
      return `This records what conditions were like in ${input.portName} for the day itself.`;
    case "climate_context":
    default:
      return `Seasonal guidance is visible for ${input.portName} while live visit-date weather is still pending.`;
  }
}
