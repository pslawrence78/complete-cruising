import { StatusChip } from "../../components/status/StatusChip";
import type { DayReadinessAssessment } from "./conditionTypes";
import { toneFromAssessment } from "./conditionViewModels";

export function ConditionBadge({ readiness }: { readiness: DayReadinessAssessment }) {
  return <StatusChip label={readiness.statusLabel} tone={toneFromAssessment(readiness)} />;
}
