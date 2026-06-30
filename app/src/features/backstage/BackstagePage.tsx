import "./BackstagePage.css";

const backstageRoutes = [
  {
    href: "#/weather-review",
    title: "Weather Review",
    body: "Inspect competing snapshots, review timing and keep one calm weather surface in the main app.",
  },
  {
    href: "#/import-export",
    title: "Import / Export",
    body: "Use the full validation workbench when you need record-level preview, audit batches or exports.",
  },
  {
    href: "#/enrichment-requests",
    title: "Prompt Studio",
    body: "Generate governed prompt contracts when the lighter Guide Loader is not enough.",
  },
  {
    href: "#/sailing-setup",
    title: "Sailing Setup",
    body: "Adjust the core sailing shell without mixing guidebook content into itinerary records.",
  },
  {
    href: "#/data-management",
    title: "Data Safety",
    body: "Backups, reset controls and recovery helpers stay here, away from day-to-day guide use.",
  },
];

export function BackstagePage() {
  return (
    <div className="backstage-page">
      <header className="backstage-hero">
        <div>
          <p className="eyebrow">Backstage / Data tools</p>
          <h1>Technical controls, quietly off the main stage.</h1>
          <p>
            These tools are still available for careful data work, but the main
            experience can now behave like a cruise companion instead of a
            console.
          </p>
        </div>
      </header>

      <section className="backstage-grid" aria-labelledby="backstage-grid-title">
        <div className="backstage-heading">
          <div>
            <p className="section-kicker">Advanced routes</p>
            <h2 id="backstage-grid-title">Choose the tool that matches the job.</h2>
          </div>
          <p>Validation walls, diagnostics and data-management controls stay available here.</p>
        </div>

        <div className="backstage-grid__cards">
          {backstageRoutes.map((route) => (
            <a key={route.href} className="backstage-card" href={route.href}>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <span>Open</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
