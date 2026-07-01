import { guidebook, getCountdown } from "../services/guidebook";

export function DashboardPage() {
  const countdown = getCountdown();

  return (
    <div className="page page--dashboard">
      <section className="hero-card card card--hero">
        <div>
          <p className="eyebrow">Cruise-stable fresh base</p>
          <h2>{guidebook.sailing.name}</h2>
          <p className="lede">
            {guidebook.product.routeSummary}
          </p>
        </div>
        <div className="hero-card__metrics">
          <div className="metric">
            <strong>{countdown}</strong>
            <span>days to embarkation</span>
          </div>
          <div className="metric">
            <strong>{guidebook.sailing.nights}</strong>
            <span>nights</span>
          </div>
          <div className="metric">
            <strong>{guidebook.sailing.portDays}</strong>
            <span>port days</span>
          </div>
        </div>
      </section>

      <section className="grid grid--two">
        <article className="card">
          <p className="eyebrow">Next useful action</p>
          <h3>Start with Day 1 and Naples.</h3>
          <p>{guidebook.sailing.nextAction}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Confidence and caveat</p>
          <h3>Guidebook-first, not booking-complete.</h3>
          <p>{guidebook.product.caveat}</p>
        </article>
      </section>

      <section className="card route-card">
        <p className="eyebrow">Route motif</p>
        <div className="route-card__line" aria-hidden="true">
          {guidebook.itinerary.map((day) => (
            <span key={day.id} data-kind={day.type} />
          ))}
        </div>
        <div className="route-card__stops">
          <span>{guidebook.sailing.embarkationPort}</span>
          <span>Barcelona</span>
        </div>
      </section>
    </div>
  );
}
