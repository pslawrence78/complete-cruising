import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface WeatherTileProps {
  weather: TodayData["weather"];
}

export function WeatherTile({ weather }: WeatherTileProps) {
  return (
    <CardSurface as="article" className="weather-tile" variant="paper">
      <div className="weather-tile__header">
        <div>
          <p className="paper-kicker">Weather readiness</p>
          <h2>{weather.condition}</h2>
        </div>
        <span className="weather-tile__sun" aria-hidden="true" />
      </div>
      <div className="weather-tile__reading">
        <strong>{weather.highTemperature}</strong>
        <span>Expected high</span>
      </div>
      <dl className="weather-tile__facts">
        <div>
          <dt>Rain</dt>
          <dd>{weather.rainChance}</dd>
        </div>
        <div>
          <dt>Plan impact</dt>
          <dd>{weather.planImpact}</dd>
        </div>
      </dl>
      <div className="today-card__metadata">
        <StatusChip label={weather.refreshLabel} tone="refresh" />
        <ConfidenceChip level={weather.confidence} />
      </div>
    </CardSurface>
  );
}
