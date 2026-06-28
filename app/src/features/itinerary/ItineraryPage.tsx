import { LocalDataState } from "../../components/states/LocalDataState";
import { mapItinerary } from "../../data/viewModelMappers";
import { useSailingDashboard } from "../../hooks/useLocalData";
import { useMemo } from "react";
import { PortAtlasMap } from "../maps/PortAtlasMap";
import { getAtlasSummary } from "../maps/mapUtils";
import { buildAtlasCaption, buildVoyageAtlasPoints } from "../ports/portAtlasViewModel";
import { ItineraryLegend } from "./components/ItineraryLegend";
import { ItinerarySummaryPanel } from "./components/ItinerarySummaryPanel";
import { ItineraryTimeline } from "./components/ItineraryTimeline";
import "./ItineraryPage.css";

export function ItineraryPage() {
  const query = useSailingDashboard();
  const atlasPoints = useMemo(
    () => query.data ? buildVoyageAtlasPoints(query.data.itinerary) : [],
    [query.data],
  );
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const itinerary = mapItinerary(query.data);
  const atlasSummary = getAtlasSummary(atlasPoints);
  const selectedPointId = query.data.itinerary.find(({ day }) => day.dayType !== "sea")?.day.id;
  return (
    <div className="itinerary-page">
      <ItinerarySummaryPanel
        sailingName={itinerary.sailingName}
        summary={itinerary.summary}
      />
      <PortAtlasMap
        caption={buildAtlasCaption(atlasSummary.missingCount)}
        mode="route-strip"
        points={atlasPoints}
        selectedPointId={selectedPointId}
        title="Voyage map context"
      />
      <ItineraryLegend />
      <ItineraryTimeline days={itinerary.days} />
    </div>
  );
}
