import type { TrustMetadata } from "../../data/sampleExperienceData";
import { ConfidenceChip } from "./ConfidenceChip";
import { StatusChip } from "./StatusChip";

export function TrustMetadataRow({ metadata }: { metadata: TrustMetadata }) {
  return (
    <div className="experience-trust" aria-label="Confidence, review and refresh metadata">
      <ConfidenceChip label={metadata.confidence.label} level={metadata.confidence.level} />
      <StatusChip label={metadata.review.label} tone={metadata.review.tone} />
      <StatusChip label={metadata.refresh.label} tone={metadata.refresh.tone} />
    </div>
  );
}
