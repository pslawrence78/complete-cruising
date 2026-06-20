import type { PortAttraction } from "../../../data/samplePortData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface AttractionHighlightCardProps {
  attraction: PortAttraction;
  index: number;
}

export function AttractionHighlightCard({ attraction, index }: AttractionHighlightCardProps) {
  return (
    <CardSurface as="article" className="attraction-card" variant="paper">
      <div className="attraction-card__masthead">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <i aria-hidden="true" />
        <small>{attraction.category}</small>
      </div>
      <h3>{attraction.name}</h3>
      <p>{attraction.description}</p>
      <div className="attraction-card__family">
        <span>Family note</span>
        <p>{attraction.familyNote}</p>
        {attraction.sebAngle ? <small><strong>Seb discovery:</strong> {attraction.sebAngle}</small> : null}
      </div>
      <div className="port-card__metadata">
        <StatusChip label={attraction.status.label} tone={attraction.status.tone} />
        <ConfidenceChip label={attraction.confidence.label} level={attraction.confidence.level} />
      </div>
    </CardSurface>
  );
}
