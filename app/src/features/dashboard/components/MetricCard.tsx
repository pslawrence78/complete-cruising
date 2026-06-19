import type { DashboardMetric } from "../../../data/sampleDashboardData";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="metric-card" data-accent={metric.accent}>
      <span className="metric-card__rule" aria-hidden="true" />
      <strong>{metric.value}</strong>
      <span className="metric-card__label">{metric.label}</span>
      <span className="metric-card__detail">{metric.detail}</span>
    </article>
  );
}
