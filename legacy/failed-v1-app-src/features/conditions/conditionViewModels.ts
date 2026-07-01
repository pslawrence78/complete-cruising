import type { StatusTone } from "../../components/status/StatusChip";
import type { DayReadinessAssessment, ReadinessSeverity } from "./conditionTypes";

export function toneFromSeverity(severity: ReadinessSeverity): StatusTone {
  switch (severity) {
    case "positive":
      return "confirmed";
    case "critical":
    case "caution":
      return "refresh";
    case "notice":
    case "neutral":
    default:
      return "review";
  }
}

export function toneFromAssessment(readiness: DayReadinessAssessment): StatusTone {
  return toneFromSeverity(readiness.severity);
}
