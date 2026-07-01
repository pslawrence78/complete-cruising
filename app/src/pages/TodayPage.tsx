import { getTodayContext } from "../services/guidebook";

const modeTitles = {
  "pre-cruise": "Pre-cruise Today",
  "embarkation-day": "Embarkation Today",
  "port-day": "Port Day Today",
  "sea-day": "Sea Day Today",
  "disembarkation-day": "Disembarkation Today",
  "post-cruise": "Post-cruise Today",
} as const;

export function TodayPage() {
  const { mode, focusDay, selectedPlan, backupPlan, port } = getTodayContext();

  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">{modeTitles[mode]}</p>
        <h2>{focusDay.title}</h2>
        <p className="lede">{focusDay.subtitle}</p>
      </section>

      <section className="grid grid--today">
        <article className="card time-card">
          <p className="eyebrow">Operational frame</p>
          <div className="time-card__row">
            <div>
              <span>Arrival</span>
              <strong>{focusDay.arrivalTime ?? "Not set"}</strong>
            </div>
            <div>
              <span>Departure</span>
              <strong>{focusDay.departureTime ?? "Not set"}</strong>
            </div>
            <div>
              <span>All aboard</span>
              <strong>{focusDay.allAboardTime ?? "Not set"}</strong>
            </div>
          </div>
          <p className="time-card__note">{focusDay.caveat}</p>
        </article>

        <article className="card">
          <p className="eyebrow">Selected plan</p>
          <h3>{selectedPlan?.name ?? "Ship-first guidebook day"}</h3>
          <p>{selectedPlan?.summary ?? focusDay.subtitle}</p>
          <p className="badge-row">
            <span className="badge">{selectedPlan?.familyFit ?? "Family-fit guide"}</span>
            <span className="badge">{selectedPlan?.returnRisk ?? "Guidebook-paced"}</span>
          </p>
        </article>
      </section>

      <section className="grid grid--two">
        <article className="card">
          <p className="eyebrow">Backup plan</p>
          <h3>{backupPlan?.name ?? "Keep the day simpler."}</h3>
          <p>{backupPlan?.summary ?? "If energy or logistics shift, preserve the calmer version of the day."}</p>
          <p className="supporting-copy">{backupPlan?.returnBuffer ?? focusDay.returnBuffer}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Return buffer</p>
          <h3>Protect the margin.</h3>
          <p>{focusDay.returnBuffer}</p>
          <p className="supporting-copy">{port?.returnRiskNote ?? "Use the lighter option if the day starts feeling stretched."}</p>
        </article>
      </section>

      <section className="grid grid--two">
        <article className="card">
          <p className="eyebrow">Take ashore</p>
          <ul className="plain-list">
            {focusDay.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <p className="eyebrow">Seb discovery</p>
          <h3>One prompt, not ten.</h3>
          <p>{focusDay.sebPrompt}</p>
          <p className="supporting-copy">{focusDay.memoryPrompt}</p>
        </article>
      </section>
    </div>
  );
}
