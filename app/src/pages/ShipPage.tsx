import { guidebook } from "../services/guidebook";

export function ShipPage() {
  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">Sun Princess handbook</p>
        <h2>{guidebook.sailing.ship}</h2>
        <p className="lede">Practical onboard orientation, edited for real family use rather than brochure overload.</p>
      </section>

      <div className="grid grid--ship">
        {guidebook.shipSections.map((section) => (
          <article key={section.title} className="card">
            <p className="eyebrow">{section.cue}</p>
            <h3>{section.title}</h3>
            <p>{section.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
