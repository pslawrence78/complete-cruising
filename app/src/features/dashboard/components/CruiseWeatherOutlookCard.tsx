import type { DashboardData } from "../../../data/sampleDashboardData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";
import { RouteMotif } from "../../../components/visual/RouteMotif";
import { WeatherRefreshButton } from "../../weather/WeatherRefreshButton";

interface CruiseWeatherOutlookCardProps {
  onRefresh?: () => void;
  weather: DashboardData["weatherOutlook"];
}

export function CruiseWeatherOutlookCard({ onRefresh, weather }: CruiseWeatherOutlookCardProps) {
  return (
    <CardSurface as="section" className="cruise-weather-outlook" variant="glass" aria-labelledby="cruise-weather-outlook-title">
      <RouteMotif className="cruise-weather-outlook__motif" />
      <div className="cruise-weather-outlook__header">
        <div>
          <p className="section-kicker">Cruise weather outlook</p>
          <h2 id="cruise-weather-outlook-title">{weather.portName}</h2>
          <p>{weather.contextMessage}</p>
        </div>
        <StatusChip label={weather.readinessLabel} tone={weather.refreshTone} />
      </div>

      <div className="cruise-weather-outlook__grid">
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
          <span>Source</span>
          <strong>{weather.source}</strong>
        </div>
        <div>
          <span>Attribution</span>
          <strong>{weather.attributionLabel}</strong>
        </div>
        <div>
          <span>Last updated</span>
          <strong>{weather.lastUpdated}</strong>
        </div>
        {weather.expectedForecastFromLabel ? <div><span>Visit forecast</span><strong>Expected from {weather.expectedForecastFromLabel}</strong></div> : null}
      </div>

      <p className="cruise-weather-outlook__privacy">{weather.privacyNote}</p>

      <div className="cruise-weather-outlook__actions">
        <StatusChip label={weather.stateLabel} tone={weather.refreshTone} />
        {onRefresh ? (
          <WeatherRefreshButton
            className="cruise-weather-outlook__button"
            onClick={onRefresh}
            state={weather.refreshButtonState}
          />
        ) : null}
      </div>
    </CardSurface>
  );
}
