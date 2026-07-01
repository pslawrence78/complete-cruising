import type { WeatherCardModel } from "../features/weather/weatherTypes";
import type { DayReadinessAssessment } from "../features/conditions/conditionTypes";

export type ItineraryDayType =
  | "embarkation"
  | "port"
  | "sea"
  | "disembarkation";

export type ItineraryAccent = "gold" | "aqua" | "coral" | "mist";
export type ItineraryStatusTone = "confirmed" | "review" | "refresh";
export type ItineraryConfidence =
  | "confirmed"
  | "high"
  | "medium"
  | "low"
  | "inferred"
  | "unknown";

export interface ItineraryDay {
  accent: ItineraryAccent;
  allAboardTime?: string;
  arrivalTime?: string;
  confidence: {
    label?: string;
    level: ItineraryConfidence;
  };
  weather?: Partial<WeatherCardModel>;
  country?: string;
  dateLabel: string;
  dayNumber: number;
  dayType: ItineraryDayType;
  departureTime?: string;
  enrichmentStatus: string;
  id: string;
  isHighlighted?: boolean;
  planSummary: string;
  portName?: string;
  readiness?: DayReadinessAssessment;
  refreshStatus: {
    label: string;
    tone: ItineraryStatusTone;
  };
  reviewStatus: {
    label: string;
    tone: ItineraryStatusTone;
  };
  title: string;
}

export interface ItineraryData {
  days: readonly ItineraryDay[];
  sailingName: string;
  summary: {
    days: number;
    disembarkation: string;
    embarkation: string;
    nights: number;
    ports: number;
    seaDays: number;
  };
}

export const sampleItineraryData = {
  sailingName: "Sun Princess Mediterranean 2026",
  summary: {
    days: 15,
    nights: 14,
    ports: 9,
    seaDays: 4,
    embarkation: "Civitavecchia / Rome",
    disembarkation: "Barcelona",
  },
  days: [
    {
      id: "day-01-civitavecchia",
      dayNumber: 1,
      title: "Civitavecchia / Rome",
      dateLabel: "August 2026 - date TBC",
      dayType: "embarkation",
      portName: "Civitavecchia",
      country: "Italy",
      planSummary: "Boarding day, ship orientation and the first family photo.",
      enrichmentStatus: "Embarkation guide started",
      confidence: { level: "medium" },
      weather: {
        state: "forecast_pending",
        stateLabel: "Forecast pending",
        badgeLabel: "Forecast pending",
        badgeTone: "review",
        summary: "Weather will become useful once the forecast window opens.",
        temperatureLabel: "Pending / Pending",
        rainLabel: "Rain pending",
        windLabel: "Wind pending",
        comfortSummary: "Comfort unknown until closer to travel.",
        clothingGuidance: "Pack flexible layers.",
        planImpact: "Forecast will matter later.",
        sourceLabel: "Open-Meteo",
        updatedLabel: "Not refreshed yet",
        refreshLabel: "Refresh recommended",
        refreshState: "ready",
        canRefresh: false,
      },
      reviewStatus: { label: "Needs booking review", tone: "review" },
      refreshStatus: { label: "Refresh before travel", tone: "refresh" },
      accent: "gold",
    },
    {
      id: "day-02-naples",
      dayNumber: 2,
      title: "Naples, Italy",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Naples",
      country: "Italy",
      arrivalTime: "07:00",
      departureTime: "18:30",
      allAboardTime: "17:30",
      planSummary:
        "Historic centre, harbour walk and proper Neapolitan pizza.",
      enrichmentStatus: "Cruise logistics started",
      confidence: { label: "Medium confidence", level: "medium" },
      weather: {
        state: "forecast_recent",
        stateLabel: "Forecast recent",
        badgeLabel: "29°C · rain 10%",
        badgeTone: "confirmed",
        summary: "Warm and bright",
        temperatureLabel: "29°C / 22°C",
        rainLabel: "10% rain",
        windLabel: "18 km/h · gusts 28 km/h",
        uvLabel: "UV 7",
        comfortSummary: "Warm port day · shade matters.",
        clothingGuidance: "Hats, water and shade breaks are worth packing.",
        planImpact: "Shade, water and comfortable shoes are important.",
        sourceLabel: "Open-Meteo forecast",
        updatedLabel: "Updated 20 Jun 2026, 09:00",
        refreshLabel: "Refresh cruise weather",
        refreshState: "updated",
        canRefresh: true,
      },
      reviewStatus: { label: "Needs family review", tone: "review" },
      refreshStatus: { label: "Times need confirmation", tone: "refresh" },
      accent: "coral",
      isHighlighted: true,
    },
    {
      id: "day-03-sea",
      dayNumber: 3,
      title: "At sea",
      dateLabel: "August 2026 - date TBC",
      dayType: "sea",
      planSummary:
        "Pool strategy, ship exploration and an evening show shortlist.",
      enrichmentStatus: "Ship-day notes drafted",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs family review", tone: "review" },
      refreshStatus: { label: "Static guidance", tone: "confirmed" },
      accent: "aqua",
    },
    {
      id: "day-04-chania",
      dayNumber: 4,
      title: "Souda Bay / Chania",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Souda Bay / Chania",
      country: "Crete, Greece",
      planSummary: "Old harbour and Chania old town orientation.",
      enrichmentStatus: "Port guide shell started",
      confidence: { level: "medium" },
      weather: {
        state: "forecast_pending",
        stateLabel: "Forecast pending",
        badgeLabel: "Forecast pending",
        badgeTone: "review",
        summary: "Forecasts become useful closer to sailing.",
        temperatureLabel: "Pending / Pending",
        rainLabel: "Rain pending",
        windLabel: "Wind pending",
        comfortSummary: "Comfort unknown until the weather window opens.",
        clothingGuidance: "Pack flexible layers.",
        planImpact: "Leave the detail for later.",
        sourceLabel: "Open-Meteo",
        updatedLabel: "Not refreshed yet",
        refreshLabel: "Refresh recommended",
        refreshState: "ready",
        canRefresh: false,
      },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Port times pending", tone: "refresh" },
      accent: "coral",
    },
    {
      id: "day-05-sea",
      dayNumber: 5,
      title: "At sea",
      dateLabel: "August 2026 - date TBC",
      dayType: "sea",
      planSummary: "Slower morning, ship guide review and family downtime.",
      enrichmentStatus: "Ship-day notes drafted",
      confidence: { level: "medium" },
      weather: {
        state: "forecast_pending",
        stateLabel: "Forecast pending",
        badgeLabel: "Forecast pending",
        badgeTone: "review",
        summary: "Forecasts become useful closer to sailing.",
        temperatureLabel: "Pending / Pending",
        rainLabel: "Rain pending",
        windLabel: "Wind pending",
        comfortSummary: "Comfort unknown until the weather window opens.",
        clothingGuidance: "Pack flexible layers.",
        planImpact: "Leave the detail for later.",
        sourceLabel: "Open-Meteo",
        updatedLabel: "Not refreshed yet",
        refreshLabel: "Refresh recommended",
        refreshState: "ready",
        canRefresh: false,
      },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Static guidance", tone: "confirmed" },
      accent: "aqua",
    },
    {
      id: "day-06-ephesus",
      dayNumber: 6,
      title: "Kusadasi / Ephesus",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Kusadasi / Ephesus",
      country: "T\u00fcrkiye",
      planSummary:
        "Ephesus history option with strong return discipline.",
      enrichmentStatus: "History options outlined",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs family review", tone: "review" },
      refreshStatus: { label: "Port times pending", tone: "refresh" },
      accent: "gold",
    },
    {
      id: "day-07-mykonos",
      dayNumber: 7,
      title: "Mykonos",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Mykonos",
      country: "Greece",
      planSummary:
        "Whitewashed lanes, harbour views and family-paced exploring.",
      enrichmentStatus: "Port guide shell started",
      confidence: { level: "medium" },
      weather: {
        state: "forecast_pending",
        stateLabel: "Forecast pending",
        badgeLabel: "Forecast pending",
        badgeTone: "review",
        summary: "Forecasts become useful closer to sailing.",
        temperatureLabel: "Pending / Pending",
        rainLabel: "Rain pending",
        windLabel: "Wind pending",
        comfortSummary: "Comfort unknown until the weather window opens.",
        clothingGuidance: "Pack flexible layers.",
        planImpact: "Leave the detail for later.",
        sourceLabel: "Open-Meteo",
        updatedLabel: "Not refreshed yet",
        refreshLabel: "Refresh recommended",
        refreshState: "ready",
        canRefresh: false,
      },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Port times pending", tone: "refresh" },
      accent: "mist",
    },
    {
      id: "day-08-athens",
      dayNumber: 8,
      title: "Athens / Piraeus",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Athens / Piraeus",
      country: "Greece",
      planSummary:
        "Acropolis decision point, with heat and walking watchouts.",
      enrichmentStatus: "Decision points outlined",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs family review", tone: "review" },
      refreshStatus: { label: "Weather refresh needed", tone: "refresh" },
      accent: "gold",
    },
    {
      id: "day-09-santorini",
      dayNumber: 9,
      title: "Santorini",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Santorini",
      country: "Greece",
      planSummary:
        "Tender and cable car risk awareness, views and photography.",
      enrichmentStatus: "Operational risks noted",
      confidence: { level: "medium" },
      weather: {
        state: "forecast_pending",
        stateLabel: "Forecast pending",
        badgeLabel: "Forecast pending",
        badgeTone: "review",
        summary: "Forecasts become useful closer to sailing.",
        temperatureLabel: "Pending / Pending",
        rainLabel: "Rain pending",
        windLabel: "Wind pending",
        comfortSummary: "Comfort unknown until the weather window opens.",
        clothingGuidance: "Pack flexible layers.",
        planImpact: "Leave the detail for later.",
        sourceLabel: "Open-Meteo",
        updatedLabel: "Not refreshed yet",
        refreshLabel: "Refresh recommended",
        refreshState: "ready",
        canRefresh: false,
      },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Tender status pending", tone: "refresh" },
      accent: "coral",
    },
    {
      id: "day-10-sea",
      dayNumber: 10,
      title: "At sea",
      dateLabel: "August 2026 - date TBC",
      dayType: "sea",
      planSummary: "Recovery day, onboard favourites and memory catch-up.",
      enrichmentStatus: "Ship-day notes drafted",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Static guidance", tone: "confirmed" },
      accent: "aqua",
    },
    {
      id: "day-11-bar",
      dayNumber: 11,
      title: "Bar, Montenegro",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Bar",
      country: "Montenegro",
      planSummary: "Lower-effort local exploration and scenery.",
      enrichmentStatus: "Port guide shell started",
      confidence: { level: "low" },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Port details pending", tone: "refresh" },
      accent: "mist",
    },
    {
      id: "day-12-corfu",
      dayNumber: 12,
      title: "Corfu",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Corfu",
      country: "Greece",
      planSummary: "Old town, fortress views and relaxed family wandering.",
      enrichmentStatus: "Port guide shell started",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Port times pending", tone: "refresh" },
      accent: "gold",
    },
    {
      id: "day-13-messina",
      dayNumber: 13,
      title: "Messina, Sicily",
      dateLabel: "August 2026 - date TBC",
      dayType: "port",
      portName: "Messina",
      country: "Italy",
      planSummary:
        "Sicily gateway, cathedral square and possible viewpoints.",
      enrichmentStatus: "Port guide shell started",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Port times pending", tone: "refresh" },
      accent: "coral",
    },
    {
      id: "day-14-sea",
      dayNumber: 14,
      title: "At sea",
      dateLabel: "August 2026 - date TBC",
      dayType: "sea",
      planSummary: "Final sea day, favourite venues and packing awareness.",
      enrichmentStatus: "Final sea-day notes drafted",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs review", tone: "review" },
      refreshStatus: { label: "Static guidance", tone: "confirmed" },
      accent: "aqua",
    },
    {
      id: "day-15-barcelona",
      dayNumber: 15,
      title: "Barcelona",
      dateLabel: "August 2026 - date TBC",
      dayType: "disembarkation",
      portName: "Barcelona",
      country: "Spain",
      planSummary:
        "Disembarkation, onward travel and Adventure Almanac memory export.",
      enrichmentStatus: "Onward-travel shell started",
      confidence: { level: "medium" },
      reviewStatus: { label: "Needs travel review", tone: "review" },
      refreshStatus: { label: "Refresh before travel", tone: "refresh" },
      accent: "gold",
    },
  ],
} satisfies ItineraryData;
