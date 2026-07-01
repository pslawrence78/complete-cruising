import { guidebook } from "../services/guidebook";

export function ItineraryPage() {
  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">15-day route spine</p>
        <h2>Voyage timeline</h2>
        <p className="lede">Embarkation, port calls, sea days and disembarkation in one calm sequence.</p>
      </section>

      <ol className="timeline" aria-label="Cruise itinerary">
        {guidebook.itinerary.map((day) => (
          <li key={day.id} className="timeline__item" data-kind={day.type}>
            <div className="timeline__header">
              <div>
                <p className="eyebrow">Day {day.dayNumber}</p>
                <h3>{day.title}</h3>
              </div>
              <span className={`chip chip--${day.confidence.tone}`}>{day.confidence.label}</span>
            </div>
            <p>{day.subtitle}</p>
            <dl className="timeline__facts">
              <div><dt>Date</dt><dd>{day.date}</dd></div>
              <div><dt>Type</dt><dd>{day.type.replace("-", " ")}</dd></div>
              <div><dt>All aboard</dt><dd>{day.allAboardTime ?? "Not set"}</dd></div>
            </dl>
            <p className="supporting-copy">{day.caveat}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
