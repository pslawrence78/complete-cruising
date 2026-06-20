import { LocalDataState } from "../../components/states/LocalDataState";
import { mapDashboard } from "../../data/viewModelMappers";
import { useSailingDashboard } from "../../hooks/useLocalData";
import { MetricCard } from "./components/MetricCard";
import { SailingHero } from "./components/SailingHero";
import { VoyageStatusGrid } from "./components/VoyageStatusGrid";
import "./DashboardPage.css";

export function DashboardPage() {
  const query = useSailingDashboard();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const dashboard = mapDashboard(query.data);
  return (
    <div className="dashboard-page">
      <SailingHero
        route={dashboard.route}
        sailing={dashboard.sailing}
      />

      <section className="dashboard-metrics" aria-labelledby="dashboard-metrics-title">
        <div className="dashboard-section-heading dashboard-section-heading--compact">
          <div>
            <p className="section-kicker">Voyage at a glance</p>
            <h2 id="dashboard-metrics-title">The shape of the sailing.</h2>
          </div>
          <p>
            A deliberately small set of signals—enough to orient the family
            without turning the dashboard into a control panel.
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
