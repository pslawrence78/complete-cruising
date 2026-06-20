import { TrustMetadataRow } from "../../../components/status/TrustMetadataRow";
import type { ShorePlan } from "../../../data/sampleExperienceData";

export function ShorePlanCard({ plan, sequence }: { plan: ShorePlan; sequence: number }) {
  const details = [
    ["Duration", plan.duration], ["Transport", plan.transport],
    ["Family fit", plan.familyFit], ["Seb fit", plan.sebFit],
    ["Weather", plan.weatherDependency], ["Return risk", plan.returnRisk],
    ["Return buffer", plan.returnBuffer],
  ];

  return (
    <article className="shore-plan-card" data-selected={plan.selected || undefined}>
      <div className="shore-plan-card__masthead">
        <span>{String(sequence).padStart(2, "0")}</span>
        {plan.selected && <strong>Recommended</strong>}
      </div>
      <p className="shore-plan-card__type">{plan.type}</p>
      <h2>{plan.name}</h2>
      <p className="shore-plan-card__summary">{plan.summary}</p>
      <dl className="shore-plan-card__details">
        {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <div className="shore-plan-card__status"><span>Status</span><strong>{plan.status}</strong></div>
      <TrustMetadataRow metadata={plan.trust} />
    </article>
  );
}
