import { ConfidenceChip } from "../../components/status/ConfidenceChip";
import { StatusChip } from "../../components/status/StatusChip";
import { CardSurface } from "../../components/surfaces/CardSurface";
import type { DayReadinessAssessment } from "./conditionTypes";
import { toneFromAssessment, toneFromSeverity } from "./conditionViewModels";

function DimensionRow({ label, summary, tone }: { label: string; summary: string; tone: "confirmed" | "review" | "refresh" }) {
  return (
    <div className="day-readiness-panel__dimension">
      <dt>{label}</dt>
      <dd>
        <StatusChip label={summary} tone={tone} />
      </dd>
    </div>
  );
}

export function DayReadinessPanel({ readiness }: { readiness: DayReadinessAssessment }) {
  return (
    <CardSurface className="day-readiness-panel" variant="paper">
      <div className="today-card__heading">
        <div>
          <p className="eyebrow">Conditions board</p>
          <h2>Day readiness</h2>
          <p className="day-readiness-panel__summary">{readiness.summary}</p>
        </div>
        <div className="today-card__metadata">
          <StatusChip label={readiness.statusLabel} tone={toneFromAssessment(readiness)} />
          <StatusChip label={readiness.cruiseConditionLabel} tone={toneFromSeverity(readiness.weather.flags[0]?.severity ?? readiness.severity)} />
          <ConfidenceChip level={readiness.metadata.confidenceLevel} />
        </div>
      </div>

      <dl className="day-readiness-panel__dimensions">
        <DimensionRow label="Timing" summary={readiness.timing.summary} tone={toneFromSeverity(readiness.timing.flags[0]?.severity ?? "neutral")} />
        <DimensionRow label="Weather" summary={readiness.weather.summary} tone={toneFromSeverity(readiness.weather.flags[0]?.severity ?? "neutral")} />
        <DimensionRow label="Plan" summary={readiness.plan.summary} tone={toneFromSeverity(readiness.plan.flags[0]?.severity ?? "neutral")} />
        <DimensionRow label="Family" summary={readiness.family.summary} tone={toneFromSeverity(readiness.family.flags[0]?.severity ?? "neutral")} />
        <DimensionRow label="Trust" summary={readiness.trust.summary} tone={toneFromSeverity(readiness.trust.flags[0]?.severity ?? "neutral")} />
      </dl>

      {readiness.nextActions.length ? (
        <div className="day-readiness-panel__actions">
          <span>Next actions</span>
          <ul>
            {readiness.nextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </CardSurface>
  );
}
