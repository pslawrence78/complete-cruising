import { scaffoldSampleData } from "./data/sampleData";
import { routeConfig } from "./routes/routeConfig";

function App() {
  const scaffoldRoute = routeConfig[0];

  return (
    <main className="app-scaffold" data-route={scaffoldRoute.path}>
      <h1>{scaffoldRoute.title}</h1>
      <p>{scaffoldSampleData.status}</p>
    </main>
  );
}

export default App;
