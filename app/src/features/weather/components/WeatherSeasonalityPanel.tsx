import type { WeatherCardModel } from "../weatherTypes";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

type WeatherSeasonalityModel = WeatherCardModel & {
  coordinatesLabel: string;
  seasonalitySummary: string;
};

interface WeatherSeasonalityPanelProps {
  weather: WeatherSeasonalityModel;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function WeatherSeasonalityPanel({ weather, onRefresh, refreshing }: WeatherSeasonalityPanelProps) {
  return (
    <CardSurface as="section" className="weather-seasonality-panel" variant="glass" aria-labelledby="weather-seasonality-title">
      <div className="weather-seasonality-panel__header">
        <div>
          <p className="section-kicker">Weather and seasonality</p>
          <h2 id="weather-seasonality-title">{weather.stateLabel}</h2>
          <p>{weather.seasonalitySummary}</p>
        </div>
        <StatusChip label={weather.refreshLabel} tone={weather.badgeTone} />
      </div>

      <div className="weather-seasonality-panel__grid">
        <div>
          <span>Weather</span>
          <strong>{weather.badgeLabel}</strong>
        </div>
        <div>
          <span>Coordinates</span>
          <strong>{weather.coordinatesLabel}</strong>
        </div>
        <div>
          <span>Source</span>
          <strong>{weather.sourceLabel}</strong>
        </div>
        <div>
          <span>Updated</span>
          <strong>{weather.updatedLabel}</strong>
        </div>
      </div>

      <div className="weather-seasonality-panel__summary">
        <p>{weather.comfortSummary}</p>
        <p>{weather.clothingGuidance}</p>
        <p>{weather.planImpact}</p>
      </div>

      <div className="weather-seasonality-panel__metadata">
        <ConfidenceChip label={weather.confidenceLabel} level={weather.confidenceLevel} />
        <StatusChip label={weather.stateLabel} tone={weather.badgeTone} />
      </div>

      {onRefresh ? (
        <button
          className="weather-seasonality-panel__button"
          type="button"
          disabled={refreshing || !weather.canRefresh}
          onClick={onRefresh}
        >
          {refreshing ? "Refreshing" : weather.refreshLabel}
        </button>
      ) : null}
    </CardSurface>
  );
}

