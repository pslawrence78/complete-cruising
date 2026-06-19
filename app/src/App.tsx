import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { routeConfig } from "./routes/routeConfig";

function App() {
  return (
    <AppShell activeRouteId="dashboard" routes={routeConfig}>
      <DashboardPage />
    </AppShell>
  );
}

export default App;
