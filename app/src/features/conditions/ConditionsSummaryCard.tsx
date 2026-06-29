import { StatusChip } from "../../components/status/StatusChip";
import { CardSurface } from "../../components/surfaces/CardSurface";
import type { DashboardConditionsSummary } from "../../data/sampleDashboardData";

export function ConditionsSummaryCard({ summary }: { summary: DashboardConditionsSummary }) {
  return (
    <CardSurface className="conditions-summary-card" variant="glass">
      <div className="conditions-summary-card__header">
        <div>
          <p className="section-kicker">Cruise conditions</p>
          <h2>Conditions board</h2>
        </div>
        <StatusChip
          label={`${summary.usableDays} usable day${summary.usableDays === 1 ? "" : "s"}`}
          tone={summary.readyDays < summary.totalDays ? "review" : "confirmed"}
        />
      </div>
      <p className="conditions-summary-card__lead">
        {summary.readyDays} of {summary.totalDays} days have usable readiness.
      </p>
      <div className="conditions-summary-card__grid">
        <div>
          <span>Ready for today</span>
          <strong>{summary.readyDays}</strong>
        </div>
        <div>
          <span>Need review</span>
          <strong>{Math.max(0, summary.totalDays - summary.readyDays)}</strong>
        </div>
        <div>
          <span>Forecast pending</span>
          <strong>{summary.forecastPendingDays}</strong>
        </div>
        <div>
          <span>Climate only</span>
          <strong>{summary.climateOnlyDays}</strong>
        </div>
      </div>
      {summary.nextReview ? (
        <p className="conditions-summary-card__note">
          Next review: {summary.nextReview}
        </p>
      ) : null}
    </CardSurface>
  );
}
