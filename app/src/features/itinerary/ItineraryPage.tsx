import { sampleItineraryData } from "../../data/sampleItineraryData";
import { ItineraryLegend } from "./components/ItineraryLegend";
import { ItinerarySummaryPanel } from "./components/ItinerarySummaryPanel";
import { ItineraryTimeline } from "./components/ItineraryTimeline";
import "./ItineraryPage.css";

export function ItineraryPage() {
  return (
    <div className="itinerary-page">
      <ItinerarySummaryPanel
        sailingName={sampleItineraryData.sailingName}
        summary={sampleItineraryData.summary}
      />
      <ItineraryLegend />
      <ItineraryTimeline days={sampleItineraryData.days} />
    </div>
  );
}
