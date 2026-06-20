import type { ItineraryData } from "../../../data/sampleItineraryData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";
import { RouteMotif } from "../../../components/visual/RouteMotif";

interface ItinerarySummaryPanelProps {
  sailingName: string;
  summary: ItineraryData["summary"];
}

export function ItinerarySummaryPanel({
  sailingName,
  summary,
}: ItinerarySummaryPanelProps) {
  return (
    <CardSurface
      as="section"
      className="itinerary-summary"
      variant="glass"
      aria-labelledby="itinerary-title"
    >
      <RouteMotif className="itinerary-summary__route" />
      <div className="itinerary-summary__copy">
        <p className="eyebrow">Illustrative itinerary · August 2026</p>
        <p className="itinerary-summary__sailing">{sailingName}</p>
        <h1 id="itinerary-title">
          Fifteen days. <em>One Mediterranean story.</em>
        </h1>
        <p>
          A route-led view of every port day, sea day and bookend—designed for
          calm planning now and operational clarity later.
        </p>
        <StatusChip label="Sample route" tone="review" />
      </div>

      <div className="itinerary-summary__details">
        <dl className="itinerary-summary__metrics">
          <div>
            <dt>Days</dt>
            <dd>{summary.days}</dd>
          </div>
          <div>
            <dt>Nights</dt>
            <dd>{summary.nights}</dd>
          </div>
          <div>
            <dt>Ports</dt>
            <dd>{summary.ports}</dd>
          </div>
          <div>
            <dt>Sea days</dt>
            <dd>{summary.seaDays}</dd>
          </div>
        </dl>

        <div className="itinerary-summary__bookends">
          <div>
            <span>Embarkation</span>
            <strong>{summary.embarkation}</strong>
          </div>
          <span className="itinerary-summary__journey" aria-hidden="true" />
          <div>
            <span>Disembarkation</span>
            <strong>{summary.disembarkation}</strong>
          </div>
        </div>
      </div>
    </CardSurface>
  );
}
