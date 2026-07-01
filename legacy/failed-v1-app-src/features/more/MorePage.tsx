import "./MorePage.css";

const guideLinks = [
  {
    href: "#/guide-loader",
    eyebrow: "Simple import",
    title: "Guide Loader",
    body: "Paste one calm, structured guide pack and let Complete Cruising place it where the family will actually use it.",
  },
  {
    href: "#/plans",
    eyebrow: "Compare ideas",
    title: "Plans",
    body: "Review shore-day options without dropping into the heavier backstage tools.",
  },
  {
    href: "#/family",
    eyebrow: "Family layer",
    title: "Family Guide",
    body: "Keep Seb discovery prompts, local phrases and family-fit notes together.",
  },
  {
    href: "#/memories",
    eyebrow: "After the day",
    title: "Memories",
    body: "Capture the sailing's warmth later, once the guidebook has done its job ashore.",
  },
];

export function MorePage() {
  return (
    <div className="more-page">
      <header className="more-hero">
        <div>
          <p className="eyebrow">More to the voyage</p>
          <h1>Keep the cruise guide close. Tuck the machinery away.</h1>
          <p>
            Everything here supports the sailing without dragging normal use back
            into setup mode.
          </p>
        </div>
        <aside>
          <span>Calmer by default</span>
          <strong>Guidebook first</strong>
          <p>Operational tools still exist. They simply no longer lead the experience.</p>
        </aside>
      </header>

      <section className="more-grid" aria-labelledby="more-grid-title">
        <div className="more-section-heading">
          <div>
            <p className="section-kicker">Useful next</p>
            <h2 id="more-grid-title">Choose the next layer of the trip.</h2>
          </div>
          <p>These routes stay family-facing and useful during normal planning.</p>
        </div>

        <div className="more-grid__cards">
          {guideLinks.map((link) => (
            <a key={link.href} className="more-card" href={link.href}>
              <p className="section-kicker">{link.eyebrow}</p>
              <h3>{link.title}</h3>
              <p>{link.body}</p>
              <span>Open {link.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="more-backstage">
        <div>
          <p className="section-kicker">Quietly available</p>
          <h2>Need the technical tools?</h2>
          <p>
            Import review, prompt work, data safety and weather diagnostics now
            live in Backstage.
          </p>
        </div>
        <a className="more-backstage__link" href="#/backstage">
          Open Backstage
        </a>
      </section>
    </div>
  );
}
