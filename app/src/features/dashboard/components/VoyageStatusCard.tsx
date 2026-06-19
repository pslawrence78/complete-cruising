import type { DashboardStatusCard } from "../../../data/sampleDashboardData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface VoyageStatusCardProps {
  item: DashboardStatusCard;
  sequence: number;
}

export function VoyageStatusCard({
  item,
  sequence,
}: VoyageStatusCardProps) {
  return (
    <CardSurface
      as="article"
      className="dashboard-status-card"
      data-card={item.id}
      variant={item.surface}
    >
      <div className="dashboard-status-card__index" aria-hidden="true">
        {String(sequence).padStart(2, "0")}
      </div>
      <p className={item.surface === "paper" ? "paper-kicker" : "section-kicker"}>
        {item.label}
      </p>
      <h3>{item.title}</h3>
      <p className="dashboard-status-card__description">{item.description}</p>
      <div className="dashboard-status-card__meta">
        <StatusChip label={item.status.label} tone={item.status.tone} />
        <ConfidenceChip
          label={item.confidence.label}
          level={item.confidence.level}
        />
      </div>
    </CardSurface>
  );
}
