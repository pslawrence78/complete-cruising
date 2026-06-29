import type { ItineraryDay } from "../../../data/sampleItineraryData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";
import { ConditionBadge } from "../../conditions/ConditionBadge";
import { toneFromSeverity } from "../../conditions/conditionViewModels";

interface ItineraryDayCardProps {
  day: ItineraryDay;
  onRefreshWeather?: (dayId: string) => void | Promise<void>;
  refreshing?: boolean;
}

const dayTypeLabels: Record<ItineraryDay["dayType"], string> = {
  embarkation: "Embarkation",
  port: "Port call",
  sea: "At sea",
  disembarkation: "Disembarkation",
};

export function ItineraryDayCard({ day, onRefreshWeather, refreshing }: ItineraryDayCardProps) {
  const hasTimes = Boolean(day.arrivalTime || day.departureTime || day.allAboardTime);
  const weather = day.weather;
  const readiness = day.readiness;

  return (
    <CardSurface
      as="article"
      className="itinerary-day-card"
      variant={day.dayType === "sea" ? "glass" : "paper"}
      data-accent={day.accent}
      data-day-type={day.dayType}
      aria-current={day.isHighlighted ? "step" : undefined}
    >
      {day.isHighlighted ? (
        <span className="itinerary-day-card__active">Next likely day</span>
      ) : null}
      <header className="itinerary-day-card__header">
        <span>Day {String(day.dayNumber).padStart(2, "0")}</span>
        <span>{dayTypeLabels[day.dayType]}</span>
      </header>

      <p className="itinerary-day-card__date">{day.dateLabel}</p>
      <h3>{day.title}</h3>
      {day.country ? (
        <p className="itinerary-day-card__country">{day.country}</p>
      ) : null}

      {readiness ? (
        <div className="itinerary-day-card__conditions">
          <ConditionBadge readiness={readiness} />
          {readiness.badges.map((badge) => (
            <StatusChip
              key={badge}
              label={badge}
              tone={toneFromSeverity(readiness.severity)}
            />
          ))}
        </div>
      ) : null}

      {weather ? (
        <div className="itinerary-day-card__weather">
          <div className="itinerary-day-card__weather-line">
            <span>{weather.stateLabel}</span>
            <StatusChip label={weather.badgeLabel ?? weather.summary ?? weather.stateLabel ?? "Weather pending"} tone={weather.badgeTone ?? "review"} />
          </div>
          <p>{weather.summary}</p>
          <small>{weather.sourceLabel} - {weather.updatedLabel}</small>
        </div>
      ) : null}

      {day.dayType === "port" ? (
        hasTimes ? (
          <dl className="itinerary-day-card__times">
            {day.arrivalTime ? (
              <div>
                <dt>Arrive</dt>
                <dd>{day.arrivalTime}</dd>
              </div>
            ) : null}
            {day.departureTime ? (
              <div>
                <dt>Depart</dt>
                <dd>{day.departureTime}</dd>
              </div>
            ) : null}
            {day.allAboardTime ? (
              <div className="itinerary-day-card__all-aboard">
                <dt>All aboard</dt>
                <dd>{day.allAboardTime}</dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="itinerary-day-card__timing-pending">
            Times need review
          </p>
        )
      ) : null}

      <div className="itinerary-day-card__plan">
        <span>{day.dayType === "sea" ? "Onboard rhythm" : day.dayType === "port" ? "Port focus" : "Voyage focus"}</span>
        <p>{day.planSummary}</p>
      </div>

      {weather ? (
        <div className="itinerary-day-card__weather-guidance">
          <p>{weather.comfortSummary}</p>
          <p>{weather.clothingGuidance}</p>
          <p>{weather.planImpact}</p>
        </div>
      ) : null}

      <p className="itinerary-day-card__enrichment">
        <span>Enrichment</span>
        <strong>{day.enrichmentStatus}</strong>
      </p>

      <div className="itinerary-day-card__metadata">
        <ConfidenceChip
          label={day.confidence.label}
          level={day.confidence.level}
        />
        <StatusChip
          label={day.reviewStatus.label}
          tone={day.reviewStatus.tone}
        />
        <StatusChip
          label={day.refreshStatus.label}
          tone={day.refreshStatus.tone}
        />
        {weather && onRefreshWeather && weather.canRefresh ? (
          <button
            className="itinerary-day-card__refresh"
            type="button"
            disabled={refreshing}
            onClick={() => onRefreshWeather(day.id)}
          >
            {refreshing ? "Refreshing" : weather.refreshLabel ?? "Refresh weather"}
          </button>
        ) : null}
      </div>
    </CardSurface>
  );
}
