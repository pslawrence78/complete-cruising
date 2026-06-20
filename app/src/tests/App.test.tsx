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

  it("links implemented dashboard actions and keeps later routes clearly marked", () => {
    render(<App />);

    expect(
      screen.getByRole("link", { name: /View today/i }),
    ).toHaveAttribute("href", "#/today");
    expect(
      screen.getByRole("link", { name: /Explore itinerary/i }),
    ).toHaveAttribute("href", "#/itinerary");
    expect(
      screen.getByRole("link", { name: /Open ship guide/i }),
    ).toHaveAttribute("href", "#/ship");
    expect(
      screen.getByRole("link", { name: /Open Naples guide/i }),
    ).toHaveAttribute("href", "#/ports");

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
    ).toHaveAttribute("aria-disabled", "false");
    expect(
      within(navigation).getByRole("button", { name: "Ship" }),
    ).toHaveAttribute("aria-disabled", "false");
    expect(
      within(navigation).getByRole("button", { name: "Ports" }),
    ).toHaveAttribute("aria-disabled", "false");
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

  it("opens the operational Today view through shell navigation", () => {
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    fireEvent.click(within(navigation).getByRole("button", { name: "Today" }));

    expect(window.location.hash).toBe("#/today");
    expect(
      screen.getByRole("heading", { level: 1, name: "Naples, Italy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "17:30" }),
    ).toBeInTheDocument();
    expect(screen.getByText("16:45")).toBeInTheDocument();
    expect(screen.getByText("Warm and dry")).toBeInTheDocument();
    expect(
      screen.getByText(/Illustrative forecast - refresh closer to travel/),
    ).toBeInTheDocument();
  });

  it("provides a temporary mobile-friendly checklist and local context", () => {
    window.history.replaceState(null, "", "#/today");
    render(<App />);

    const checklist = screen.getByRole("heading", { name: "Take ashore" })
      .closest("section");
    const checkboxes = within(checklist as HTMLElement).getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(9);
    expect(checkboxes[0]).not.toBeChecked();
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Euro (€)")).toBeInTheDocument();
    expect(screen.getByText("Buongiorno")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Confidence and refresh notes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Terminal details")).toBeInTheDocument();
  });

  it("opens the premium ship handbook through shell navigation", () => {
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    fireEvent.click(within(navigation).getByRole("button", { name: "Ship" }));

    expect(window.location.hash).toBe("#/ship");
    expect(
      screen.getByRole("heading", { level: 1, name: "Sun Princess" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A useful first bearing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Enrichment status" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ship guidebook · not sailing-specific"),
    ).toBeInTheDocument();
  });

  it("shows all seven illustrative ship sections with visible trust state", () => {
    window.history.replaceState(null, "", "#/ship");
    render(<App />);

    [
      "Identity and character",
      "Layout and orientation",
      "Dining",
      "Family and Seb suitability",
      "Pools and recreation",
      "Entertainment",
      "Tips and watchouts",
    ].forEach((heading) => {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    });

    expect(screen.getAllByText("Reviewed sample")).toHaveLength(2);
    expect(screen.getAllByText("Medium confidence").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Refresh before sailing").length).toBeGreaterThan(0);
    expect(screen.getByText(/Illustrative sample only/)).toBeInTheDocument();
  });

  it("opens the Naples port guide through shell navigation", () => {
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    fireEvent.click(within(navigation).getByRole("button", { name: "Ports" }));

    expect(window.location.hash).toBe("#/ports");
    expect(
      screen.getByRole("heading", { level: 1, name: "Naples, Italy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Euro (€)")).toBeInTheDocument();
    expect(
      screen.getAllByText("Reusable port guidebook · not an itinerary day"),
    ).toHaveLength(2);
  });

  it("separates attraction ideas and keeps port uncertainty visible", () => {
    window.history.replaceState(null, "", "#/ports");
    render(<App />);

    expect(screen.getByRole("heading", { name: "Cruise logistics" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Getting around" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Food and culture" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A family day with room to breathe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A frame worth waiting for" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hints and watchouts" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Useful now. Authoritative later." })).toBeInTheDocument();

    const highlights = screen.getByRole("region", {
      name: "Four possible Naples stories.",
    });
    expect(within(highlights).getAllByRole("article")).toHaveLength(4);
    expect(within(highlights).getByRole("heading", { name: "Pompeii" })).toBeInTheDocument();
    expect(within(highlights).getAllByText("Requirements unknown")).toHaveLength(2);

    expect(screen.getAllByText("Needs refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Medium confidence").length).toBeGreaterThan(0);
    expect(screen.getByText(/No berth, terminal, transport/)).toBeInTheDocument();
    expect(screen.queryByText("17:30")).not.toBeInTheDocument();
  });
});
