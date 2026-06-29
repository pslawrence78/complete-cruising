import { getWeatherButtonLabel } from "./weatherCopy";
import type { WeatherButtonState } from "./weatherTypes";

interface WeatherRefreshButtonProps {
  className: string;
  onClick?: () => void;
  state: WeatherButtonState;
}

function isDisabled(state: WeatherButtonState) {
  return state === "refreshing"
    || state === "offline"
    || state === "unavailable"
    || state === "missing_coordinates"
    || state === "blocked";
}

export function WeatherRefreshButton({ className, onClick, state }: WeatherRefreshButtonProps) {
  return (
    <button
      className={className}
      type="button"
      disabled={isDisabled(state)}
      onClick={onClick}
    >
      {getWeatherButtonLabel(state)}
    </button>
  );
}
