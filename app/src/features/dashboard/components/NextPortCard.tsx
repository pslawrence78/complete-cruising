import type { DashboardStatusCard } from "../../../data/sampleDashboardData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface NextPortCardProps {
  item: DashboardStatusCard;
}

export function NextPortCard({ item }: NextPortCardProps) {
  return (
    <CardSurface
      as="article"
      className="dashboard-status-card next-port-card"
      data-card={item.id}
      variant="paper"
    >
      <div className="next-port-card__stamp" aria-hidden="true">
        <span>Port</span>
        <strong>02</strong>
        <span>Review</span>
      </div>
      <p className="paper-kicker">{item.label}</p>
      <h3>{item.title}</h3>
      <p className="dashboard-status-card__description">{item.description}</p>
      <div className="dashboard-status-card__meta">
        <StatusChip label={item.status.label} tone={item.status.tone} />
        <ConfidenceChip
          label={item.confidence.label}
          level={item.confidence.level}
        />
      </div>
      <a className="quiet-action" href="#/ports">
        Open Naples guide <span aria-hidden="true">→</span>
      </a>
      <div className="next-port-card__coordinate" aria-hidden="true">
        40.8518° N · 14.2681° E
      </div>
    </CardSurface>
  );
}
