import type { PortGuideSectionData } from "../../../data/samplePortData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface PortGuideSectionProps {
  section: PortGuideSectionData;
}

export function PortGuideSection({ section }: PortGuideSectionProps) {
  return (
    <CardSurface as="article" className="port-guide-section" data-section={section.id} variant="glass">
      <p className="section-kicker">{section.eyebrow}</p>
      <h2>{section.title}</h2>
      <p className="port-guide-section__body">{section.body}</p>
      <p className="port-guide-section__note">{section.note}</p>
      <div className="port-card__metadata">
        <StatusChip label={section.status.label} tone={section.status.tone} />
        <ConfidenceChip label={section.confidence.label} level={section.confidence.level} />
      </div>
    </CardSurface>
  );
}
