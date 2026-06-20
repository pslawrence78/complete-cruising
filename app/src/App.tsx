import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ItineraryPage } from "./features/itinerary/ItineraryPage";
import { PortGuidePage } from "./features/ports/PortGuidePage";
import { ShipPage } from "./features/ship/ShipPage";
import { TodayPage } from "./features/today/TodayPage";
import { routeConfig } from "./routes/routeConfig";

function getActiveRouteId() {
  const hashPath = window.location.hash.replace(/^#/, "") || "/";
  const route = routeConfig.find(
    (candidate) =>
      candidate.status === "implemented" && candidate.path === hashPath,
  );

  return route?.id ?? "dashboard";
}

function App() {
  const [activeRouteId, setActiveRouteId] = useState(getActiveRouteId);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveRouteId(getActiveRouteId());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (routeId: string) => {
    const route = routeConfig.find(
      (candidate) =>
        candidate.id === routeId && candidate.status === "implemented",
    );

    if (!route) {
      return;
    }

    setActiveRouteId(route.id);
    window.location.hash = route.path;
  };

  const activePage =
    activeRouteId === "itinerary" ? (
      <ItineraryPage />
    ) : activeRouteId === "today" ? (
      <TodayPage />
    ) : activeRouteId === "ports" ? (
      <PortGuidePage />
    ) : activeRouteId === "ship" ? (
      <ShipPage />
    ) : (
      <DashboardPage />
    );

  return (
    <AppShell
      activeRouteId={activeRouteId}
      onNavigate={handleNavigate}
      routes={routeConfig}
    >
      {activePage}
    </AppShell>
  );
}

export default App;
