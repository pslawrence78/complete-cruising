export interface RouteDefinition {
  id: string;
  path: string;
  title: string;
  status: "implemented" | "placeholder";
  navigationGroup: "primary" | "mobile-primary" | "more";
  order: number;
}

export const routeConfig: readonly RouteDefinition[] = [
  {
    id: "dashboard",
    path: "/",
    title: "Dashboard",
    status: "implemented",
    navigationGroup: "primary",
    order: 1,
  },
  {
    id: "today",
    path: "/today",
    title: "Today",
    status: "implemented",
    navigationGroup: "primary",
    order: 2,
  },
  {
    id: "itinerary",
    path: "/itinerary",
    title: "Itinerary",
    status: "implemented",
    navigationGroup: "primary",
    order: 3,
  },
  {
    id: "ports",
    path: "/ports",
    title: "Ports",
    status: "implemented",
    navigationGroup: "primary",
    order: 4,
  },
  {
    id: "ship",
    path: "/ship",
    title: "Ship",
    status: "implemented",
    navigationGroup: "primary",
    order: 5,
  },
  {
    id: "plans",
    path: "/plans",
    title: "Plans",
    status: "implemented",
    navigationGroup: "more",
    order: 10,
  },
  {
    id: "family",
    path: "/family",
    title: "Family Guide",
    status: "implemented",
    navigationGroup: "more",
    order: 11,
  },
  {
    id: "memories",
    path: "/memories",
    title: "Memories",
    status: "implemented",
    navigationGroup: "more",
    order: 12,
  },
  {
    id: "sailing-setup",
    path: "/sailing-setup",
    title: "Setup",
    status: "implemented",
    navigationGroup: "more",
    order: 20,
  },
  {
    id: "enrichment-requests",
    path: "/enrichment-requests",
    title: "Enrichment Requests",
    status: "implemented",
    navigationGroup: "more",
    order: 21,
  },
  {
    id: "import-export",
    path: "/import-export",
    title: "Import / Export",
    status: "implemented",
    navigationGroup: "more",
    order: 22,
  },
  {
    id: "data-management",
    path: "/data-management",
    title: "Data Management",
    status: "implemented",
    navigationGroup: "more",
    order: 23,
  },
  {
    id: "documents",
    path: "/documents",
    title: "Documents",
    status: "placeholder",
    navigationGroup: "more",
    order: 13,
  },
  {
    id: "settings",
    path: "/settings",
    title: "Settings",
    status: "placeholder",
    navigationGroup: "more",
    order: 24,
  },
];
