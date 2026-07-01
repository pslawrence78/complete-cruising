import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { getRouteFromHash } from "./routes/routeConfig";
import { AboutPage } from "./pages/AboutPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ItineraryPage } from "./pages/ItineraryPage";
import { MemoriesPage } from "./pages/MemoriesPage";
import { PlansPage } from "./pages/PlansPage";
import { PortsPage } from "./pages/PortsPage";
import { ShipPage } from "./pages/ShipPage";
import { TodayPage } from "./pages/TodayPage";

function resolveRoute() {
  return getRouteFromHash(window.location.hash);
}

function App() {
  const [activeRoute, setActiveRoute] = useState(resolveRoute);

  useEffect(() => {
    const onHashChange = () => setActiveRoute(resolveRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const page =
    activeRoute.id === "today" ? <TodayPage /> :
    activeRoute.id === "itinerary" ? <ItineraryPage /> :
    activeRoute.id === "ports" ? <PortsPage /> :
    activeRoute.id === "ship" ? <ShipPage /> :
    activeRoute.id === "plans" ? <PlansPage /> :
    activeRoute.id === "memories" ? <MemoriesPage /> :
    activeRoute.id === "about" ? <AboutPage /> :
    <DashboardPage />;

  return (
    <AppShell activeRoute={activeRoute} onNavigate={navigate}>
      {page}
    </AppShell>
  );
}

export default App;
