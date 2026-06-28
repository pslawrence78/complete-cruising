import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface TodayPlanSummaryProps {
  plans: TodayData["plans"];
}

export function TodayPlanSummary({ plans }: TodayPlanSummaryProps) {
  return (
    <CardSurface as="section" className="today-plan" variant="glass" aria-labelledby="today-plan-title">
      <div className="today-card__heading">
        <div>
          <p className="section-kicker">Today's useful next step</p>
          <h2 id="today-plan-title">Prepare the day without pretending it is confirmed.</h2>
        </div>
        <StatusChip label={plans.status.label} tone={plans.status.tone} />
      </div>

      <div className="today-plan__options">
        <article className="today-plan__option" data-plan="likely">
          <span>Worth reviewing</span>
          <h3>Guidebook readiness</h3>
          <p>{plans.likely}</p>
          <ConfidenceChip level="medium" />
        </article>
        <article className="today-plan__option" data-plan="backup">
          <span>Later onboard</span>
          <h3>Live day companion</h3>
          <p>{plans.backup}</p>
          <StatusChip label="Heat and energy fallback" tone="confirmed" />
        </article>
      </div>
    </CardSurface>
  );
}
