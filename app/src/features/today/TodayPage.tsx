import { sampleTodayData } from "../../data/sampleTodayData";
import { ConfidenceNotes } from "./components/ConfidenceNotes";
import { SebDiscoveryPreview } from "./components/SebDiscoveryPreview";
import { TakeAshoreChecklist } from "./components/TakeAshoreChecklist";
import { TodayAshorePanel } from "./components/TodayAshorePanel";
import { TodayPlanSummary } from "./components/TodayPlanSummary";
import { WeatherTile } from "./components/WeatherTile";
import "./TodayPage.css";

export function TodayPage() {
  return (
    <div className="today-page">
      <TodayAshorePanel
        currentDay={sampleTodayData.currentDay}
        returnPlan={sampleTodayData.returnPlan}
      />

      <div className="today-page__primary">
        <WeatherTile weather={sampleTodayData.weather} />
        <TodayPlanSummary plans={sampleTodayData.plans} />
      </div>

      <div className="today-page__support">
        <TakeAshoreChecklist items={sampleTodayData.checklist} />
        <SebDiscoveryPreview
          local={sampleTodayData.local}
          sebDiscovery={sampleTodayData.sebDiscovery}
        />
      </div>

      <ConfidenceNotes notes={sampleTodayData.confidenceNotes} />
    </div>
  );
}
