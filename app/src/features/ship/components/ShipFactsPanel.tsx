import type { ShipGuideData } from "../../../data/sampleShipData";
import { CardSurface } from "../../../components/surfaces/CardSurface";

interface ShipFactsPanelProps {
  facts: ShipGuideData["facts"];
}

export function ShipFactsPanel({ facts }: ShipFactsPanelProps) {
  return (
    <CardSurface as="section" className="ship-facts" variant="paper" aria-labelledby="ship-facts-title">
      <div className="ship-facts__heading">
        <div>
          <p className="paper-kicker">Ship at a glance</p>
          <h2 id="ship-facts-title">A useful first bearing</h2>
        </div>
        <span className="ship-facts__compass" aria-hidden="true">N</span>
      </div>

      <dl className="ship-facts__list">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="ship-facts__note">A concise illustrative profile, ready for verified detail later.</p>
    </CardSurface>
  );
}
