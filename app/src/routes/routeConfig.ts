export interface RouteDefinition {
  id: "dashboard" | "today" | "itinerary" | "ports" | "ship" | "plans" | "memories" | "about";
  path: string;
  title: string;
}

export const routes: RouteDefinition[] = [
  { id: "dashboard", path: "/", title: "Dashboard" },
  { id: "today", path: "/today", title: "Today" },
  { id: "itinerary", path: "/itinerary", title: "Itinerary" },
  { id: "ports", path: "/ports", title: "Ports" },
  { id: "ship", path: "/ship", title: "Ship" },
  { id: "plans", path: "/plans", title: "Plans" },
  { id: "memories", path: "/memories", title: "Memories" },
  { id: "about", path: "/about", title: "About" },
];

export function getRouteFromHash(hash: string) {
  const path = hash.replace(/^#/, "") || "/";
  return routes.find((route) => route.path === path) ?? routes[0];
}
