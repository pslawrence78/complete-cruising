import type { ReactNode } from "react";
import { routes, type RouteDefinition } from "../routes/routeConfig";

interface AppShellProps {
  activeRoute: RouteDefinition;
  children: ReactNode;
  onNavigate: (path: string) => void;
}

export function AppShell({ activeRoute, children, onNavigate }: AppShellProps) {
  return (
    <div className="shell">
      <header className="shell__hero">
        <div className="shell__brand">
          <p className="shell__eyebrow">Lawrence Family Series</p>
          <h1>Complete Cruising</h1>
          <p className="shell__tagline">Sun Princess 2026 Edition</p>
        </div>
        <div className="shell__motif" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </header>

      <nav className="primary-nav" aria-label="Primary navigation">
        {routes.map((route) => (
          <button
            key={route.id}
            type="button"
            className="primary-nav__item"
            data-active={route.id === activeRoute.id}
            onClick={() => onNavigate(route.path)}
          >
            {route.title}
          </button>
        ))}
      </nav>

      <main className="shell__main">{children}</main>
    </div>
  );
}
