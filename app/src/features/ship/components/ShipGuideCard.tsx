import type { ShipGuideSection } from "../../../data/sampleShipData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface ShipGuideCardProps {
  section: ShipGuideSection;
}

export function ShipGuideCard({ section }: ShipGuideCardProps) {
  return (
    <CardSurface
      as="article"
      className="ship-guide-card"
      data-accent={section.accent}
      data-section={section.id}
      variant="glass"
    >
      <div className="ship-guide-card__masthead">
        <span className="ship-guide-card__index">{section.index}</span>
        <span className="ship-guide-card__rule" aria-hidden="true" />
        <span className="ship-guide-card__watchword">{section.watchword}</span>
      </div>

      <h3>{section.title}</h3>
      <p className="ship-guide-card__summary">{section.summary}</p>

      <div className="ship-guide-card__next">
        <span>Next enrichment</span>
        <p>{section.nextStep}</p>
      </div>

      <div className="ship-guide-card__metadata">
        <StatusChip label={section.status.label} tone={section.status.tone} />
        <ConfidenceChip
          label={section.confidence.label}
          level={section.confidence.level}
        />
      </div>
    </CardSurface>
  );
}
