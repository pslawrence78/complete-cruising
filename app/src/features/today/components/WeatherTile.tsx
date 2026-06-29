import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";
import { WeatherRefreshButton } from "../../weather/WeatherRefreshButton";
import type { WeatherButtonState } from "../../weather/weatherTypes";

interface WeatherTileProps {
  buttonState: WeatherButtonState;
  onRefresh?: () => void;
  weather: TodayData["weather"];
}

export function WeatherTile({ buttonState, onRefresh, weather }: WeatherTileProps) {
  return (
    <CardSurface as="article" className="weather-tile" variant="paper">
      <div className="weather-tile__header">
        <div>
          <p className="paper-kicker">Weather and comfort</p>
          <h2>{weather.portName}</h2>
          <p>{weather.contextMessage}</p>
        </div>
        <span className="weather-tile__sun" aria-hidden="true" />
      </div>

      <div className="weather-tile__headline">
        <strong>{weather.weatherTypeLabel}</strong>
        <span>{weather.readinessLabel}</span>
      </div>

      <dl className="weather-tile__facts">
        <div>
          <dt>Visit date</dt>
          <dd>{weather.visitDateLabel}</dd>
        </div>
        <div>
          <dt>Weather data</dt>
          <dd>{weather.weatherDateLabel}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{weather.weatherTypeLabel}</dd>
        </div>
        <div>
          <dt>Range</dt>
          <dd>{weather.temperatureLabel}</dd>
        </div>
        <div>
          <dt>Rain</dt>
          <dd>{weather.rainLabel}</dd>
        </div>
        <div>
          <dt>Wind</dt>
          <dd>{weather.windLabel}</dd>
        </div>
        {weather.uvLabel ? <div><dt>UV</dt><dd>{weather.uvLabel}</dd></div> : null}
        {weather.forecastExpectedFromLabel ? <div><dt>Visit forecast</dt><dd>Expected from {weather.forecastExpectedFromLabel}</dd></div> : null}
      </dl>

      <div className="weather-tile__comfort">
        <p>{weather.summary}</p>
        <p>{weather.comfortSummary}</p>
        <p>{weather.clothingGuidance}</p>
        <p>{weather.planImpact}</p>
      </div>

      <div className="weather-tile__source">
        <p>{weather.sourceLabel}</p>
        <small>{weather.attributionLabel}</small>
        <small>{weather.updatedLabel}</small>
      </div>

      <div className="today-card__metadata">
        <StatusChip label={weather.readinessLabel} tone={weather.badgeTone} />
        <ConfidenceChip label={weather.confidenceLabel} level={weather.confidenceLevel} />
      </div>

      {onRefresh ? (
        <WeatherRefreshButton
          className="weather-tile__refresh"
          onClick={onRefresh}
          state={buttonState}
        />
      ) : null}
    </CardSurface>
  );
}
