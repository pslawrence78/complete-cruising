import { useState } from "react";
import { CardSurface } from "../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../components/status/ConfidenceChip";
import { StatusChip } from "../../components/status/StatusChip";
import { LocalDataState } from "../../components/states/LocalDataState";
import { useWeatherSnapshotReview } from "../../hooks/useLocalData";
import { buildWeatherSnapshotConflicts } from "./weatherSnapshotConflictService";
import { acknowledgeWeatherSnapshotConflict, selectPreferredWeatherSnapshot } from "./weatherSnapshotReviewService";
import "./WeatherSnapshotReviewPage.css";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function labelReviewState(value: "no_conflict" | "review_recommended" | "preferred_selected" | "stale_preferred") {
  switch (value) {
    case "stale_preferred":
      return { label: "Preferred snapshot is older", tone: "refresh" as const };
    case "preferred_selected":
      return { label: "Preferred snapshot selected", tone: "confirmed" as const };
    case "review_recommended":
      return { label: "Review recommended", tone: "review" as const };
    default:
      return { label: "No conflict", tone: "confirmed" as const };
  }
}

export function WeatherSnapshotReviewPage() {
  const query = useWeatherSnapshotReview();
  const [message, setMessage] = useState<string>();

  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;

  const conflicts = buildWeatherSnapshotConflicts({
    itineraryDays: query.data.itinerary.map(({ day, port }) => ({ day, port })),
    snapshots: query.data.weather ?? [],
    reviewEvents: query.data.weatherReviewEvents ?? [],
  });

  const unresolved = conflicts.filter((conflict) => conflict.candidateSnapshotIds.length > 1);

  return (
    <div className="weather-review-page">
      <CardSurface as="section" className="weather-review-page__hero" variant="glass">
        <p className="section-kicker">Weather snapshot review</p>
        <h1>Keep every snapshot. Choose the one you trust.</h1>
        <p>
          Complete Cruising now preserves competing weather snapshots side by side. A preferred snapshot can be selected
          without deleting the others, and every review action stays visible in the audit trail.
        </p>
        <div className="weather-review-page__hero-chips">
          <StatusChip label={`${unresolved.length} review ${unresolved.length === 1 ? "item" : "items"}`} tone={unresolved.length ? "review" : "confirmed"} />
          <StatusChip label={`${conflicts.length} days with snapshots`} tone="confirmed" />
        </div>
      </CardSurface>

      {message ? <p className="weather-review-page__message">{message}</p> : null}

      {!unresolved.length ? (
        <CardSurface as="section" className="weather-review-page__empty" variant="paper">
          <h2>No competing snapshots need review.</h2>
          <p>Preferred weather remains stable across the voyage. When a future manual refresh creates a competing snapshot, it will appear here with a calm comparison summary.</p>
        </CardSurface>
      ) : (
        <div className="weather-review-page__list">
          {unresolved.map((conflict) => {
            const state = labelReviewState(conflict.recommendedReviewState);
            return (
              <CardSurface as="section" className="weather-review-card" key={conflict.itineraryDayId} variant="paper">
                <div className="weather-review-card__header">
                  <div>
                    <p className="section-kicker">{conflict.dayType === "sea" || conflict.dayType === "scenic_cruising" ? "Sea-day context" : "Itinerary day"}</p>
                    <h2>{conflict.dayTitle}</h2>
                    <p>{formatDate(conflict.forecastDate)}</p>
                  </div>
                  <StatusChip label={state.label} tone={state.tone} />
                </div>

                <div className="weather-review-card__meta">
                  <span>{conflict.portName ?? "No port label for this day"}</span>
                  <span>{conflict.candidateSnapshotIds.length} stored snapshots</span>
                </div>

                <div className="weather-review-card__snapshots">
                  {[conflict.preferredSnapshot, ...conflict.competingSnapshots].filter(Boolean).map((snapshot) => (
                    <article className="weather-review-snapshot" key={snapshot!.id} data-preferred={snapshot!.id === conflict.preferredSnapshotId}>
                      <header>
                        <strong>{snapshot!.id === conflict.preferredSnapshotId ? "Preferred snapshot" : "Competing snapshot"}</strong>
                        <StatusChip
                          label={(snapshot!.weatherContext ?? "weather_context").replaceAll("_", " ")}
                          tone={snapshot!.id === conflict.preferredSnapshotId ? "confirmed" : "review"}
                        />
                      </header>
                      <p>{snapshot!.conditionSummary}</p>
                      <div className="weather-review-snapshot__chips">
                        <ConfidenceChip label={snapshot!.confidence.confidence} level={snapshot!.confidence.confidence} />
                        <StatusChip label={snapshot!.confidence.reviewStatus.replaceAll("_", " ")} tone={snapshot!.confidence.reviewStatus === "reviewed" || snapshot!.confidence.reviewStatus === "verified" ? "confirmed" : "review"} />
                        <StatusChip label={snapshot!.refreshState} tone={snapshot!.refreshState === "updated" ? "confirmed" : "refresh"} />
                      </div>
                      <dl>
                        <div><dt>Source</dt><dd>{snapshot!.sourceName}</dd></div>
                        <div><dt>Captured</dt><dd>{formatTimestamp(snapshot!.capturedAt)}</dd></div>
                        <div><dt>High / low</dt><dd>{snapshot!.temperatureHighC ?? "?"}C / {snapshot!.temperatureLowC ?? "?"}C</dd></div>
                        <div><dt>Rain</dt><dd>{snapshot!.precipitationChance ?? "?"}%</dd></div>
                        <div><dt>Wind</dt><dd>{snapshot!.windSpeedKph ?? "?"} km/h</dd></div>
                      </dl>
                      {snapshot!.id !== conflict.preferredSnapshotId ? (
                        <button
                          className="weather-review-snapshot__action"
                          type="button"
                          onClick={async () => {
                            await selectPreferredWeatherSnapshot({
                              itineraryDayId: conflict.itineraryDayId,
                              snapshotId: snapshot!.id,
                              reason: "User selected a preferred weather snapshot after comparison.",
                            });
                            setMessage(`Preferred weather updated for ${conflict.dayTitle}.`);
                          }}
                        >
                          Select as preferred
                        </button>
                      ) : null}
                    </article>
                  ))}
                </div>

                <div className="weather-review-card__differences">
                  <h3>Material differences</h3>
                  {!conflict.materialDifferences.length ? (
                    <p>No material change was detected beyond timing and storage history.</p>
                  ) : (
                    <ul>
                      {conflict.materialDifferences.map((difference, index) => (
                        <li key={`${conflict.itineraryDayId}-${difference.field}-${index}`}>{difference.explanation}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="weather-review-card__footer">
                  <button
                    className="weather-review-card__acknowledge"
                    type="button"
                    onClick={async () => {
                      await acknowledgeWeatherSnapshotConflict({
                        itineraryDayId: conflict.itineraryDayId,
                        snapshotIds: conflict.candidateSnapshotIds,
                        reason: "User acknowledged the weather conflict without changing the preferred snapshot.",
                      });
                      setMessage(`Conflict acknowledged for ${conflict.dayTitle}.`);
                    }}
                  >
                    Acknowledge without changing preferred
                  </button>
                </div>

                <div className="weather-review-card__audit">
                  <h3>Audit trail</h3>
                  {!conflict.reviewEvents.length ? (
                    <p>No review actions have been recorded yet.</p>
                  ) : (
                    <ul>
                      {conflict.reviewEvents.map((event) => (
                        <li key={event.id}>
                          {event.action.replaceAll("_", " ")} on {formatTimestamp(event.createdAt)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardSurface>
            );
          })}
        </div>
      )}
    </div>
  );
}
