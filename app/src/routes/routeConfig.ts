export interface RouteDefinition {
  id: string;
  path: string;
  title: string;
  status: "implemented" | "placeholder";
}

export const routeConfig: readonly RouteDefinition[] = [
  {
    id: "dashboard",
    path: "/",
    title: "Dashboard",
    status: "implemented",
  },
  {
    id: "itinerary",
    path: "/itinerary",
    title: "Itinerary",
    status: "implemented",
  },
  {
    id: "today",
    path: "/today",
    title: "Today",
    status: "implemented",
  },
  {
    id: "ports",
    path: "/ports",
    title: "Ports",
    status: "implemented",
  },
  {
    id: "ship",
    path: "/ship",
    title: "Ship",
    status: "implemented",
  },
  {
    id: "plans",
    path: "/plans",
    title: "Plans",
    status: "implemented",
  },
  {
    id: "family",
    path: "/family",
    title: "Family",
    status: "implemented",
  },
  {
    id: "memories",
    path: "/memories",
    title: "Memories",
    status: "implemented",
  },
  {
    id: "import-export",
    path: "/import-export",
    title: "Import / Export",
    status: "implemented",
  },
];
