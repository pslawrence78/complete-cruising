import { LocalDataState } from "../../components/states/LocalDataState";
import { mapShipGuide } from "../../data/viewModelMappers";
import { useShipGuide } from "../../hooks/useLocalData";
import { EnrichmentStatusPanel } from "./components/EnrichmentStatusPanel";
import { ShipFactsPanel } from "./components/ShipFactsPanel";
import { ShipGuideCard } from "./components/ShipGuideCard";
import { ShipHero } from "./components/ShipHero";
import "./ShipPage.css";

export function ShipPage() {
  const query = useShipGuide();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const ship = mapShipGuide(query.data);
  if (!ship) return <LocalDataState kind="empty" detail="The active sailing does not have a local ship guide yet." />;
  return (
    <div className="ship-page">
      <ShipHero hero={ship.hero} metadata={ship.metadata} />

      <div className="ship-page__overview">
        <ShipFactsPanel facts={ship.facts} />
        <EnrichmentStatusPanel
          enrichment={ship.enrichment}
          metadata={ship.metadata}
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
          {ship.sections.map((section) => (
            <ShipGuideCard key={section.id} section={section} />
          ))}
        </div>
      </section>

      <p className="ship-page__caveat">
        <span aria-hidden="true">i</span>
        {ship.caveat}
      </p>
    </div>
  );
}
