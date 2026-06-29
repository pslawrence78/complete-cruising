import { useState } from "react";
import { LocalDataState } from "../../components/states/LocalDataState";
import { mapItinerary } from "../../data/viewModelMappers";
import { useSailingDashboard } from "../../hooks/useLocalData";
import { refreshCruiseWeatherForSailing } from "../weather/weatherRefreshService";
import { useMemo } from "react";
import { PortAtlasMap } from "../maps/PortAtlasMap";
import { getAtlasSummary } from "../maps/mapUtils";
import { buildAtlasCaption, buildVoyageAtlasPoints } from "../ports/portAtlasViewModel";
import type { WeatherButtonState } from "../weather/weatherTypes";
import { ItineraryLegend } from "./components/ItineraryLegend";
import { ItinerarySummaryPanel } from "./components/ItinerarySummaryPanel";
import { ItineraryTimeline } from "./components/ItineraryTimeline";
import "./ItineraryPage.css";

export function ItineraryPage() {
  const query = useSailingDashboard();
  const [buttonStates, setButtonStates] = useState<Record<string, WeatherButtonState>>({});
  const [weatherMessage, setWeatherMessage] = useState<string | undefined>();
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
  const handleRefreshWeather = async (dayId: string) => {
    setWeatherMessage(undefined);
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setButtonStates((current) => ({ ...current, [dayId]: "offline" }));
      setWeatherMessage("Weather refresh needs a connection. Your existing local weather context has been preserved.");
      return;
    }
    setButtonStates((current) => ({ ...current, [dayId]: "refreshing" }));
    const result = await refreshCruiseWeatherForSailing(query.data!.sailing.id, undefined, {
      itineraryDayId: dayId,
    });
    setWeatherMessage(result.message);
    setButtonStates((current) => ({ ...current, [dayId]: result.buttonState }));
  };
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
      <ItineraryTimeline
        buttonStates={buttonStates}
        days={itinerary.days}
        onRefreshWeather={handleRefreshWeather}
      />
      {weatherMessage ? <p className="itinerary-page__weather-message">{weatherMessage}</p> : null}
    </div>
  );
}
