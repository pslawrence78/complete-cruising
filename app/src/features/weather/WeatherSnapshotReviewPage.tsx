import { useState } from "react";
import { CardSurface } from "../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../components/status/ConfidenceChip";
import { StatusChip, type StatusTone } from "../../components/status/StatusChip";
import { LocalDataState } from "../../components/states/LocalDataState";
import { useWeatherSnapshotReview } from "../../hooks/useLocalData";
import type { WeatherSnapshot, WeatherSnapshotReviewEvent } from "../../types";
import { buildWeatherSnapshotConflicts } from "./weatherSnapshotConflictService";
import { loadWeatherReviewDemo, restoreWeatherReviewCalmState } from "./weatherReviewDemoService";
import { acknowledgeWeatherSnapshotConflict, describeSnapshotTiming, selectPreferredWeatherSnapshot } from "./weatherSnapshotReviewService";
import type { WeatherSnapshotConflict } from "./weatherSnapshotReviewTypes";
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

function labelReviewState(value: WeatherSnapshotConflict["recommendedReviewState"]) {
  switch (value) {
    case "stale_preferred":
      return { label: "Needs review", tone: "refresh" as const };
    case "preferred_selected":
      return { label: "Resolved", tone: "confirmed" as const };
    case "review_recommended":
      return { label: "Needs review", tone: "review" as const };
    default:
      return { label: "Stable snapshot", tone: "confirmed" as const };
  }
}

function labelDayType(dayType: WeatherSnapshotConflict["dayType"]) {
  switch (dayType) {
    case "embarkation":
      return "Embarkation";
    case "disembarkation":
      return "Disembarkation";
    case "overnight_port":
      return "Overnight port day";
    case "scenic_cruising":
      return "Scenic cruising";
    case "sea":
      return "Sea day";
    default:
      return "Port day";
  }
}

function labelSnapshotContext(snapshot?: WeatherSnapshot, dayType?: WeatherSnapshotConflict["dayType"]) {
  if (!snapshot) return "Snapshot context not recorded";
  if (dayType === "sea" || dayType === "scenic_cruising") return "Sea-day weather";
  switch (snapshot.weatherContext) {
    case "visit_date_forecast":
      return "Visit-date forecast";
    case "same_day_check":
      return "Same-day check";
    case "weather_now_in_port":
      return "Weather now in port";
    case "climate_context":
      return "Climate context";
    case "observed":
      return "Observed weather";
    default:
      return "Weather snapshot";
  }
}

function labelSnapshotType(snapshot?: WeatherSnapshot) {
  if (!snapshot) return "Snapshot type not recorded";
  switch (snapshot.snapshotType) {
    case "observed":
      return "Observed snapshot";
    case "climate":
      return "Climate snapshot";
    default:
      return "Forecast snapshot";
  }
}

function describeWeatherAppliesTo(snapshot: WeatherSnapshot, conflict: WeatherSnapshotConflict) {
  if (conflict.dayType === "sea" || conflict.dayType === "scenic_cruising") {
    return `Sea-day guidance for ${formatDate(conflict.itineraryDate)}`;
  }
  if (snapshot.weatherContext === "weather_now_in_port") {
    return `Port conditions captured on ${formatDate(snapshot.date)}`;
  }
  return `Visit date ${formatDate(snapshot.forecastDate ?? snapshot.date)}`;
}

function getSurfaceImpactCopy(conflict: WeatherSnapshotConflict) {
  if (conflict.dayType === "sea" || conflict.dayType === "scenic_cruising") {
    return "Sea and scenic-cruising days keep neutral weather wording and are never presented as weather now in port.";
  }
  return "Used by Today, Itinerary, Dashboard and Ports once the preferred snapshot is clear.";
}

function getContextReason(conflict: WeatherSnapshotConflict) {
  const contextLabels = new Set(
    [conflict.preferredSnapshot, ...conflict.competingSnapshots]
      .filter((snapshot): snapshot is WeatherSnapshot => Boolean(snapshot))
      .map((snapshot) => labelSnapshotContext(snapshot, conflict.dayType)),
  );
  if (contextLabels.has("Visit-date forecast") && contextLabels.has("Same-day check")) {
    return "A visit-date forecast and a later same-day check are both stored for this itinerary day.";
  }
  if (contextLabels.has("Visit-date forecast") && contextLabels.has("Weather now in port")) {
    return "A visit-date forecast is being compared with weather now in port for the same day.";
  }
  if (contextLabels.has("Weather now in port")) {
    return "The stored snapshot uses current port context rather than a direct visit-date forecast.";
  }
  return "Competing snapshots remain preserved so the family can review how the weather story changed.";
}

function getCardSummary(conflict: WeatherSnapshotConflict) {
  if (conflict.dayType === "sea" || conflict.dayType === "scenic_cruising") {
    return {
      title: "Sea-day guardrail",
      body: "Sea and scenic-cruising days stay neutral. Even when an illustrative weather snapshot is stored, the page does not push port-weather wording or a port-specific review choice.",
    };
  }
  if (conflict.candidateSnapshotIds.length === 1) {
    return {
      title: "Only one snapshot is stored",
      body: "No review decision is needed. This day has one current weather snapshot, so the app can keep using it until another snapshot is added later.",
    };
  }
  if (conflict.recommendedReviewState === "preferred_selected") {
    return {
      title: "Resolved",
      body: "This day now uses the selected preferred snapshot while preserving the other snapshots for audit and comparison.",
    };
  }
  return {
    title: "Why this needs review",
    body: "This day has more than one weather snapshot that could be used for the visit date. Choose the snapshot that should drive Today, Itinerary, Dashboard and Ports weather copy. The other snapshots will be kept for history.",
  };
}

function getSnapshotStatus(snapshot: WeatherSnapshot, conflict: WeatherSnapshotConflict) {
  if (snapshot.id === conflict.preferredSnapshotId) return { label: "Current preferred", tone: "confirmed" as const };
  if (conflict.candidateSnapshotIds.length === 1) return { label: "Only available snapshot", tone: "confirmed" as const };
  if (conflict.recommendedReviewState === "preferred_selected") return { label: "Preserved for history", tone: "review" as const };
  return { label: "Competing snapshot", tone: "review" as const };
}

function labelAuditAction(action: WeatherSnapshotReviewEvent["action"]) {
  switch (action) {
    case "preferred_snapshot_selected":
      return "Preferred snapshot selected";
    case "preferred_snapshot_restored":
      return "Preferred snapshot restored";
    case "snapshot_rejected":
      return "Snapshot rejected";
    default:
      return "Conflict acknowledged";
  }
}

function describeAuditSnapshot(snapshotId: string | undefined, snapshotById: Map<string, WeatherSnapshot>, conflict: WeatherSnapshotConflict) {
  if (!snapshotId) return "No previous preferred snapshot was recorded.";
  const snapshot = snapshotById.get(snapshotId);
  if (!snapshot) return `Snapshot ${snapshotId}`;
  return `${labelSnapshotContext(snapshot, conflict.dayType)}, refreshed ${formatTimestamp(describeSnapshotTiming(snapshot))}`;
}

function ReviewAuditTrail({ conflict }: { conflict: WeatherSnapshotConflict }) {
  if (!conflict.reviewEvents.length && conflict.candidateSnapshotIds.length <= 1) return null;

  const snapshotById = new Map(
    [conflict.preferredSnapshot, ...conflict.competingSnapshots]
      .filter((snapshot): snapshot is WeatherSnapshot => Boolean(snapshot))
      .map((snapshot) => [snapshot.id, snapshot]),
  );
  const reviewEvents = [...conflict.reviewEvents].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return (
    <div className="weather-review-card__audit">
      <h3>Audit trail</h3>
      {!reviewEvents.length ? (
        <p>No review actions have been recorded yet.</p>
      ) : (
        <div className="weather-review-audit-list">
          {reviewEvents.map((event) => (
            <article className="weather-review-audit-item" key={event.id}>
              <div className="weather-review-audit-item__header">
                <strong>{labelAuditAction(event.action)}</strong>
                <span>{formatTimestamp(event.createdAt)}</span>
              </div>
              <p>{`${conflict.dayTitle}, Day ${conflict.dayNumber}`}</p>
              {event.toSnapshotId ? <p>{`Selected: ${describeAuditSnapshot(event.toSnapshotId, snapshotById, conflict)}`}</p> : null}
              {event.fromSnapshotId && event.fromSnapshotId !== event.toSnapshotId ? <p>{`Previous: ${describeAuditSnapshot(event.fromSnapshotId, snapshotById, conflict)}`}</p> : null}
              {event.reason ? <p>{`Reason: ${event.reason}`}</p> : null}
              {event.notes ? <p>{`Note: ${event.notes}`}</p> : null}
              {event.candidateSnapshotIds.length > 1 ? <p>Other snapshots preserved for history.</p> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SnapshotCard({ conflict, snapshot, onSelected }: {
  conflict: WeatherSnapshotConflict;
  snapshot: WeatherSnapshot;
  onSelected: (snapshotId: string) => Promise<void>;
}) {
  const status = getSnapshotStatus(snapshot, conflict);
  const reviewTone: StatusTone = snapshot.confidence.reviewStatus === "reviewed" || snapshot.confidence.reviewStatus === "verified" ? "confirmed" : "review";
  const refreshTone: StatusTone = snapshot.refreshState === "updated" ? "confirmed" : "refresh";

  return (
    <article className="weather-review-snapshot" key={snapshot.id} data-preferred={snapshot.id === conflict.preferredSnapshotId}>
      <header>
        <div className="weather-review-snapshot__title">
          <strong>{labelSnapshotContext(snapshot, conflict.dayType)}</strong>
          <span>{labelSnapshotType(snapshot)}</span>
        </div>
        <StatusChip label={status.label} tone={status.tone} />
      </header>

      <p>{snapshot.conditionSummary}</p>

      <div className="weather-review-snapshot__chips">
        <ConfidenceChip label={snapshot.confidence.confidence} level={snapshot.confidence.confidence} />
        <StatusChip label={snapshot.confidence.reviewStatus.replaceAll("_", " ")} tone={reviewTone} />
        <StatusChip label={snapshot.refreshState.replaceAll("_", " ")} tone={refreshTone} />
      </div>

      <dl>
        <div><dt>Weather applies to</dt><dd>{describeWeatherAppliesTo(snapshot, conflict)}</dd></div>
        <div><dt>Generated or refreshed</dt><dd>{formatTimestamp(describeSnapshotTiming(snapshot))}</dd></div>
        <div><dt>Source</dt><dd>{snapshot.sourceName}</dd></div>
        <div><dt>Snapshot ID</dt><dd>{snapshot.id}</dd></div>
        <div><dt>High / low</dt><dd>{snapshot.temperatureHighC ?? "?"}C / {snapshot.temperatureLowC ?? "?"}C</dd></div>
        <div><dt>Rain</dt><dd>{snapshot.precipitationChance ?? "?"}%</dd></div>
        <div><dt>Wind</dt><dd>{snapshot.windSpeedKph ?? "?"} km/h</dd></div>
      </dl>

      {snapshot.id !== conflict.preferredSnapshotId && conflict.candidateSnapshotIds.length > 1 ? (
        <button className="weather-review-snapshot__action" type="button" onClick={() => void onSelected(snapshot.id)}>
          Select as preferred
        </button>
      ) : null}
    </article>
  );
}

function ReviewCard({ conflict, onSelected, onAcknowledged }: {
  conflict: WeatherSnapshotConflict;
  onSelected: (snapshotId: string, conflict: WeatherSnapshotConflict) => Promise<void>;
  onAcknowledged: (conflict: WeatherSnapshotConflict) => Promise<void>;
}) {
  const state = labelReviewState(conflict.recommendedReviewState);
  const summary = getCardSummary(conflict);
  const snapshots = [conflict.preferredSnapshot, ...conflict.competingSnapshots].filter((snapshot): snapshot is WeatherSnapshot => Boolean(snapshot));
  const needsAcknowledgement = conflict.candidateSnapshotIds.length > 1 && conflict.recommendedReviewState !== "preferred_selected";

  return (
    <CardSurface as="section" className="weather-review-card" key={conflict.itineraryDayId} variant="paper">
      <div className="weather-review-card__header">
        <div className="weather-review-card__header-copy">
          <p className="section-kicker">{`Day ${conflict.dayNumber} · ${labelDayType(conflict.dayType)}`}</p>
          <h2>{conflict.dayTitle}</h2>
          <p>{formatDate(conflict.itineraryDate)}</p>
        </div>
        <StatusChip label={state.label} tone={state.tone} />
      </div>

      <div className="weather-review-card__meta">
        <span>{conflict.portName ?? "No port call recorded for this day"}</span>
        <span>{`${conflict.candidateSnapshotIds.length} stored ${conflict.candidateSnapshotIds.length === 1 ? "snapshot" : "snapshots"}`}</span>
        <span>{getSurfaceImpactCopy(conflict)}</span>
      </div>

      <div className="weather-review-card__summary">
        <h3>{summary.title}</h3>
        <p>{summary.body}</p>
        {conflict.candidateSnapshotIds.length > 1 ? <p>{getContextReason(conflict)}</p> : null}
      </div>

      <div className="weather-review-card__snapshots">
        {snapshots.map((snapshot) => (
          <SnapshotCard
            conflict={conflict}
            key={snapshot.id}
            snapshot={snapshot}
            onSelected={(snapshotId) => onSelected(snapshotId, conflict)}
          />
        ))}
      </div>

      <div className="weather-review-card__differences">
        <h3>Key differences</h3>
        {!conflict.materialDifferences.length ? (
          <p>No material change was detected beyond timing and preserved history.</p>
        ) : (
          <ul>
            {conflict.materialDifferences.map((difference, index) => (
              <li key={`${conflict.itineraryDayId}-${difference.field}-${index}`}>{difference.explanation}</li>
            ))}
          </ul>
        )}
      </div>

      {needsAcknowledgement ? (
        <div className="weather-review-card__footer">
          <button className="weather-review-card__acknowledge" type="button" onClick={() => void onAcknowledged(conflict)}>
            Acknowledge without changing preferred
          </button>
        </div>
      ) : null}

      <ReviewAuditTrail conflict={conflict} />
    </CardSurface>
  );
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

  const needsReview = conflicts.filter((conflict) =>
    conflict.candidateSnapshotIds.length > 1
      && (conflict.recommendedReviewState === "review_recommended" || conflict.recommendedReviewState === "stale_preferred"));
  const resolved = conflicts.filter((conflict) =>
    conflict.candidateSnapshotIds.length > 1 && conflict.recommendedReviewState === "preferred_selected");
  const stable = conflicts.filter((conflict) => conflict.candidateSnapshotIds.length === 1);

  async function handlePreferredSelected(snapshotId: string, conflict: WeatherSnapshotConflict) {
    await selectPreferredWeatherSnapshot({
      itineraryDayId: conflict.itineraryDayId,
      snapshotId,
      reason: "User selected a preferred weather snapshot after comparison.",
    });
    setMessage(`Preferred weather updated for ${conflict.dayTitle}.`);
  }

  async function handleConflictAcknowledged(conflict: WeatherSnapshotConflict) {
    await acknowledgeWeatherSnapshotConflict({
      itineraryDayId: conflict.itineraryDayId,
      snapshotIds: conflict.candidateSnapshotIds,
      reason: "User acknowledged the weather conflict without changing the preferred snapshot.",
    });
    setMessage(`Conflict acknowledged for ${conflict.dayTitle}.`);
  }

  return (
    <div className="weather-review-page">
      <CardSurface as="section" className="weather-review-page__hero" variant="glass">
        <div className="weather-review-page__hero-copy">
          <p className="section-kicker">Weather review</p>
          <h1>Keep every snapshot. Choose the one you trust.</h1>
          <p>
            Review the weather snapshots stored for this sailing, understand why a day may need attention, and confirm
            which preferred snapshot should guide Today, Itinerary, Dashboard and Ports.
          </p>
          <p className="weather-review-page__hero-note">
            Illustrative smoke-test scenarios stay local and only touch the sample sailing. No live weather source or background refresh is introduced here.
          </p>
        </div>
        <div className="weather-review-page__hero-chips">
          <StatusChip label={`${needsReview.length} need review`} tone={needsReview.length ? "review" : "confirmed"} />
          <StatusChip label={`${resolved.length} resolved`} tone="confirmed" />
          <StatusChip label={`${stable.length} stable`} tone="confirmed" />
        </div>
        <div className="weather-review-page__actions">
          <button
            className="weather-review-page__action"
            type="button"
            onClick={() => void loadWeatherReviewDemo().then(() => setMessage("Illustrative weather review scenarios loaded for the sample sailing."))}
          >
            Load illustrative review scenarios
          </button>
          <button
            className="weather-review-page__action weather-review-page__action--secondary"
            type="button"
            onClick={() => void restoreWeatherReviewCalmState().then(() => setMessage("Illustrative review scenarios cleared. The sample sailing is back to a calm weather state."))}
          >
            Restore calm illustrative state
          </button>
        </div>
      </CardSurface>

      {message ? <p className="weather-review-page__message">{message}</p> : null}

      {!needsReview.length ? (
        <CardSurface as="section" className="weather-review-page__empty" variant="paper">
          <h2>No weather conflicts need review.</h2>
          <p>Preferred snapshots are clear for the current sailing.</p>
          <p>Future manual refreshes may add new items here.</p>
          <p>That calm state does not mean every future forecast is final, only that no stored snapshot is currently competing for control.</p>
        </CardSurface>
      ) : null}

      {needsReview.length ? (
        <section className="weather-review-page__section" aria-labelledby="weather-review-needs-review">
          <div className="weather-review-page__section-header">
            <div>
              <p className="section-kicker">Needs review</p>
              <h2 id="weather-review-needs-review">Snapshots needing review</h2>
            </div>
            <p>These itinerary days have competing weather snapshots that still need a preferred choice or a fresh acknowledgement.</p>
          </div>
          <div className="weather-review-page__list">
            {needsReview.map((conflict) => (
              <ReviewCard
                conflict={conflict}
                key={conflict.itineraryDayId}
                onAcknowledged={handleConflictAcknowledged}
                onSelected={handlePreferredSelected}
              />
            ))}
          </div>
        </section>
      ) : null}

      {resolved.length ? (
        <section className="weather-review-page__section" aria-labelledby="weather-review-resolved">
          <div className="weather-review-page__section-header">
            <div>
              <p className="section-kicker">Resolved</p>
              <h2 id="weather-review-resolved">Preferred snapshots already selected</h2>
            </div>
            <p>These days now use a chosen preferred snapshot while still preserving the competing history alongside it.</p>
          </div>
          <div className="weather-review-page__list">
            {resolved.map((conflict) => (
              <ReviewCard
                conflict={conflict}
                key={conflict.itineraryDayId}
                onAcknowledged={handleConflictAcknowledged}
                onSelected={handlePreferredSelected}
              />
            ))}
          </div>
        </section>
      ) : null}

      {stable.length ? (
        <section className="weather-review-page__section" aria-labelledby="weather-review-stable">
          <div className="weather-review-page__section-header">
            <div>
              <p className="section-kicker">Stable snapshots</p>
              <h2 id="weather-review-stable">Days without a weather conflict</h2>
            </div>
            <p>These cards show the only stored snapshot for the day, including sea-day guardrail wording where no port-weather choice should apply.</p>
          </div>
          <div className="weather-review-page__list">
            {stable.map((conflict) => (
              <ReviewCard
                conflict={conflict}
                key={conflict.itineraryDayId}
                onAcknowledged={handleConflictAcknowledged}
                onSelected={handlePreferredSelected}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
