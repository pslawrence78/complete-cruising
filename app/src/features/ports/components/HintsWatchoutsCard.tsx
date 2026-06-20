import type { PortGuideData } from "../../../data/samplePortData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface HintsWatchoutsCardProps {
  hints: PortGuideData["hints"];
}

export function HintsWatchoutsCard({ hints }: HintsWatchoutsCardProps) {
  return (
    <CardSurface as="article" className="hints-watchouts-card" variant="glass">
      <p className="section-kicker">Keep the day kind</p>
      <h2>Hints and watchouts</h2>
      <ol>
        {hints.items.map((item, index) => (
          <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
        ))}
      </ol>
      <div className="port-card__metadata">
        <StatusChip label={hints.status.label} tone={hints.status.tone} />
        <ConfidenceChip label={hints.confidence.label} level={hints.confidence.level} />
      </div>
    </CardSurface>
  );
}
