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
          {routes.map((route) => {
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
        </ul>
      </nav>

      <div className="active-sailing" aria-label="Active sailing">
        <span className="active-sailing__signal" aria-hidden="true" />
        <span>
          <small>Active sailing</small>
          <strong>Sun Princess Mediterranean 2026</strong>
        </span>
      </div>
    </header>
  );
}
