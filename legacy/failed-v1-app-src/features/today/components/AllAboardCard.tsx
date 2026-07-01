import type { TodayData } from "../../../data/sampleTodayData";
import { StatusChip } from "../../../components/status/StatusChip";

interface AllAboardCardProps {
  allAboardTime: string;
  returnPlan: TodayData["returnPlan"];
}

export function AllAboardCard({
  allAboardTime,
  returnPlan,
}: AllAboardCardProps) {
  return (
    <aside className="all-aboard-card" aria-labelledby="all-aboard-title">
      <div className="all-aboard-card__signal" aria-hidden="true" />
      <p>Back on board by</p>
      <h2 id="all-aboard-title">{allAboardTime}</h2>
      <div className="all-aboard-card__safe-return">
        <span>Latest safe return to port area</span>
        <strong>{returnPlan.latestSafeReturn}</strong>
      </div>
      <p className="all-aboard-card__note">{returnPlan.note}</p>
      <StatusChip label="Medium return risk" tone="review" />
    </aside>
  );
}
