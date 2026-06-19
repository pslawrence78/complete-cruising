import { AppShell } from "./components/layout/AppShell";
import { CardSurface } from "./components/surfaces/CardSurface";
import { ConfidenceChip } from "./components/status/ConfidenceChip";
import { StatusChip } from "./components/status/StatusChip";
import { RouteMotif } from "./components/visual/RouteMotif";
import { scaffoldSampleData } from "./data/sampleData";
import { routeConfig } from "./routes/routeConfig";

function App() {
  return (
    <AppShell activeRouteId="dashboard" routes={routeConfig}>
      <section className="shell-landing" aria-labelledby="shell-title">
        <CardSurface as="div" className="shell-hero" variant="glass">
          <RouteMotif className="shell-hero__route" />

          <div className="shell-hero__copy">
            <p className="eyebrow">Ocean Luxe foundation · Tranche 2</p>
            <h1 id="shell-title">
              App shell <em>ready.</em>
            </h1>
            <p className="shell-hero__lede">
              A composed, oceanic frame for every port, plan and possibility.
              The visual system is in place; the voyage experience arrives in
              focused tranches from here.
            </p>

            <div className="chip-group" aria-label="Shell status">
              <StatusChip label="Shell ready" tone="confirmed" />
              <ConfidenceChip label="Visual direction established" level="high" />
            </div>

            <a className="quiet-action" href="#visual-system">
              Explore the visual foundation
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <CardSurface as="aside" className="sailing-card" variant="paper">
            <div className="sailing-card__compass" aria-hidden="true">N</div>
            <p className="paper-kicker">Active sailing placeholder</p>
            <h2>{scaffoldSampleData.activeSailing}</h2>
            <p>
              The shell is ready to hold trusted voyage intelligence without
              pretending that production sailing details exist yet.
            </p>
            <dl className="sailing-card__facts">
              <div>
                <dt>Current status</dt>
                <dd>{scaffoldSampleData.status}</dd>
              </div>
              <div>
                <dt>Next tranche</dt>
                <dd>{scaffoldSampleData.nextTranche}</dd>
              </div>
            </dl>
            <StatusChip label="Illustrative only" tone="review" />
          </CardSurface>
        </CardSurface>

        <section
          id="visual-system"
          className="visual-system"
          aria-labelledby="visual-system-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">Ocean Luxe visual system</p>
              <h2 id="visual-system-title">A premium frame, kept practical.</h2>
            </div>
            <p>
              Glass carries navigation and live context. Warm paper brings
              guidebook character. Trust states stay legible and calm.
            </p>
          </div>

          <div className="foundation-grid">
            <CardSurface as="article" className="foundation-card" variant="paper">
              <p className="paper-kicker">Surface language</p>
              <h3>Guidebook warmth</h3>
              <p>
                Editorial typography, soft sand and subtle chart lines keep
                future port stories tactile rather than administrative.
              </p>
              <div className="surface-swatch" aria-hidden="true">
                <span>Glass</span>
                <span>Paper</span>
                <span>Ocean</span>
              </div>
            </CardSurface>

            <CardSurface as="article" className="foundation-card" variant="glass">
              <p className="section-kicker">Trust language</p>
              <h3>Status without the spreadsheet.</h3>
              <p>
                Labels and symbols carry meaning alongside colour, preserving
                confidence and refresh states without crowding the experience.
              </p>
              <div className="chip-showcase" aria-label="Sample status and confidence states">
                <StatusChip label="Reviewed" tone="confirmed" />
                <StatusChip label="Needs review" tone="review" />
                <StatusChip label="Needs refresh" tone="refresh" />
                <ConfidenceChip level="high" />
                <ConfidenceChip level="medium" />
              </div>
            </CardSurface>
          </div>
        </section>
      </section>
    </AppShell>
  );
}

export default App;
