import type { DayGuide, ItineraryDayRecord, ShorePlanRecord, WeatherSnapshot } from "../../types";
import { deriveWeatherStateForDay } from "../weather/weatherStateService";
import type {
  CruiseConditionStatus,
  CruiseConditionsSummary,
  DayReadinessAssessment,
  DayReadinessInput,
  DayReadinessStatus,
  ReadinessDimension,
  ReadinessFlag,
  ReadinessSeverity,
} from "./conditionTypes";

function isPortLikeDay(day: Pick<ItineraryDayRecord, "dayType">) {
  return day.dayType === "port" || day.dayType === "overnight_port";
}

function isAshoreOptionalDay(day: Pick<ItineraryDayRecord, "dayType">) {
  return day.dayType === "sea" || day.dayType === "scenic_cruising";
}

function selectedPlanForDay(day: Pick<ItineraryDayRecord, "selectedShorePlanId">, plans: readonly ShorePlanRecord[]) {
  return plans.find((plan) => plan.id === day.selectedShorePlanId || plan.status === "selected" || plan.status === "booked");
}

function backupPlanForDay(day: Pick<ItineraryDayRecord, "backupShorePlanId">, plans: readonly ShorePlanRecord[], selected?: ShorePlanRecord) {
  return plans.find((plan) => plan.id === day.backupShorePlanId) ?? plans.find((plan) => plan.id !== selected?.id);
}

function addFlag(flags: ReadinessFlag[], id: string, label: string, severity: ReadinessSeverity) {
  flags.push({ id, label, severity });
}

function formatConditionLabel(status: CruiseConditionStatus) {
  switch (status) {
    case "ready":
      return "Ready for sea";
    case "review_needed":
      return "Plan needs review";
    case "forecast_pending":
      return "Forecast pending";
    case "climate_only":
      return "Climate only";
    case "same_day_check_needed":
      return "Same-day check needed";
    case "stale":
      return "Needs refresh";
    case "missing":
      return "Missing";
    default:
      return "Not applicable";
  }
}

function formatReadinessLabel(status: DayReadinessStatus) {
  switch (status) {
    case "ready_for_today":
      return "Ready for today";
    case "usable_with_cautions":
      return "Usable with cautions";
    case "needs_review":
      return "Needs review";
    default:
      return "Not ready yet";
  }
}

function confidenceSeverity(input: { refreshRecommended?: boolean; confidence?: string; reviewStatus?: string }) {
  if (input.reviewStatus === "stale" || input.reviewStatus === "needs_refresh" || input.refreshRecommended) return "caution" as const;
  if (input.reviewStatus === "needs_user_review" || input.confidence === "low" || input.confidence === "inferred" || input.confidence === "unknown") return "notice" as const;
  return "positive" as const;
}

function assessTiming(day: ItineraryDayRecord, guide?: DayGuide, selectedPlan?: ShorePlanRecord): ReadinessDimension {
  const flags: ReadinessFlag[] = [];

  if (isAshoreOptionalDay(day)) {
    addFlag(flags, "sea-day", "Sea day - no return buffer needed", "neutral");
    return {
      key: "timing",
      label: "Timing",
      score: 2,
      status: "not_applicable",
      summary: "Sea day - no return buffer needed.",
      flags,
    };
  }

  if (day.dayType === "disembarkation") {
    addFlag(flags, "disembarkation", "Disembarkation timing in view", "notice");
    return {
      key: "timing",
      label: "Timing",
      score: day.departureTime ? 2 : 1,
      status: day.departureTime ? "ready" : "review_needed",
      summary: day.departureTime ? "Departure timing is recorded." : "Final travel timing needs review.",
      flags,
    };
  }

  const hasArrivalDeparture = Boolean(day.arrivalTime || day.departureTime);
  const hasAllAboard = Boolean(day.allAboardTime);
  const safeReturn = guide?.latestSafeReturnTime;
  const returnBufferMinutes = selectedPlan?.returnBufferMinutes;

  if (hasAllAboard) addFlag(flags, "all-aboard", "All-aboard confirmed", "positive");
  else addFlag(flags, "all-aboard-missing", "All-aboard missing", isPortLikeDay(day) ? "critical" : "notice");

  if (safeReturn) addFlag(flags, "safe-return", "Safe return guidance available", "positive");
  else if (isPortLikeDay(day)) addFlag(flags, "safe-return-missing", "Safe return time missing", "caution");

  if (returnBufferMinutes !== undefined) addFlag(flags, "return-buffer", "Return buffer available", "positive");
  else if (isPortLikeDay(day)) addFlag(flags, "return-buffer-missing", "Return buffer missing", "caution");

  if (day.dayType === "embarkation") {
    const score: 0 | 1 | 2 = hasAllAboard ? 2 : 1;
    return {
      key: "timing",
      label: "Timing",
      score,
      status: hasAllAboard ? "ready" : "review_needed",
      summary: hasAllAboard ? "Boarding timing is available." : "Boarding timing still needs review.",
      flags,
    };
  }

  if (hasAllAboard && (safeReturn || returnBufferMinutes !== undefined)) {
    return {
      key: "timing",
      label: "Timing",
      score: 2,
      status: "ready",
      summary: "All-aboard present, safe return guidance available.",
      flags,
    };
  }

  if (hasArrivalDeparture || hasAllAboard) {
    return {
      key: "timing",
      label: "Timing",
      score: 1,
      status: "review_needed",
      summary: "Port timings need review before this day feels fully ready.",
      flags,
    };
  }

  return {
    key: "timing",
    label: "Timing",
    score: 0,
    status: "missing",
    summary: "Port timings need review.",
    flags,
  };
}

function assessWeather(day: ItineraryDayRecord, weather?: WeatherSnapshot, todayIso?: string): ReadinessDimension {
  const flags: ReadinessFlag[] = [];
  if (weather?.refreshRecommended || weather?.confidence.reviewStatus === "needs_refresh" || weather?.confidence.reviewStatus === "stale") {
    addFlag(flags, "stale", "Needs refresh", "caution");
    return {
      key: "weather",
      label: "Weather",
      score: 1,
      status: "stale",
      summary: "Weather exists but needs refresh.",
      flags,
    };
  }
  const state = deriveWeatherStateForDay({ day, snapshot: weather, todayIso });

  if (isAshoreOptionalDay(day) && !weather) {
    addFlag(flags, "sea-weather-optional", "Sea-day guidance can stay lightweight", "neutral");
    return {
      key: "weather",
      label: "Weather",
      score: 2,
      status: "not_applicable",
      summary: "Sea day - no ashore forecast needed.",
      flags,
    };
  }

  switch (state) {
    case "forecast_recent":
    case "forecast_available":
      addFlag(flags, "forecast", "Forecast available", "positive");
      if (weather?.snapshotType === "same_day") addFlag(flags, "same-day", "Same-day check captured", "positive");
      return {
        key: "weather",
        label: "Weather",
        score: 2,
        status: weather?.snapshotType === "same_day" ? "same_day_check_needed" : "ready",
        summary: weather?.snapshotType === "same_day" ? "Same-day guidance is available." : "Forecast guidance is available.",
        flags,
      };
    case "forecast_pending":
      addFlag(flags, "forecast-pending", "Forecast pending", "notice");
      return {
        key: "weather",
        label: "Weather",
        score: 0,
        status: "forecast_pending",
        summary: "Forecast pending - use seasonal guidance for now.",
        flags,
      };
    case "climate_expectation":
      addFlag(flags, "climate-only", "Climate only", "notice");
      return {
        key: "weather",
        label: "Weather",
        score: 0,
        status: "climate_only",
        summary: "Climate-only guidance is visible; forecast pending.",
        flags,
      };
    case "forecast_stale":
      addFlag(flags, "stale", "Needs refresh", "caution");
      return {
        key: "weather",
        label: "Weather",
        score: 1,
        status: "stale",
        summary: "Weather exists but needs refresh.",
        flags,
      };
    case "day_locked":
      addFlag(flags, "captured", "Observed or captured weather held locally", "neutral");
      return {
        key: "weather",
        label: "Weather",
        score: 1,
        status: "same_day_check_needed",
        summary: "Captured weather is held locally for this day.",
        flags,
      };
    case "historical_lookup_available":
      addFlag(flags, "historical", "Same-day check needed", "notice");
      return {
        key: "weather",
        label: "Weather",
        score: 1,
        status: "same_day_check_needed",
        summary: "A same-day check is still advisable.",
        flags,
      };
    case "missing_coordinates":
    default:
      addFlag(flags, "missing-weather", "Weather not added yet", "caution");
      return {
        key: "weather",
        label: "Weather",
        score: 0,
        status: "missing",
        summary: "Weather not added yet.",
        flags,
      };
  }
}

function assessPlan(day: ItineraryDayRecord, plans: readonly ShorePlanRecord[], selected?: ShorePlanRecord, backup?: ShorePlanRecord): ReadinessDimension {
  const flags: ReadinessFlag[] = [];

  if (isAshoreOptionalDay(day)) {
    addFlag(flags, "ship-day", "Ship day - no ashore plan required", "neutral");
    return {
      key: "plan",
      label: "Plan",
      score: 2,
      status: "not_applicable",
      summary: "No ashore plan required.",
      flags,
    };
  }

  if (!selected) {
    addFlag(flags, "no-selected-plan", "No selected plan", "critical");
    return {
      key: "plan",
      label: "Plan",
      score: 0,
      status: "missing",
      summary: "No selected shore plan.",
      flags,
    };
  }

  addFlag(flags, "selected-plan", "Selected plan ready", "positive");
  if (backup) addFlag(flags, "backup-plan", "Backup plan available", "positive");
  else addFlag(flags, "backup-missing", "Backup plan missing", "notice");

  if (selected.weatherDependency === "high") addFlag(flags, "weather-sensitive", "Weather-sensitive plan", "caution");
  if (selected.status === "idea" || selected.status === "shortlisted") addFlag(flags, "family-review", "Plan needs family review", "notice");

  const score: 0 | 1 | 2 =
    selected.status === "selected" || selected.status === "booked"
      ? backup
        ? 2
        : 1
      : 1;

  return {
    key: "plan",
    label: "Plan",
    score,
    status: score === 2 ? "ready" : "review_needed",
    summary:
      score === 2
        ? "Selected plan available, backup present."
        : selected.status === "selected" || selected.status === "booked"
          ? "Selected plan available, but backup is missing."
          : "Plan needs family review.",
    flags,
  };
}

function assessFamily(day: ItineraryDayRecord, guide: DayGuide | undefined, weather: WeatherSnapshot | undefined, selected?: ShorePlanRecord): ReadinessDimension {
  const flags: ReadinessFlag[] = [];
  const takeAshoreCount = guide?.checklist?.length ?? 0;
  const hasComfortNotes = Boolean(weather?.clothingGuidance || weather?.planImpact);
  const hasSebDiscovery = Boolean(guide?.sebDiscovery?.prompt || selected?.sebFitSummary);

  if (isAshoreOptionalDay(day)) {
    addFlag(flags, "ship-comfort", "This sea day does not need ashore readiness", "neutral");
    return {
      key: "family",
      label: "Family",
      score: 2,
      status: "not_applicable",
      summary: "This sea day does not need ashore readiness.",
      flags,
    };
  }

  if (takeAshoreCount > 0) addFlag(flags, "take-ashore", "Take ashore list ready", "positive");
  else addFlag(flags, "take-ashore-missing", "Take ashore list missing", "notice");

  if (hasComfortNotes) addFlag(flags, "comfort", "Heat or shade guidance available", "positive");
  else addFlag(flags, "comfort-missing", "Comfort notes missing", "notice");

  if (hasSebDiscovery) addFlag(flags, "seb-discovery", "Seb discovery ready", "positive");

  const positives = [takeAshoreCount > 0, hasComfortNotes, hasSebDiscovery].filter(Boolean).length;
  const score: 0 | 1 | 2 = positives >= 2 ? 2 : positives >= 1 ? 1 : 0;

  return {
    key: "family",
    label: "Family",
    score,
    status: score === 2 ? "ready" : score === 1 ? "review_needed" : "missing",
    summary:
      score === 2
        ? "Take ashore list and comfort notes are ready."
        : score === 1
          ? "Family comfort guidance is partial."
          : "Family comfort notes are missing.",
    flags,
  };
}

function assessTrust(day: ItineraryDayRecord, guide: DayGuide | undefined, weather: WeatherSnapshot | undefined, selected?: ShorePlanRecord): ReadinessDimension {
  const flags: ReadinessFlag[] = [];
  const confidenceSources = [day.confidence, guide?.confidence, weather?.confidence, selected?.confidence].filter(Boolean);
  const needsRefresh = confidenceSources.some((item) => item!.refreshRecommended || item!.reviewStatus === "needs_refresh" || item!.reviewStatus === "stale");
  const needsReview = confidenceSources.some((item) => item!.reviewStatus === "needs_user_review" || item!.reviewStatus === "not_reviewed");
  const lowConfidence = confidenceSources.some((item) => item!.confidence === "low" || item!.confidence === "inferred" || item!.confidence === "unknown");

  if (needsRefresh) addFlag(flags, "needs-refresh", "Needs refresh", "caution");
  if (needsReview) addFlag(flags, "needs-review", "Needs user review", "notice");
  if (lowConfidence) addFlag(flags, "inferred", "Inferred guidance", "notice");
  if (!needsRefresh && !needsReview && !lowConfidence) addFlag(flags, "trusted", "Verified day guide", "positive");

  const score: 0 | 1 | 2 = needsRefresh ? 1 : needsReview || lowConfidence ? 1 : 2;

  return {
    key: "trust",
    label: "Trust",
    score,
    status: needsRefresh ? "stale" : needsReview || lowConfidence ? "review_needed" : "ready",
    summary:
      needsRefresh
        ? "Weather or guide data needs refresh before travel."
        : needsReview || lowConfidence
          ? "Trust notes are visible and still need review."
          : "Reviewed guidance is visible.",
    flags,
  };
}

function collectNextActions(dimensions: readonly ReadinessDimension[]) {
  return dimensions
    .flatMap((dimension) =>
      dimension.flags
        .filter((flag) => flag.severity === "critical" || flag.severity === "caution")
        .map((flag) => flag.label),
    )
    .slice(0, 3);
}

function deriveStatus(score: number): DayReadinessStatus {
  if (score >= 8) return "ready_for_today";
  if (score >= 5) return "usable_with_cautions";
  if (score >= 3) return "needs_review";
  return "not_ready";
}

function deriveSeverity(status: DayReadinessStatus): ReadinessSeverity {
  switch (status) {
    case "ready_for_today":
      return "positive";
    case "usable_with_cautions":
      return "notice";
    case "needs_review":
      return "caution";
    default:
      return "critical";
  }
}

function deriveCruiseConditionStatus(weather: ReadinessDimension, plan: ReadinessDimension, timing: ReadinessDimension): CruiseConditionStatus {
  if (timing.status === "missing" || plan.status === "missing") return "missing";
  if (weather.status === "stale") return "stale";
  if (weather.status === "same_day_check_needed") return "same_day_check_needed";
  if (weather.status === "forecast_pending") return "forecast_pending";
  if (weather.status === "climate_only") return "climate_only";
  if (timing.status === "review_needed" || plan.status === "review_needed") return "review_needed";
  if (timing.status === "not_applicable" && plan.status === "not_applicable" && weather.status === "not_applicable") return "not_applicable";
  return "ready";
}

export function assessDayReadiness(input: DayReadinessInput): DayReadinessAssessment {
  const selected = selectedPlanForDay(input.day, input.plans);
  const backup = backupPlanForDay(input.day, input.plans, selected);
  const timing = assessTiming(input.day, input.guide, selected);
  const weather = assessWeather(input.day, input.weather, input.todayIso);
  const plan = assessPlan(input.day, input.plans, selected, backup);
  const family = assessFamily(input.day, input.guide, input.weather, selected);
  const trust = assessTrust(input.day, input.guide, input.weather, selected);
  const dimensions = [timing, weather, plan, family, trust] as const;
  const readinessScore = dimensions.reduce((total, item) => total + item.score, 0);
  const status =
    timing.status === "missing" || plan.status === "missing"
      ? readinessScore <= 2
        ? "not_ready"
        : "needs_review"
      : deriveStatus(readinessScore);
  const cruiseConditionStatus = deriveCruiseConditionStatus(weather, plan, timing);
  const nextActions = collectNextActions(dimensions);
  const summary =
    status === "ready_for_today"
      ? "Timing, plans and practical guidance look usable from local records."
      : status === "usable_with_cautions"
        ? "The day is usable, but one or two checks still matter."
        : status === "needs_review"
          ? "This day needs a practical review before travel."
          : "Core timing or plan details are still missing.";

  const confidence = input.weather?.confidence ?? input.guide?.confidence ?? input.day.confidence;
  return {
    status,
    statusLabel: formatReadinessLabel(status),
    severity: deriveSeverity(status),
    readinessScore,
    summary,
    cruiseConditionLabel: formatConditionLabel(cruiseConditionStatus),
    cruiseConditionStatus,
    timing,
    weather,
    plan,
    family,
    trust,
    nextActions,
    badges: Array.from(
      new Set(
        [timing, weather, plan, family, trust]
          .flatMap((dimension) => dimension.flags)
          .map((flag) => flag.label),
      ),
    ).slice(0, 3),
    metadata: {
      confidenceLevel: confidence?.confidence ?? "unknown",
      reviewStatus: confidence?.reviewStatus ?? "not_reviewed",
      refreshRecommended: Boolean(confidence?.refreshRecommended),
    },
  };
}

export function summariseCruiseConditions(input: {
  days: readonly { day: ItineraryDayRecord; title: string; readiness: DayReadinessAssessment }[];
  activeDayId?: string;
}): CruiseConditionsSummary {
  const readyDays = input.days.filter(({ readiness }) => readiness.status === "ready_for_today").length;
  const usableDays = input.days.filter(({ readiness }) => readiness.status !== "not_ready").length;
  const reviewDays = input.days.filter(({ readiness }) => readiness.status === "needs_review" || readiness.status === "usable_with_cautions").length;
  const notReadyDays = input.days.filter(({ readiness }) => readiness.status === "not_ready").length;
  const climateOnlyDays = input.days.filter(({ readiness }) => readiness.weather.status === "climate_only").length;
  const forecastPendingDays = input.days.filter(({ readiness }) => readiness.weather.status === "forecast_pending").length;
  const nextAttention = input.days.find(({ readiness }) => readiness.status !== "ready_for_today");
  const activeDay = input.activeDayId ? input.days.find(({ day }) => day.id === input.activeDayId) : input.days[0];

  return {
    readyDays,
    usableDays,
    reviewDays,
    notReadyDays,
    climateOnlyDays,
    forecastPendingDays,
    nextAttentionDay: nextAttention
      ? {
          dayId: nextAttention.day.id,
          title: nextAttention.title,
          reason: nextAttention.readiness.nextActions[0] ?? nextAttention.readiness.summary,
        }
      : undefined,
    activeDay: activeDay
      ? {
          dayId: activeDay.day.id,
          title: activeDay.title,
          statusLabel: activeDay.readiness.statusLabel,
        }
      : undefined,
  };
}
