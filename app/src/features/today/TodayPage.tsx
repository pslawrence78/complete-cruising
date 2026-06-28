import { LocalDataState } from "../../components/states/LocalDataState";
import { mapToday } from "../../data/viewModelMappers";
import { useTodayGuide } from "../../hooks/useLocalData";
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
