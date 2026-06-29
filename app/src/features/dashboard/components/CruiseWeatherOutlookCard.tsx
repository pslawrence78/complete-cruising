import type { DashboardData } from "../../../data/sampleDashboardData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";
import { RouteMotif } from "../../../components/visual/RouteMotif";

interface CruiseWeatherOutlookCardProps {
  offline: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  weather: DashboardData["weatherOutlook"];
}

export function CruiseWeatherOutlookCard({ offline, onRefresh, refreshing, weather }: CruiseWeatherOutlookCardProps) {
  return (
    <CardSurface as="section" className="cruise-weather-outlook" variant="glass" aria-labelledby="cruise-weather-outlook-title">
      <RouteMotif className="cruise-weather-outlook__motif" />
      <div className="cruise-weather-outlook__header">
        <div>
          <p className="section-kicker">Cruise weather outlook</p>
          <h2 id="cruise-weather-outlook-title">{weather.summary}</h2>
          <p>{weather.stateLabel}</p>
        </div>
        <StatusChip label={weather.refreshLabel} tone={weather.refreshTone} />
      </div>

      <div className="cruise-weather-outlook__grid">
        <div>
          <span>Source</span>
          <strong>{weather.source}</strong>
        </div>
        <div>
          <span>Last updated</span>
          <strong>{weather.lastUpdated}</strong>
        </div>
      </div>

      <p className="cruise-weather-outlook__privacy">{weather.privacyNote}</p>

      <div className="cruise-weather-outlook__actions">
        <StatusChip label={offline ? "Offline" : weather.canRefresh ? "Ready to refresh" : "Refresh pending"} tone={offline || !weather.canRefresh ? "review" : "confirmed"} />
        {onRefresh ? (
          <button
            type="button"
            className="cruise-weather-outlook__button"
            disabled={offline || refreshing}
            onClick={onRefresh}
          >
            {refreshing ? "Refreshing" : weather.refreshLabel}
          </button>
        ) : null}
      </div>
    </CardSurface>
  );
}

