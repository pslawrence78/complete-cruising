import type { ItineraryDay } from "../../../data/sampleItineraryData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface ItineraryDayCardProps {
  day: ItineraryDay;
}

const dayTypeLabels: Record<ItineraryDay["dayType"], string> = {
  embarkation: "Embarkation",
  port: "Port call",
  sea: "At sea",
  disembarkation: "Disembarkation",
};

export function ItineraryDayCard({ day }: ItineraryDayCardProps) {
  const hasTimes = Boolean(
    day.arrivalTime || day.departureTime || day.allAboardTime,
  );

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
      </div>
    </CardSurface>
  );
}
