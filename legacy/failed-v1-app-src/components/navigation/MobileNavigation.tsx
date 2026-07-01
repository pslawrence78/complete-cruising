import type { RouteDefinition } from "../../routes/routeConfig";
import { useMoreMenu } from "./useMoreMenu";

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
  const {
    buttonId,
    menuId,
    menuRef,
    triggerRef,
    isOpen,
    closeMenu,
    toggleMenu,
  } = useMoreMenu({ activeRouteId });
  const primaryRoutes = routes
    .filter((route) =>
      ["dashboard", "today", "itinerary", "ports"].includes(route.id),
    )
    .sort((a, b) => a.order - b.order);
  const moreRoutes = routes
    .filter((route) =>
      route.id === "ship"
      || route.id === "plans"
      || route.navigationGroup === "more",
    )
    .sort((a, b) => a.order - b.order);
  const activeRoute = routes.find((route) => route.id === activeRouteId);
  const moreIsActive =
    activeRoute?.navigationGroup !== "primary"
    || activeRouteId === "ship"
    || activeRouteId === "plans";

  return (
    <>
      {isOpen ? <div className="mobile-navigation__scrim" aria-hidden="true" /> : null}
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
          <li className="mobile-navigation__more">
            <button
              id={buttonId}
              ref={triggerRef}
              className="mobile-navigation__item"
              type="button"
              aria-current={moreIsActive ? "page" : undefined}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              aria-controls={menuId}
              onClick={toggleMenu}
            >
              <span className="mobile-navigation__marker" aria-hidden="true" />
              More
            </button>
          </li>
        </ul>
      </nav>

      <div
        id={menuId}
        ref={menuRef}
        className="mobile-navigation__more-menu"
        role="menu"
        aria-labelledby={buttonId}
        aria-label="More navigation menu"
        data-open={isOpen}
      >
        {moreRoutes.map((route) => {
          const isAvailable = route.status === "implemented";
          return (
            <button
              key={route.id}
              className="mobile-navigation__more-item"
              type="button"
              role="menuitem"
              aria-current={route.id === activeRouteId ? "page" : undefined}
              aria-disabled={!isAvailable}
              onClick={() => {
                if (!isAvailable) {
                  return;
                }

                closeMenu();
                onNavigate(route.id);
              }}
            >
              {route.title}
            </button>
          );
        })}
      </div>
    </>
  );
}
