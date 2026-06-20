import type { ShipGuideData } from "../../../data/sampleShipData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface ShipHeroProps {
  hero: ShipGuideData["hero"];
  metadata: ShipGuideData["metadata"];
}

function ShipProfile() {
  return (
    <svg className="ship-hero__profile" viewBox="0 0 920 330" aria-hidden="true">
      <path className="ship-hero__hull" d="M42 230h735c37 0 68-22 87-61l22-47h-106l-25 53H208l-45-78H92l27 78H25Z" />
      <path d="M222 171h438l28-66H183Z" opacity=".7" />
      <path d="M286 119h279l-36-58H329Z" opacity=".48" />
      <path className="ship-hero__wake" d="M34 280c118 25 202 28 307 4 117-27 194-29 307-3 95 22 164 25 238 3" />
      <g className="ship-hero__windows">
        <path d="M267 147h329" />
        <path d="M342 91h154" />
      </g>
    </svg>
  );
}

export function ShipHero({ hero, metadata }: ShipHeroProps) {
  return (
    <CardSurface as="section" className="ship-hero" variant="glass" aria-labelledby="ship-title">
      <div className="ship-hero__deck-lines" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <ShipProfile />

      <div className="ship-hero__content">
        <div className="ship-hero__identity">
          <p className="eyebrow">{hero.guideLabel}</p>
          <p className="ship-hero__lineage">{hero.cruiseLine}</p>
          <h1 id="ship-title">{hero.name}</h1>
          <p className="ship-hero__character">{hero.character}</p>
        </div>

        <aside className="ship-hero__edition" aria-label="Ship guide trust summary">
          <p>Personal edition</p>
          <strong>Ship intelligence</strong>
          <span>{metadata.recordScope}</span>
          <div className="ship-hero__metadata">
            <StatusChip label={metadata.reviewStatus} tone="review" />
            <ConfidenceChip level={metadata.confidence} />
          </div>
        </aside>
      </div>
    </CardSurface>
  );
}
