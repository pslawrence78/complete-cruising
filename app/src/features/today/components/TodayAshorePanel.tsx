import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";
import { RouteMotif } from "../../../components/visual/RouteMotif";
import { AllAboardCard } from "./AllAboardCard";

interface TodayAshorePanelProps {
  currentDay: TodayData["currentDay"];
  returnPlan: TodayData["returnPlan"];
}

export function TodayAshorePanel({
  currentDay,
  returnPlan,
}: TodayAshorePanelProps) {
  return (
    <CardSurface
      as="section"
      className="today-ashore-panel"
      variant="glass"
      aria-labelledby="today-title"
    >
      <RouteMotif className="today-ashore-panel__route" />
      <div className="today-ashore-panel__identity">
        <p className="eyebrow">Today ashore · illustrative day</p>
        <p className="today-ashore-panel__day">
          Day {currentDay.dayNumber} · Port day · {currentDay.dateLabel}
        </p>
        <h1 id="today-title">
          {currentDay.port}, <em>{currentDay.country}</em>
        </h1>
        <p className="today-ashore-panel__summary">
          {currentDay.portSummary}
        </p>
        <StatusChip label="Sample operational view" tone="review" />

        <dl className="today-ashore-panel__times" aria-label="Today's key port times">
          <div>
            <dt>Arrive</dt>
            <dd>{currentDay.arrivalTime}</dd>
          </div>
          <div>
            <dt>Depart</dt>
            <dd>{currentDay.departureTime}</dd>
          </div>
        </dl>
      </div>

      <AllAboardCard
        allAboardTime={currentDay.allAboardTime}
        returnPlan={returnPlan}
      />
    </CardSurface>
  );
}
