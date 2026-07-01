import type { PortGuideData } from "../../../data/samplePortData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface FamilyLensCardProps {
  family: PortGuideData["familyLens"];
}

export function FamilyLensCard({ family }: FamilyLensCardProps) {
  return (
    <CardSurface as="article" className="family-lens-card" variant="glass">
      <div className="family-lens-card__number" aria-hidden="true">3</div>
      <p className="section-kicker">Family lens</p>
      <h2>{family.title}</h2>
      <div className="family-lens-card__balance">
        <span>Best balance</span>
        <p>{family.bestBalance}</p>
      </div>
      <div className="family-lens-card__seb">
        <span>Seb discovery</span>
        <p>{family.sebDiscovery}</p>
      </div>
      <div className="port-card__metadata">
        <StatusChip label={family.status.label} tone={family.status.tone} />
        <ConfidenceChip label={family.confidence.label} level={family.confidence.level} />
      </div>
    </CardSurface>
  );
}
