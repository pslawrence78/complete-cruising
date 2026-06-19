import type { RouteStop } from "../../../data/sampleDashboardData";

interface RouteRibbonProps {
  route: readonly RouteStop[];
  routeEnd: string;
  routeStart: string;
}

export function RouteRibbon({
  route,
  routeEnd,
  routeStart,
}: RouteRibbonProps) {
  return (
    <section className="route-ribbon" aria-labelledby="route-ribbon-title">
      <div className="route-ribbon__heading">
        <div>
          <p>Representative voyage</p>
          <h2 id="route-ribbon-title">
            {routeStart} <span aria-hidden="true">—</span> {routeEnd}
          </h2>
        </div>
        <span>{route.length} days · illustrative route</span>
      </div>

      <div
        className="route-ribbon__viewport"
        role="region"
        aria-label="Scrollable illustrative sailing route"
        tabIndex={0}
      >
        <ol className="route-ribbon__track">
          {route.map((stop, index) => (
            <li className="route-stop" data-kind={stop.kind} key={stop.id}>
              <span className="route-stop__day">{index + 1}</span>
              <span className="route-stop__node" aria-hidden="true" />
              <span className="route-stop__name">{stop.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
