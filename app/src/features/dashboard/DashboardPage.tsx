import { useState } from "react";
import { LocalDataState } from "../../components/states/LocalDataState";
import { mapDashboard } from "../../data/viewModelMappers";
import { useSailingDashboard } from "../../hooks/useLocalData";
import { MetricCard } from "./components/MetricCard";
import { CruiseWeatherOutlookCard } from "./components/CruiseWeatherOutlookCard";
import { SailingHero } from "./components/SailingHero";
import { VoyageStatusGrid } from "./components/VoyageStatusGrid";
import { refreshCruiseWeatherForSailing } from "../weather/weatherRefreshService";
import { ConditionsSummaryCard } from "../conditions/ConditionsSummaryCard";
import "../conditions/conditions.css";
import "./DashboardPage.css";

export function DashboardPage() {
  const query = useSailingDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [weatherMessage, setWeatherMessage] = useState<string | undefined>();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const dashboard = mapDashboard(query.data);
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  const handleRefreshWeather = async () => {
    setRefreshing(true);
    setWeatherMessage(undefined);
    const result = await refreshCruiseWeatherForSailing(query.data!.sailing.id);
    setWeatherMessage(result.message);
    setRefreshing(false);
  };
  return (
    <div className="dashboard-page">
      <SailingHero
        route={dashboard.route}
        sailing={dashboard.sailing}
      />

      <CruiseWeatherOutlookCard
        offline={offline}
        onRefresh={offline ? undefined : handleRefreshWeather}
        refreshing={refreshing}
        weather={dashboard.weatherOutlook}
      />
      <ConditionsSummaryCard summary={dashboard.conditionsSummary} />
      {weatherMessage ? <p className="dashboard-page__weather-message">{weatherMessage}</p> : null}

      <section className="dashboard-metrics" aria-labelledby="dashboard-metrics-title">
        <div className="dashboard-section-heading dashboard-section-heading--compact">
          <div>
            <p className="section-kicker">Voyage at a glance</p>
            <h2 id="dashboard-metrics-title">The shape of the sailing.</h2>
          </div>
          <p>
            The essential voyage bearings: dates, duration, ports, sea days and
            guidebook readiness without drowning the sailing in admin.
          </p>
        </div>
        <div className="dashboard-metrics__grid">
          {dashboard.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <VoyageStatusGrid items={dashboard.statusCards} />
    </div>
  );
}
