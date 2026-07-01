import { guidebook } from "../services/guidebook";

export function PortsPage() {
  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">Guidebook ports</p>
        <h2>Port postcards</h2>
        <p className="lede">Reusable port context, kept visibly separate from sailing-day timings and return decisions.</p>
      </section>

      <div className="postcard-grid">
        {guidebook.ports.map((port) => (
          <article key={port.id} className="card postcard">
            <p className="eyebrow">{port.country}</p>
            <h3>{port.name}</h3>
            <p>{port.overview}</p>
            <ul className="plain-list plain-list--compact">
              {port.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p className="supporting-copy"><strong>Family lens:</strong> {port.familyLens}</p>
            <p className="supporting-copy"><strong>Seb angle:</strong> {port.sebAngle}</p>
            <p className="supporting-copy"><strong>Return-risk note:</strong> {port.returnRiskNote}</p>
            <p className={`chip chip--${port.confidence.tone}`}>{port.confidence.label}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
