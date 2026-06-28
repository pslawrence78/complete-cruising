import type { RouteDefinition } from "../../routes/routeConfig";
import { BrandMark } from "../visual/BrandMark";

interface TopNavigationProps {
  activeRouteId: string;
  onNavigate: (routeId: string) => void;
  routes: readonly RouteDefinition[];
}

export function TopNavigation({
  activeRouteId,
  onNavigate,
  routes,
}: TopNavigationProps) {
  const primaryRoutes = routes
    .filter((route) => route.navigationGroup === "primary")
    .sort((a, b) => a.order - b.order);
  const moreRoutes = routes
    .filter((route) => route.navigationGroup === "more")
    .sort((a, b) => a.order - b.order);
  const activeRoute = routes.find((route) => route.id === activeRouteId);
  const moreIsActive = activeRoute?.navigationGroup === "more";

  return (
    <header className="top-navigation card-surface card-surface--glass">
      <a className="brand-lockup" href="#main-content" aria-label="Complete Cruising home">
        <BrandMark />
        <span className="brand-lockup__copy">
          <strong>Complete Cruising</strong>
          <span className="brand-lockup__tagline">
            Your sailing, fully understood.
          </span>
        </span>
      </a>

      <nav className="top-navigation__nav" aria-label="Primary navigation">
        <ul className="navigation-list">
          {primaryRoutes.map((route) => {
            const isActive = route.id === activeRouteId;
            const isAvailable = route.status === "implemented";

            return (
              <li key={route.id}>
                <button
                  className="navigation-item"
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={!isAvailable}
                  onClick={() => {
                    if (isAvailable) {
                      onNavigate(route.id);
                    }
                  }}
                  title={
                    isActive
                      ? `Current ${route.title.toLowerCase()} view`
                      : isAvailable
                        ? `Open ${route.title}`
                        : "Placeholder route for a future tranche"
                  }
                >
                  {route.title}
                </button>
              </li>
            );
          })}
          <li>
            <details className="navigation-more" open={moreIsActive}>
              <summary className="navigation-item" aria-current={moreIsActive ? "page" : undefined}>More</summary>
              <div className="navigation-more__menu">
                {moreRoutes.map((route) => {
                  const isAvailable = route.status === "implemented";
                  return <button
                    key={route.id}
                    className="navigation-more__item"
                    type="button"
                    aria-current={route.id === activeRouteId ? "page" : undefined}
                    aria-disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) onNavigate(route.id);
                    }}
                  >
                    {route.title}
                  </button>;
                })}
              </div>
            </details>
          </li>
        </ul>
      </nav>

      <div className="active-sailing" aria-label="Active sailing">
        <span className="active-sailing__signal" aria-hidden="true" />
        <span>
          <small>Active sailing</small>
          <strong>Eastern Mediterranean Cruise</strong>
        </span>
      </div>
    </header>
  );
}
