import { sampleShipData } from "../../data/sampleShipData";
import { EnrichmentStatusPanel } from "./components/EnrichmentStatusPanel";
import { ShipFactsPanel } from "./components/ShipFactsPanel";
import { ShipGuideCard } from "./components/ShipGuideCard";
import { ShipHero } from "./components/ShipHero";
import "./ShipPage.css";

export function ShipPage() {
  return (
    <div className="ship-page">
      <ShipHero hero={sampleShipData.hero} metadata={sampleShipData.metadata} />

      <div className="ship-page__overview">
        <ShipFactsPanel facts={sampleShipData.facts} />
        <EnrichmentStatusPanel
          enrichment={sampleShipData.enrichment}
          metadata={sampleShipData.metadata}
        />
      </div>

      <section className="ship-guide" aria-labelledby="ship-guide-title">
        <div className="ship-guide__heading">
          <div>
            <p className="section-kicker">The Lawrence family edition</p>
            <h2 id="ship-guide-title">Read the ship, not just the deck plan.</h2>
          </div>
          <p>
            Seven concise guidebook chapters turn scale into bearings, choices
            and a calmer first day aboard.
          </p>
        </div>

        <div className="ship-guide__grid">
          {sampleShipData.sections.map((section) => (
            <ShipGuideCard key={section.id} section={section} />
          ))}
        </div>
      </section>

      <p className="ship-page__caveat">
        <span aria-hidden="true">i</span>
        {sampleShipData.caveat}
      </p>
    </div>
  );
}
