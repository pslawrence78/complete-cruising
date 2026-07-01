import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { BackstagePage } from "./features/backstage/BackstagePage";
import { FamilyGuidePage } from "./features/family/FamilyGuidePage";
import { GuideLoaderPage } from "./features/guide-loader/GuideLoaderPage";
import { ItineraryPage } from "./features/itinerary/ItineraryPage";
import { MemoriesPage } from "./features/memories/MemoriesPage";
import { MorePage } from "./features/more/MorePage";
import { PlansPage } from "./features/plans/PlansPage";
import { PortGuidePage } from "./features/ports/PortGuidePage";
import { ShipPage } from "./features/ship/ShipPage";
import { TodayPage } from "./features/today/TodayPage";
import { ImportExportPage } from "./features/import-export/ImportExportPage";
import { SailingSetupPage } from "./features/sailing-setup/SailingSetupPage";
import { EnrichmentRequestsPage } from "./features/enrichment-requests/EnrichmentRequestsPage";
import { DataManagementPage } from "./features/data-management/DataManagementPage";
import { WeatherSnapshotReviewPage } from "./features/weather/WeatherSnapshotReviewPage";
import { routeConfig } from "./routes/routeConfig";
import { LocalDataState } from "./components/states/LocalDataState";
import { useDatabaseBootstrap } from "./hooks/useLocalData";

function getActiveRouteId() {
  const hashPath = window.location.hash.replace(/^#/, "") || "/";
  const route = routeConfig.find(
    (candidate) =>
      candidate.status === "implemented" && candidate.path === hashPath,
  );

  return route?.id ?? "dashboard";
}

function App() {
  const database = useDatabaseBootstrap();
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
    activeRouteId === "backstage" ? (
      <BackstagePage />
    ) : activeRouteId === "weather-review" ? (
      <WeatherSnapshotReviewPage />
    ) : activeRouteId === "sailing-setup" ? (
      <SailingSetupPage />
    ) : activeRouteId === "enrichment-requests" ? (
      <EnrichmentRequestsPage />
    ) : activeRouteId === "import-export" ? (
      <ImportExportPage />
    ) : activeRouteId === "data-management" ? (
      <DataManagementPage />
    ) : activeRouteId === "guide-loader" ? (
      <GuideLoaderPage />
    ) : activeRouteId === "more" ? (
      <MorePage />
    ) : activeRouteId === "plans" ? (
      <PlansPage />
    ) : activeRouteId === "family" ? (
      <FamilyGuidePage />
    ) : activeRouteId === "memories" ? (
      <MemoriesPage />
    ) : activeRouteId === "itinerary" ? (
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

  if (database.loading) return <LocalDataState kind="loading" />;
  if (database.error) return <LocalDataState kind="error" />;

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
