import type { RouteDefinition } from "../../routes/routeConfig";

interface MobileNavigationProps {
  activeRouteId: string;
  onNavigate: (routeId: string) => void;
  routes: readonly RouteDefinition[];
}

export function MobileNavigation({
  activeRouteId,
  onNavigate,
  routes,
}: MobileNavigationProps) {
  const primaryRoutes = routes
    .filter((route) => route.navigationGroup === "primary" && route.id !== "ship")
    .sort((a, b) => a.order - b.order);
  const moreRoutes = routes
    .filter((route) => route.navigationGroup === "more" || route.id === "ship")
    .sort((a, b) => a.order - b.order);
  const activeRoute = routes.find((route) => route.id === activeRouteId);
  const moreIsActive = activeRoute?.navigationGroup === "more" || activeRouteId === "ship";

  return (
    <nav
      className="mobile-navigation card-surface card-surface--glass"
      aria-label="Mobile navigation"
    >
      <ul className="mobile-navigation__list">
        {primaryRoutes.map((route) => {
          const isActive = route.id === activeRouteId;
          const isAvailable = route.status === "implemented";

          return (
            <li key={route.id}>
              <button
                className="mobile-navigation__item"
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-disabled={!isAvailable}
                onClick={() => {
                  if (isAvailable) {
                    onNavigate(route.id);
                  }
                }}
              >
                <span className="mobile-navigation__marker" aria-hidden="true" />
                {route.title}
              </button>
            </li>
          );
        })}
        <li>
          <details className="mobile-navigation__more" open={moreIsActive}>
            <summary className="mobile-navigation__item" aria-current={moreIsActive ? "page" : undefined}>
              <span className="mobile-navigation__marker" aria-hidden="true" />
              More
            </summary>
            <div className="mobile-navigation__more-menu">
              {moreRoutes.map((route) => {
                const isAvailable = route.status === "implemented";
                return <button
                  key={route.id}
                  className="mobile-navigation__more-item"
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
  );
}
