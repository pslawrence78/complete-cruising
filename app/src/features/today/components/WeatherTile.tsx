import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface WeatherTileProps {
  onRefresh?: () => void;
  refreshDisabled?: boolean;
  weather: TodayData["weather"];
}

export function WeatherTile({ onRefresh, refreshDisabled, weather }: WeatherTileProps) {
  return (
    <CardSurface as="article" className="weather-tile" variant="paper">
      <div className="weather-tile__header">
        <div>
          <p className="paper-kicker">Weather and comfort</p>
          <h2>{weather.summary}</h2>
        </div>
        <span className="weather-tile__sun" aria-hidden="true" />
      </div>

      <div className="weather-tile__headline">
        <strong>{weather.badgeLabel}</strong>
        <span>{weather.stateLabel}</span>
      </div>

      <dl className="weather-tile__facts">
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
        {weather.uvLabel ? (
          <div>
            <dt>UV</dt>
            <dd>{weather.uvLabel}</dd>
          </div>
        ) : null}
      </dl>

      <div className="weather-tile__comfort">
        <p>{weather.comfortSummary}</p>
        <p>{weather.clothingGuidance}</p>
        <p>{weather.planImpact}</p>
      </div>

      <div className="weather-tile__source">
        <p>{weather.sourceLabel}</p>
        <small>{weather.updatedLabel}</small>
      </div>

      <div className="today-card__metadata">
        <StatusChip label={weather.refreshLabel} tone={weather.badgeTone} />
        <ConfidenceChip label={weather.confidenceLabel} level={weather.confidenceLevel} />
      </div>

      {onRefresh ? (
        <button
          className="weather-tile__refresh"
          type="button"
          onClick={onRefresh}
          disabled={refreshDisabled || !weather.canRefresh}
        >
          {weather.refreshLabel}
        </button>
      ) : null}
    </CardSurface>
  );
}

