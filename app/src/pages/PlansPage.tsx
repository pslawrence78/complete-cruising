import { guidebook } from "../services/guidebook";

export function PlansPage() {
  const featuredPlans = guidebook.plans.filter((plan) => plan.kind === "selected");

  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">Shore plans</p>
        <h2>Selected and backup options</h2>
        <p className="lede">Comparison cards for the plans most likely to matter once the sailing is live.</p>
      </section>

      <div className="grid grid--two">
        {featuredPlans.map((plan) => {
          const backup = guidebook.plans.find((candidate) => candidate.dayId === plan.dayId && candidate.kind === "backup");
          return (
            <article key={plan.id} className="card">
              <p className="eyebrow">{plan.kind === "selected" ? "Selected plan" : "Backup plan"}</p>
              <h3>{plan.name}</h3>
              <p>{plan.summary}</p>
              <dl className="timeline__facts">
                <div><dt>Effort</dt><dd>{plan.effort}</dd></div>
                <div><dt>Family fit</dt><dd>{plan.familyFit}</dd></div>
                <div><dt>Return risk</dt><dd>{plan.returnRisk}</dd></div>
              </dl>
              <p className="supporting-copy">{plan.returnBuffer}</p>
              {backup ? <p className="supporting-copy"><strong>Backup:</strong> {backup.name}</p> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
