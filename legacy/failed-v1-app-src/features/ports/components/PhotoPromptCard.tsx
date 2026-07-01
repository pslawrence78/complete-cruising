import type { PortGuideData } from "../../../data/samplePortData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface PhotoPromptCardProps {
  photo: PortGuideData["photoPrompt"];
}

export function PhotoPromptCard({ photo }: PhotoPromptCardProps) {
  return (
    <CardSurface as="article" className="photo-prompt-card" variant="paper">
      <div className="photo-prompt-card__frame" aria-hidden="true">
        <span className="photo-prompt-card__sun" />
        <span className="photo-prompt-card__volcano" />
        <span className="photo-prompt-card__water" />
      </div>
      <p className="paper-kicker">Photography</p>
      <h2>A frame worth waiting for</h2>
      <blockquote>{photo.prompt}</blockquote>
      <p className="photo-prompt-card__caption">{photo.caption}</p>
      <div className="port-card__metadata">
        <StatusChip label={photo.status.label} tone={photo.status.tone} />
        <ConfidenceChip label={photo.confidence.label} level={photo.confidence.level} />
      </div>
    </CardSurface>
  );
}
