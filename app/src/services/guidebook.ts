import { itinerary, memoryPrompts, plans, ports, product, sailing, shipSections, type DayRecord } from "../data/sunPrincess2026";

function dateOnly(value: Date | string) {
  const source = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  return source.toISOString().slice(0, 10);
}

export function getCountdown(now = new Date()) {
  const embarkation = new Date(`${sailing.embarkationDate}T12:00:00`);
  return Math.max(0, Math.ceil((embarkation.getTime() - now.getTime()) / 86_400_000));
}

export type TodayMode =
  | "pre-cruise"
  | "embarkation-day"
  | "port-day"
  | "sea-day"
  | "disembarkation-day"
  | "post-cruise";

export function getTodayContext(now = new Date()) {
  const todayIso = dateOnly(now);
  const embarkationIso = sailing.embarkationDate;
  const disembarkationIso = sailing.disembarkationDate;

  let focusDay: DayRecord;
  let mode: TodayMode;

  if (todayIso < embarkationIso) {
    focusDay = itinerary[0];
    mode = "pre-cruise";
  } else if (todayIso > disembarkationIso) {
    focusDay = itinerary[itinerary.length - 1];
    mode = "post-cruise";
  } else {
    focusDay = itinerary.find((day) => day.date === todayIso) ?? itinerary[0];
    mode =
      focusDay.type === "embarkation"
        ? "embarkation-day"
        : focusDay.type === "port"
          ? "port-day"
          : focusDay.type === "sea"
            ? "sea-day"
            : "disembarkation-day";
  }

  const selectedPlan = focusDay.selectedPlanId ? plans.find((plan) => plan.id === focusDay.selectedPlanId) : undefined;
  const backupPlan = focusDay.backupPlanId ? plans.find((plan) => plan.id === focusDay.backupPlanId) : undefined;
  const port = focusDay.portId ? ports.find((entry) => entry.id === focusDay.portId) : undefined;

  return { mode, focusDay, selectedPlan, backupPlan, port };
}

export const guidebook = {
  product,
  sailing,
  itinerary,
  ports,
  plans,
  shipSections,
  memoryPrompts,
};
