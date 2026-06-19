export type ConfidenceLevel =
  | "confirmed"
  | "high"
  | "medium"
  | "low"
  | "inferred"
  | "unknown";

interface ConfidenceChipProps {
  label?: string;
  level: ConfidenceLevel;
}

const confidenceLabels: Record<ConfidenceLevel, string> = {
  confirmed: "Confirmed",
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  inferred: "Inferred",
  unknown: "Confidence unknown",
};

export function ConfidenceChip({ label, level }: ConfidenceChipProps) {
  return (
    <span className="meta-chip confidence-chip" data-level={level}>
      <span className="meta-chip__dot" aria-hidden="true" />
      {label ?? confidenceLabels[level]}
    </span>
  );
}
