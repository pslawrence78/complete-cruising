import { usePwaReadiness } from "../../hooks/usePwaReadiness";

function formatLocalDate(value?: string) {
  if (!value) return "Awaiting local sailing data";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function PwaReadinessStatus() {
  const {
    lastLocalUpdate,
    online,
    serviceWorkerReady,
    serviceWorkerSupported,
  } = usePwaReadiness();

  const shellLabel = !serviceWorkerSupported
    ? "Browser storage only"
    : serviceWorkerReady
      ? "Ready for sea"
      : "Preparing offline shell";

  return (
    <section className="pwa-readiness" aria-label="Offline readiness">
      <div className="pwa-readiness__item">
        <span
          className="pwa-readiness__signal"
          data-state={online ? "online" : "offline"}
          aria-hidden="true"
        />
        <span>
          <small>Connection</small>
          <strong>{online ? "Online" : "Offline"}</strong>
        </span>
      </div>
      <div className="pwa-readiness__item">
        <span
          className="pwa-readiness__signal"
          data-state={serviceWorkerReady ? "ready" : "preparing"}
          aria-hidden="true"
        />
        <span>
          <small>Offline shell</small>
          <strong>{shellLabel}</strong>
        </span>
      </div>
      <p className="pwa-readiness__update">
        <span>Last local update</span>
        <strong>{formatLocalDate(lastLocalUpdate)}</strong>
      </p>
    </section>
  );
}
