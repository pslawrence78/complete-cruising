import type {
  DashboardData,
  RouteStop,
} from "../../../data/sampleDashboardData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";
import { RouteMotif } from "../../../components/visual/RouteMotif";
import { RouteRibbon } from "./RouteRibbon";

interface SailingHeroProps {
  route: readonly RouteStop[];
  sailing: DashboardData["sailing"];
}

function ShipSilhouette() {
  return (
    <svg
      className="dashboard-hero__ship"
      viewBox="0 0 760 240"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M46 157h590c31 0 55-17 70-48l18-39h-82l-20 42H167l-36-63H84l22 63H28Z" />
      <path d="M186 109h365l22-52H155Z" opacity="0.68" />
      <path d="M234 68h235l-29-45H270Z" opacity="0.48" />
      <path
        d="M42 196c90 20 157 24 242 5 95-21 155-25 249-3 81 19 131 21 193 2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="8"
      />
    </svg>
  );
}

export function SailingHero({ route, sailing }: SailingHeroProps) {
  return (
    <CardSurface as="section" className="dashboard-hero" variant="glass" aria-labelledby="dashboard-title">
      <RouteMotif className="dashboard-hero__motif" />
      <ShipSilhouette />

      <div className="dashboard-hero__content">
        <div className="dashboard-hero__main">
          <div>
            <p className="eyebrow">Illustrative sailing · {sailing.dateLabel}</p>
            <p className="dashboard-hero__lineage">
              {sailing.cruiseLine} <span aria-hidden="true">·</span> {sailing.ship}
            </p>
            <h1 id="dashboard-title">{sailing.name}</h1>
            <p className="dashboard-hero__route-summary">
              <span>{sailing.routeStart}</span>
              <span className="dashboard-hero__route-line" aria-hidden="true" />
              <span>{sailing.routeEnd}</span>
            </p>
            <p className="dashboard-hero__description">
              A personalised guide to every port, plan and possibility.
            </p>

            <div className="dashboard-hero__actions" aria-label="Future dashboard actions">
              {[
                ["View today", "primary"],
                ["Explore itinerary", "secondary"],
                ["Open ship guide", "secondary"],
              ].map(([label, variant]) => (
                <button
                  className="dashboard-action"
                  data-variant={variant}
                  type="button"
                  aria-disabled="true"
                  key={label}
                >
                  <span>{label}</span>
                  <small>Future view</small>
                </button>
              ))}
            </div>
          </div>

          <div className="dashboard-hero__facts" aria-label="Sailing facts">
            <span>{sailing.nights} nights</span>
            <span>{sailing.ports} ports</span>
            <span>{sailing.seaDays} sea days</span>
          </div>
        </div>

        <CardSurface as="aside" className="countdown-card" variant="paper" aria-label="Illustrative embarkation countdown">
          <div className="countdown-card__status">
            <p>Embarkation countdown</p>
            <StatusChip label="Upcoming" tone="confirmed" />
          </div>
          <strong>{sailing.daysToEmbarkation}</strong>
          <span>illustrative days</span>
          <p>
            A fixed placeholder until confirmed sailing dates power the live
            countdown in a later data tranche.
          </p>
          <div className="countdown-card__bearing" aria-hidden="true">
            <span>N</span>
            <i />
            <span>41°54'</span>
          </div>
        </CardSurface>
      </div>

      <RouteRibbon
        route={route}
        routeEnd={sailing.routeEnd}
        routeStart={sailing.routeStart}
      />
    </CardSurface>
  );
}
