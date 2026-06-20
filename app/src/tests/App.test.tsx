import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "#/");
  });

  it("renders the Ocean Luxe dashboard from illustrative sailing data", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Sun Princess Mediterranean 2026",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Princess Cruises/)).toBeInTheDocument();
    expect(
      screen.getByText(
        "A personalised guide to every port, plan and possibility.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("3 / 8")).toBeInTheDocument();
    expect(
      screen.getByText(/Final sailing details should be confirmed/),
    ).toBeInTheDocument();
  });

  it("renders the complete representative route in a contained region", () => {
    render(<App />);

    const route = screen.getByRole("region", {
      name: "Scrollable illustrative sailing route",
    });

    expect(within(route).getAllByRole("listitem")).toHaveLength(15);
    expect(within(route).getByText("Civitavecchia / Rome")).toBeInTheDocument();
    expect(within(route).getByText("Barcelona")).toBeInTheDocument();
    expect(within(route).getAllByText("Sea Day")).toHaveLength(4);
  });

  it("shows voyage readiness, confidence and family focus", () => {
    render(<App />);

    [
      "Naples, Italy",
      "Forecasts pending",
      "Readiness, without private data",
      "Trust stays visible",
      "Seb discovery prompts ready",
      "Daily reflections prepared",
    ].forEach((heading) => {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    });

    expect(screen.getByText("Needs refresh")).toBeInTheDocument();
    expect(screen.getAllByText("Medium confidence").length).toBeGreaterThan(0);
    expect(screen.getByText("Ready to capture")).toBeInTheDocument();
  });

  it("keeps unfinished dashboard actions and later routes clearly marked", () => {
    render(<App />);

    ["View today", "Explore itinerary", "Open ship guide"].forEach((label) => {
      expect(
        screen.getByRole("button", { name: new RegExp(label, "i") }),
      ).toHaveAttribute("aria-disabled", "true");
    });

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    expect(
      within(navigation).getByRole("button", { name: "Dashboard" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(navigation).getByRole("button", { name: "Itinerary" }),
    ).toHaveAttribute("aria-disabled", "false");
    expect(
      within(navigation).getByRole("button", { name: "Today" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("opens the complete itinerary through lightweight shell navigation", () => {
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    fireEvent.click(
      within(navigation).getByRole("button", { name: "Itinerary" }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Fifteen days\. One Mediterranean story\./,
      }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe("#/itinerary");

    const timeline = screen.getByRole("region", {
      name: "Scrollable day-by-day itinerary",
    });

    expect(within(timeline).getAllByRole("listitem")).toHaveLength(15);
    expect(within(timeline).getAllByText("At sea")).toHaveLength(4);

    const naplesHeading = within(timeline).getByRole("heading", {
      name: "Naples, Italy",
    });
    const naplesCard = naplesHeading.closest("article");

    expect(naplesCard).toHaveAttribute("aria-current", "step");
    expect(within(naplesCard as HTMLElement).getByText("07:00")).toBeInTheDocument();
    expect(within(naplesCard as HTMLElement).getByText("18:30")).toBeInTheDocument();
    expect(within(naplesCard as HTMLElement).getByText("17:30")).toBeInTheDocument();
    expect(
      within(naplesCard as HTMLElement).getByText("Times need confirmation"),
    ).toBeInTheDocument();
  });

  it("supports direct itinerary hashes and a return to Dashboard", () => {
    window.history.replaceState(null, "", "#/itinerary");
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Day and trust language" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Embarkation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Disembarkation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Refresh before travel").length).toBeGreaterThan(0);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    fireEvent.click(
      within(navigation).getByRole("button", { name: "Dashboard" }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Sun Princess Mediterranean 2026",
      }),
    ).toBeInTheDocument();
  });
});
