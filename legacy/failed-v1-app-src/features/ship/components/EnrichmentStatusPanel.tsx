import type { ShipGuideData } from "../../../data/sampleShipData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface EnrichmentStatusPanelProps {
  enrichment: ShipGuideData["enrichment"];
  metadata: ShipGuideData["metadata"];
}

export function EnrichmentStatusPanel({ enrichment, metadata }: EnrichmentStatusPanelProps) {
  const progress = `${enrichment.completed} / ${enrichment.total}`;

  return (
    <CardSurface as="section" className="ship-enrichment" variant="glass" aria-labelledby="ship-enrichment-title">
      <div className="ship-enrichment__heading">
        <div>
          <p className="section-kicker">Guide readiness</p>
          <h2 id="ship-enrichment-title">Enrichment status</h2>
        </div>
        <strong aria-label={`${enrichment.completed} of ${enrichment.total} sections reviewed`}>{progress}</strong>
      </div>

      <div className="ship-enrichment__bar" aria-hidden="true">
        <span style={{ width: `${(enrichment.completed / enrichment.total) * 100}%` }} />
      </div>
      <p>{enrichment.summary}</p>
      <div className="ship-enrichment__priority">
        <span>Next priority</span>
        <strong>{enrichment.nextPriority}</strong>
      </div>
      <div className="ship-enrichment__metadata">
        <StatusChip label={metadata.refreshStatus} tone="refresh" />
        <ConfidenceChip level={metadata.confidence} />
        <span>{metadata.lastReviewed}</span>
      </div>
    </CardSurface>
  );
}
