import type { DashboardStatusCard } from "../../../data/sampleDashboardData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface FamilyFocusCardProps {
  item: DashboardStatusCard;
}

export function FamilyFocusCard({ item }: FamilyFocusCardProps) {
  return (
    <CardSurface
      as="article"
      className="dashboard-status-card family-focus-card"
      data-card={item.id}
      variant="glass"
    >
      <div className="family-focus-card__orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="section-kicker">{item.label}</p>
      <h3>{item.title}</h3>
      <p className="dashboard-status-card__description">{item.description}</p>
      <div className="family-focus-card__prompts" aria-hidden="true">
        <span>Flags</span>
        <span>Phrases</span>
        <span>Things to spot</span>
      </div>
      <div className="dashboard-status-card__meta">
        <StatusChip label={item.status.label} tone={item.status.tone} />
        <ConfidenceChip
          label={item.confidence.label}
          level={item.confidence.level}
        />
      </div>
      <a className="quiet-action" href="#/family">
        Open Family Guide <span aria-hidden="true">→</span>
      </a>
    </CardSurface>
  );
}
