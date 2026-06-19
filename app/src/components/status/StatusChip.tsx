export type StatusTone = "confirmed" | "review" | "refresh";

interface StatusChipProps {
  label: string;
  tone: StatusTone;
}

const statusIcons: Record<StatusTone, string> = {
  confirmed: "✓",
  review: "◇",
  refresh: "↻",
};

export function StatusChip({ label, tone }: StatusChipProps) {
  return (
    <span className="meta-chip status-chip" data-tone={tone}>
      <span className="meta-chip__icon" aria-hidden="true">
        {statusIcons[tone]}
      </span>
      {label}
    </span>
  );
}
