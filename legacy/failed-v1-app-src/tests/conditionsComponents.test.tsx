import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sampleDashboardData } from "../data/sampleDashboardData";
import { sampleItineraryData } from "../data/sampleItineraryData";
import { sampleTodayData } from "../data/sampleTodayData";
import { ConditionsSummaryCard } from "../features/conditions/ConditionsSummaryCard";
import { DayReadinessPanel } from "../features/conditions/DayReadinessPanel";
import { ItineraryDayCard } from "../features/itinerary/components/ItineraryDayCard";

describe("conditions components", () => {
  it("renders the Today day readiness panel", () => {
    render(<DayReadinessPanel readiness={sampleTodayData.readiness} />);

    expect(screen.getByRole("heading", { name: "Day readiness" })).toBeInTheDocument();
    expect(screen.getByText("Usable with cautions")).toBeInTheDocument();
    expect(screen.getByText(/Next actions/i)).toBeInTheDocument();
  });

  it("renders itinerary readiness badges", () => {
    render(
      <ItineraryDayCard
        day={{
          ...sampleItineraryData.days[1],
          readiness: sampleTodayData.readiness,
        }}
      />,
    );

    expect(screen.getByText("Usable with cautions")).toBeInTheDocument();
    expect(screen.getByText("Forecast pending")).toBeInTheDocument();
  });

  it("renders the dashboard conditions summary", () => {
    render(<ConditionsSummaryCard summary={sampleDashboardData.conditionsSummary} />);

    expect(screen.getByRole("heading", { name: "Conditions board" })).toBeInTheDocument();
    expect(screen.getByText(/8 of 15 days have usable readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/Next review:/i)).toBeInTheDocument();
  });
});
