import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
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

  it("keeps unfinished dashboard actions and routes clearly marked", () => {
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
    ).toHaveAttribute("aria-disabled", "true");
  });
});
