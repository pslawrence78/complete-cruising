export interface RouteDefinition {
  id: string;
  path: string;
  title: string;
  status: "placeholder";
}

export const routeConfig: readonly RouteDefinition[] = [
  {
    id: "dashboard",
    path: "/",
    title: "Dashboard",
    status: "placeholder",
  },
  {
    id: "itinerary",
    path: "/itinerary",
    title: "Itinerary",
    status: "placeholder",
  },
  {
    id: "today",
    path: "/today",
    title: "Today",
    status: "placeholder",
  },
  {
    id: "ports",
    path: "/ports",
    title: "Ports",
    status: "placeholder",
  },
  {
    id: "ship",
    path: "/ship",
    title: "Ship",
    status: "placeholder",
  },
  {
    id: "plans",
    path: "/plans",
    title: "Plans",
    status: "placeholder",
  },
  {
    id: "family",
    path: "/family",
    title: "Family",
    status: "placeholder",
  },
  {
    id: "memories",
    path: "/memories",
    title: "Memories",
    status: "placeholder",
  },
  {
    id: "import-export",
    path: "/import-export",
    title: "Import / Export",
    status: "placeholder",
  },
];
