import type { ReactNode } from "react";
import type { RouteDefinition } from "../../routes/routeConfig";
import { MobileNavigation } from "../navigation/MobileNavigation";
import { TopNavigation } from "../navigation/TopNavigation";
import { PwaReadinessStatus } from "../status/PwaReadinessStatus";

interface AppShellProps {
  activeRouteId: string;
  children: ReactNode;
  onNavigate: (routeId: string) => void;
  routes: readonly RouteDefinition[];
}

export function AppShell({
  activeRouteId,
  children,
  onNavigate,
  routes,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="app-shell__frame">
        <TopNavigation
          activeRouteId={activeRouteId}
          onNavigate={onNavigate}
          routes={routes}
        />

        <PwaReadinessStatus />

        <main id="main-content" className="app-shell__main" tabIndex={-1}>
          {children}
        </main>

        <footer className="app-shell__footer">
          <p className="data-caveat">
            <span className="data-caveat__mark" aria-hidden="true">i</span>
            <span>
              Sample data is illustrative. Final sailing details should be
              confirmed against booking and cruise line sources before travel.
            </span>
          </p>
          <p className="app-shell__signature">
            Complete Cruising <span aria-hidden="true">·</span> Lawrence Family
            Series
          </p>
        </footer>
      </div>

      <MobileNavigation
        activeRouteId={activeRouteId}
        onNavigate={onNavigate}
        routes={routes}
      />
    </div>
  );
}
