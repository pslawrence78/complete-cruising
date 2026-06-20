import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

const dayTypes = [
  ["embarkation", "Embarkation"],
  ["port", "Port day"],
  ["sea", "Sea day"],
  ["disembarkation", "Disembarkation"],
] as const;

export function ItineraryLegend() {
  return (
    <aside className="itinerary-legend" aria-labelledby="itinerary-legend-title">
      <div>
        <p className="section-kicker">Reading the route</p>
        <h2 id="itinerary-legend-title">Day and trust language</h2>
      </div>
      <ul className="itinerary-legend__types" aria-label="Itinerary day types">
        {dayTypes.map(([type, label]) => (
          <li key={type}>
            <span className="itinerary-legend__marker" data-day-type={type} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
      <div className="itinerary-legend__chips" aria-label="Itinerary metadata legend">
        <StatusChip label="Needs review" tone="review" />
        <StatusChip label="Refresh recommended" tone="refresh" />
        <ConfidenceChip level="medium" />
      </div>
    </aside>
  );
}
