import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";
import { RouteMotif } from "../../../components/visual/RouteMotif";
import { AllAboardCard } from "./AllAboardCard";

interface TodayAshorePanelProps {
  currentDay: TodayData["currentDay"];
  mode: TodayData["mode"];
  nextStep: TodayData["nextStep"];
  returnPlan: TodayData["returnPlan"];
}

export function TodayAshorePanel({
  currentDay,
  mode,
  nextStep,
  returnPlan,
}: TodayAshorePanelProps) {
  const isPreCruise = mode === "pre-cruise";
  return (
    <CardSurface
      as="section"
      className="today-ashore-panel"
      variant="glass"
      aria-labelledby="today-title"
    >
      <RouteMotif className="today-ashore-panel__route" />
      <div className="today-ashore-panel__identity">
        <p className="eyebrow">{isPreCruise ? "Pre-cruise Today" : "Today ashore"}</p>
        <p className="today-ashore-panel__day">
          Day {currentDay.dayNumber} - {isPreCruise ? "Embarkation preparing" : "Port day"} - {currentDay.dateLabel}
        </p>
        <h1 id="today-title">
          {currentDay.port}, <em>{currentDay.country}</em>
        </h1>
        <p className="today-ashore-panel__summary">
          {currentDay.portSummary}
        </p>
        <StatusChip label={isPreCruise ? "Companion preparing" : "Operational view"} tone="review" />

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
      <a className="today-next-step" href={nextStep.href}>
        <span>{nextStep.label}</span>
        <strong>{nextStep.title}</strong>
        <small>{nextStep.body}</small>
      </a>
    </CardSurface>
  );
}
