import type { RouteDefinition } from "../../routes/routeConfig";

interface MobileNavigationProps {
  activeRouteId: string;
  routes: readonly RouteDefinition[];
}

export function MobileNavigation({
  activeRouteId,
  routes,
}: MobileNavigationProps) {
  return (
    <nav
      className="mobile-navigation card-surface card-surface--glass"
      aria-label="Mobile navigation"
    >
      <ul className="mobile-navigation__list">
        {routes.map((route) => {
          const isActive = route.id === activeRouteId;

          return (
            <li key={route.id}>
              <button
                className="mobile-navigation__item"
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-disabled={!isActive}
              >
                <span className="mobile-navigation__marker" aria-hidden="true" />
                {route.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
