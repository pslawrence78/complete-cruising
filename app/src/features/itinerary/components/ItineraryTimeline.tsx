import type { ItineraryDay } from "../../../data/sampleItineraryData";
import { ItineraryDayCard } from "./ItineraryDayCard";

interface ItineraryTimelineProps {
  days: readonly ItineraryDay[];
  onRefreshWeather?: (dayId: string) => void | Promise<void>;
  refreshingDayId?: string;
}

export function ItineraryTimeline({ days, onRefreshWeather, refreshingDayId }: ItineraryTimelineProps) {
  return (
    <section className="itinerary-timeline" aria-labelledby="itinerary-timeline-title">
      <div className="itinerary-section-heading">
        <div>
          <p className="section-kicker">Day-by-day voyage</p>
          <h2 id="itinerary-timeline-title">The sailing as a route, not a list.</h2>
        </div>
        <p>
          Scroll the Mediterranean route on larger screens. On mobile, the
          same journey settles into a clean vertical timeline.
        </p>
      </div>

      <div
        className="itinerary-timeline__viewport"
        role="region"
        aria-label="Scrollable day-by-day itinerary"
        tabIndex={0}
      >
        <ol className="itinerary-timeline__track">
          {days.map((day) => (
            <li
              className="itinerary-timeline__day"
              data-day-type={day.dayType}
              key={day.id}
            >
              <span className="itinerary-timeline__node" aria-hidden="true" />
              <ItineraryDayCard
                day={day}
                onRefreshWeather={onRefreshWeather}
                refreshing={refreshingDayId === day.id}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
