import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";
import { db } from "../db/completeCruisingDb";
import { ACTIVE_SAILING_SETTING, seedSampleData } from "../db/seedDatabase";

async function renderRoute(hash = "#/") {
  window.history.replaceState(null, "", hash);
  render(<App />);
  await screen.findByRole("navigation", { name: "Primary navigation" });
}

describe("data-driven application screens", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
    await seedSampleData();
    window.history.replaceState(null, "", "#/");
  });

  it("renders the dashboard from seeded local sailing data", async () => {
    await renderRoute();
    expect(await screen.findByRole("heading", { level: 1, name: "Sun Princess Mediterranean 2026" })).toBeInTheDocument();
    expect(screen.getByText(/Princess Cruises/)).toBeInTheDocument();
    expect(screen.getByText("7 / 7")).toBeInTheDocument();
    expect(screen.getByText("Calculated from the local sailing date")).toBeInTheDocument();
  });

  it("renders all 15 local itinerary days in order", async () => {
    await renderRoute("#/itinerary");
    const timeline = await screen.findByRole("region", { name: "Scrollable day-by-day itinerary" });
    const cards = within(timeline).getAllByRole("listitem");
    expect(cards).toHaveLength(15);
    expect(within(cards[0]).getByText("Civitavecchia")).toBeInTheDocument();
    expect(within(cards[14]).getByText("Barcelona")).toBeInTheDocument();
    expect(within(timeline).getAllByText("At sea")).toHaveLength(4);
  });

  it("renders the selected Naples Today record with a prominent all-aboard time", async () => {
    await renderRoute("#/today");
    expect(await screen.findByRole("heading", { level: 1, name: "Naples, Italy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "17:30" })).toBeInTheDocument();
    expect(screen.getByText("16:45")).toBeInTheDocument();
    expect(screen.getByText("Warm and dry")).toBeInTheDocument();
  });

  it("loads the local take-ashore list, context and trust metadata", async () => {
    await renderRoute("#/today");
    const checklist = (await screen.findByRole("heading", { name: "Take ashore" })).closest("section")!;
    expect(within(checklist).getAllByRole("checkbox")).toHaveLength(9);
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Euro (EUR)")).toBeInTheDocument();
    expect(screen.getAllByText("Needs refresh").length).toBeGreaterThan(0);
  });

  it("renders Sun Princess and seven local handbook sections", async () => {
    await renderRoute("#/ship");
    expect(await screen.findByRole("heading", { level: 1, name: "Sun Princess" })).toBeInTheDocument();
    for (const heading of ["Identity and character", "Layout and orientation", "Dining", "Family and Seb suitability", "Pools and recreation", "Entertainment", "Tips and watchouts"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText("Ship guidebook · not sailing-specific")).toBeInTheDocument();
  });

  it("renders Naples and four separately stored attractions", async () => {
    await renderRoute("#/ports");
    expect(await screen.findByRole("heading", { level: 1, name: "Naples, Italy" })).toBeInTheDocument();
    const highlights = screen.getByRole("region", { name: "Four possible Naples stories." });
    expect(within(highlights).getAllByRole("article")).toHaveLength(4);
    expect(within(highlights).getByRole("heading", { name: "Pompeii" })).toBeInTheDocument();
    expect(screen.getAllByText("Reusable port guidebook · not an itinerary day").length).toBeGreaterThan(0);
  });

  it("renders three comparable local Naples shore plans", async () => {
    await renderRoute("#/plans");
    expect(await screen.findByRole("heading", { name: "3 ways to meet Naples." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Stories, volcanoes and pizza" })).toBeInTheDocument();
    expect(screen.getByText("Selected recommendation")).toBeInTheDocument();
    expect(screen.getAllByText("Refresh before sailing")).toHaveLength(3);
  });

  it("renders local family discovery content", async () => {
    await renderRoute("#/family");
    expect(await screen.findByLabelText("Italy flag")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Buongiorno" })).toBeInTheDocument();
    expect(screen.getByText(/Which ancient Roman town/)).toBeInTheDocument();
    expect(screen.getByText("Pompeii.")).toBeInTheDocument();
  });

  it("renders illustrative local memory entries without implying completed travel", async () => {
    await renderRoute("#/memories");
    expect(await screen.findByRole("heading", { name: "Keep the feeling, not just the facts." })).toBeInTheDocument();
    expect(screen.getByText("Seb Favourite")).toBeInTheDocument();
    expect(screen.getByText("Family Highlight")).toBeInTheDocument();
    expect(screen.getByText(/not a recorded family answer/i)).toBeInTheDocument();
    expect(screen.getAllByText("Draft preview · memories required").length).toBeGreaterThan(0);
  });

  it("shows an on-brand empty state when the active sailing setting is missing", async () => {
    await renderRoute();
    await db.appSettings.where("key").equals(ACTIVE_SAILING_SETTING).delete();
    expect(await screen.findByRole("heading", { name: "No local sailing data found yet." })).toBeInTheDocument();
  });

  it("keeps navigation live after local loading completes", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    fireEvent.click(within(navigation).getByRole("button", { name: "Today" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Naples, Italy" })).toBeInTheDocument();
    expect(window.location.hash).toBe("#/today");
  });

  it("renders the preview-only Import / Export workbench", async () => {
    await renderRoute("#/import-export");
    expect(await screen.findByRole("heading", { level: 1, name: "Import Preview" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Import type" })).toBeInTheDocument();
    expect(screen.getByLabelText("Complete Cruising JSON")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Validate preview/ })).toBeDisabled();
    expect(screen.getByText("Nothing is committed")).toBeInTheDocument();
  });

  it("shows helpful import errors without exposing a commit action", async () => {
    await renderRoute("#/import-export");
    fireEvent.change(screen.getByLabelText("Complete Cruising JSON"), { target: { value: '{ "kind":' } });
    fireEvent.click(screen.getByRole("button", { name: /Validate preview/ }));
    expect(await screen.findByRole("heading", { name: "Correct these before previewing" })).toBeInTheDocument();
    expect(screen.getByText("JSON could not be read")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Commit import/ })).toBeDisabled();
  });
});
