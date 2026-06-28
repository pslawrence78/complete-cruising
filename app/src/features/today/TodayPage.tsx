import { LocalDataState } from "../../components/states/LocalDataState";
import { mapToday } from "../../data/viewModelMappers";
import { useTodayGuide } from "../../hooks/useLocalData";
import { CruiseMapCard } from "../maps/CruiseMapCard";
import { mapProviderConfig } from "../maps/mapConfig";
import { PortAtlasFallback } from "../maps/PortAtlasFallback";
import { PortAtlasMap } from "../maps/PortAtlasMap";
import { atlasPointFromPort, buildPortFallbackMetadata } from "../ports/portAtlasViewModel";
import { ConfidenceNotes } from "./components/ConfidenceNotes";
import { SebDiscoveryPreview } from "./components/SebDiscoveryPreview";
import { TakeAshoreChecklist } from "./components/TakeAshoreChecklist";
import { TodayAshorePanel } from "./components/TodayAshorePanel";
import { TodayPlanSummary } from "./components/TodayPlanSummary";
import { WeatherTile } from "./components/WeatherTile";
import "./TodayPage.css";

export function TodayPage() {
  const query = useTodayGuide();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const today = mapToday(query.data);
  if (!today) return <LocalDataState kind="empty" detail="The active sailing has no selected Today itinerary day." />;
  const todayAtlasPoint = "day" in query.data && query.data.day && query.data.port ? [atlasPointFromPort(query.data.port, query.data.day)] : [];
  const todayFallback = "port" in query.data ? buildPortFallbackMetadata(query.data.port, query.data.country) : undefined;
  return (
    <div className="today-page">
      <TodayAshorePanel
        currentDay={today.currentDay}
        mode={today.mode}
        nextStep={today.nextStep}
        returnPlan={today.returnPlan}
      />

      <div className="today-page__primary">
        <WeatherTile weather={today.weather} />
        <TodayPlanSummary plans={today.plans} />
      </div>

      {today.mode === "pre-cruise" ? (
        <CruiseMapCard
          attribution={<span>{mapProviderConfig.attributionLabel}</span>}
          caption="Today's port orientation will appear here when the sailing is active."
          className="today-atlas-placeholder"
          title="Today's port orientation"
        >
          <PortAtlasFallback
            metadata={todayFallback}
            title={today.currentDay.port}
          />
        </CruiseMapCard>
      ) : (
        <PortAtlasMap
          caption="Approximate port area for orientation only."
          fallbackMetadata={todayFallback}
          mode="single-port"
          points={todayAtlasPoint}
          selectedPointId={todayAtlasPoint[0]?.id}
          title="Today's port orientation"
        />
      )}

      <div className="today-page__support">
        <TakeAshoreChecklist items={today.checklist} />
        <SebDiscoveryPreview
          local={today.local}
          sebDiscovery={today.sebDiscovery}
        />
      </div>

      <ConfidenceNotes notes={today.confidenceNotes} />
    </div>
  );
}
