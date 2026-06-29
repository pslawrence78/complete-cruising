import type { WeatherCardModel } from "../weatherTypes";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";
import { WeatherRefreshButton } from "../WeatherRefreshButton";
import type { WeatherButtonState } from "../weatherTypes";

type WeatherSeasonalityModel = WeatherCardModel & {
  coordinatesLabel: string;
  seasonalitySummary: string;
};

interface WeatherSeasonalityPanelProps {
  buttonState: WeatherButtonState;
  weather: WeatherSeasonalityModel;
  onRefresh?: () => void;
}

export function WeatherSeasonalityPanel({ buttonState, weather, onRefresh }: WeatherSeasonalityPanelProps) {
  return (
    <CardSurface as="section" className="weather-seasonality-panel" variant="glass" aria-labelledby="weather-seasonality-title">
      <div className="weather-seasonality-panel__header">
        <div>
          <p className="section-kicker">Weather and seasonality</p>
          <h2 id="weather-seasonality-title">{weather.portName}</h2>
          {weather.showContextCaption ? <p>{weather.contextMessage}</p> : null}
        </div>
        <StatusChip label={weather.readinessLabel} tone={weather.badgeTone} />
      </div>

      <div className="weather-seasonality-panel__grid">
        <div>
          <span>Visit date</span>
          <strong>{weather.visitDateLabel}</strong>
        </div>
        <div>
          <span>Weather data</span>
          <strong>{weather.weatherDateLabel}</strong>
        </div>
        <div>
          <span>Type</span>
          <strong>{weather.weatherTypeLabel}</strong>
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
        {weather.forecastExpectedFromLabel ? <div><span>Visit forecast</span><strong>Expected from {weather.forecastExpectedFromLabel}</strong></div> : null}
      </div>

      <div className="weather-seasonality-panel__summary">
        <p>{weather.seasonalitySummary}</p>
        <p>{weather.summary}</p>
        <p>{weather.comfortSummary}</p>
        <p>{weather.clothingGuidance}</p>
        <p>{weather.planImpact}</p>
      </div>

      <div className="weather-seasonality-panel__metadata">
        <ConfidenceChip label={weather.confidenceLabel} level={weather.confidenceLevel} />
        <StatusChip label={weather.attributionLabel} tone="review" />
      </div>

      {onRefresh ? (
        <WeatherRefreshButton
          className="weather-seasonality-panel__button"
          onClick={onRefresh}
          state={buttonState}
        />
      ) : null}
    </CardSurface>
  );
}
