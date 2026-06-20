import { LocalDataState } from "../../components/states/LocalDataState";
import { mapItinerary } from "../../data/viewModelMappers";
import { useSailingDashboard } from "../../hooks/useLocalData";
import { ItineraryLegend } from "./components/ItineraryLegend";
import { ItinerarySummaryPanel } from "./components/ItinerarySummaryPanel";
import { ItineraryTimeline } from "./components/ItineraryTimeline";
import "./ItineraryPage.css";

export function ItineraryPage() {
  const query = useSailingDashboard();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const itinerary = mapItinerary(query.data);
  return (
    <div className="itinerary-page">
      <ItinerarySummaryPanel
        sailingName={itinerary.sailingName}
        summary={itinerary.summary}
      />
      <ItineraryLegend />
      <ItineraryTimeline days={itinerary.days} />
    </div>
  );
}
