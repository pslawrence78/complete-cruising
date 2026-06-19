export interface RouteDefinition {
  id: string;
  path: string;
  title: string;
  status: "placeholder";
}

export const routeConfig: readonly RouteDefinition[] = [
  {
    id: "scaffold",
    path: "/",
    title: "Complete Cruising",
    status: "placeholder",
  },
];
