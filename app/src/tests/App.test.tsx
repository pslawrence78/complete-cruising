import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";
import { db } from "../db/completeCruisingDb";
import { ACTIVE_SAILING_SETTING, seedSampleData } from "../db/seedDatabase";
import { getSampleImport } from "../features/import-export/sampleImports";

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

  it("renders the dashboard from the real active sailing data", async () => {
    await renderRoute();
    expect(await screen.findByRole("heading", { level: 1, name: "Eastern Mediterranean Cruise" })).toBeInTheDocument();
    expect(screen.getByText(/Princess Cruises/)).toBeInTheDocument();
    expect(screen.getByText("7 / 7")).toBeInTheDocument();
    expect(screen.getByText("Live countdown from the local sailing date")).toBeInTheDocument();
    expect(screen.getAllByText("days to embarkation").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/terminal, all-aboard and port operations still need checking/i)).toBeInTheDocument();
  });

  it("renders all 15 real sailing itinerary days in order", async () => {
    await renderRoute("#/itinerary");
    const timeline = await screen.findByRole("region", { name: "Scrollable day-by-day itinerary" });
    const cards = within(timeline).getAllByRole("listitem");
    expect(cards).toHaveLength(15);
    expect(within(cards[0]).getByText("Civitavecchia")).toBeInTheDocument();
    expect(within(cards[14]).getByText("Barcelona")).toBeInTheDocument();
    expect(within(timeline).getAllByText("Onboard rhythm")).toHaveLength(4);
  });

  it("renders the real sailing preview Today record without fabricated all-aboard time", async () => {
    await renderRoute("#/today");
    expect(await screen.findByRole("heading", { level: 1, name: "Civitavecchia, Italy" })).toBeInTheDocument();
    expect(screen.getByText("Pre-cruise Today")).toBeInTheDocument();
    expect(screen.getByText(/Your cruise day companion is preparing for embarkation/)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2, name: /Pending/ }).length).toBeGreaterThan(0);
    expect(screen.getByText("Not set")).toBeInTheDocument();
    expect(screen.getByText("Forecast pending")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Worth opening next Explore the voyage route/ })).toBeInTheDocument();
  });

  it("loads the real sailing Today context and trust metadata", async () => {
    await renderRoute("#/today");
    const checklist = (await screen.findByRole("heading", { name: "Take ashore" })).closest("section")!;
    expect(within(checklist).queryAllByRole("checkbox")).toHaveLength(4);
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Euro")).toBeInTheDocument();
    expect(screen.getAllByText("Needs refresh").length).toBeGreaterThan(0);
  });

  it("renders Sun Princess and seven local handbook sections", async () => {
    await renderRoute("#/ship");
    expect(await screen.findByRole("heading", { level: 1, name: "Sun Princess" })).toBeInTheDocument();
    for (const heading of ["Identity and character", "Layout and orientation", "Dining", "Family and Seb suitability", "Pools and recreation", "Entertainment", "Tips and watchouts"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText(/Ship guidebook .* not sailing-specific/)).toBeInTheDocument();
  });

  it("renders the active sailing port guide without mixing in itinerary timings", async () => {
    await renderRoute("#/ports");
    expect(await screen.findByRole("heading", { level: 1, name: "Civitavecchia, Italy" })).toBeInTheDocument();
    expect(screen.getAllByText(/Reusable port guidebook .* not an itinerary day/).length).toBeGreaterThan(0);
  });

  it("shows a local-first empty state when real sailing shore plans are not prepared", async () => {
    await renderRoute("#/plans");
    expect(await screen.findByRole("heading", { name: "Guide pending." })).toBeInTheDocument();
    expect(screen.getByText("No local shore plans have been prepared for the selected day.")).toBeInTheDocument();
  });

  it("renders real sailing family guidance as reviewable placeholders", async () => {
    await renderRoute("#/family");
    expect(await screen.findByLabelText("Italy flag")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Not recorded" })).toBeInTheDocument();
    expect(screen.getByText("Choose one local detail to spot.")).toBeInTheDocument();
    expect(screen.getByText("Phrase meaning not yet enriched")).toBeInTheDocument();
  });

  it("renders the real sailing memories page without sample prompts", async () => {
    await renderRoute("#/memories");
    expect(await screen.findByRole("heading", { name: "Keep the feeling, not just the facts." })).toBeInTheDocument();
    expect(screen.getByText("No memories have been captured for this sailing. Your local journal is ready when you are.")).toBeInTheDocument();
    expect(screen.getAllByText(/Draft .* memories required/).length).toBeGreaterThan(0);
  });

  it("shows an on-brand empty state when the active sailing setting is missing", async () => {
    await renderRoute();
    await db.appSettings.where("key").equals(ACTIVE_SAILING_SETTING).delete();
    expect(await screen.findByRole("heading", { name: "Guide pending." })).toBeInTheDocument();
  });

  it("keeps navigation live after local loading completes", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    fireEvent.click(within(navigation).getByRole("button", { name: "Today" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Civitavecchia, Italy" })).toBeInTheDocument();
    expect(window.location.hash).toBe("#/today");
  });

  it("places guidebook routes before admin routes in primary navigation", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const labels = within(navigation).getAllByRole("button").map((button) => button.textContent);
    expect(labels.slice(0, 5)).toEqual(["Dashboard", "Today", "Itinerary", "Ports", "Ship"]);
    fireEvent.click(within(navigation).getByText("More"));
    expect(within(navigation).getByRole("button", { name: "Sailing Setup" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Guidebook Tools" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Import / Export" })).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Data Safety" })).toBeInTheDocument();
  });

  it("shows app-shell offline readiness and local update status", async () => {
    await renderRoute();
    const readiness = await screen.findByRole("region", { name: "Offline readiness" });
    expect(within(readiness).getByText("Connection")).toBeInTheDocument();
    expect(within(readiness).getByText("Online")).toBeInTheDocument();
    expect(within(readiness).getByText("Offline shell")).toBeInTheDocument();
    expect(within(readiness).getByText("Browser storage only")).toBeInTheDocument();
    expect(within(readiness).getByText("Last local update")).toBeInTheDocument();
    expect(await within(readiness).findByText("28 Jun 2026")).toBeInTheDocument();
  });

  it("renders the safe Import / Export workbench", async () => {
    await renderRoute("#/import-export");
    expect(await screen.findByRole("heading", { level: 1, name: "Import Control" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Import type" })).toBeInTheDocument();
    expect(screen.getByLabelText("Complete Cruising JSON")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Validate preview/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Export full backup" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export sailing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export Adventure Almanac draft" })).toBeInTheDocument();
  });

  it("shows helpful import errors while keeping commit gated", async () => {
    await renderRoute("#/import-export");
    fireEvent.change(screen.getByLabelText("Complete Cruising JSON"), { target: { value: '{ "kind":' } });
    fireEvent.click(screen.getByRole("button", { name: /Validate preview/ }));
    expect(await screen.findByRole("heading", { name: "Correct these before previewing" })).toBeInTheDocument();
    expect(screen.getByText("JSON could not be read")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Commit unavailable until preview is valid/ })).toBeDisabled();
  });

  it("requires protected confirmation before committing protected import data", async () => {
    await renderRoute("#/import-export");
    fireEvent.click(screen.getByRole("radio", { name: /Itinerary/ }));
    fireEvent.change(screen.getByLabelText("Complete Cruising JSON"), { target: { value: getSampleImport("itinerary") } });
    fireEvent.click(screen.getByRole("button", { name: /Validate preview/ }));

    expect(await screen.findByText("I understand this import will overwrite protected cruise data.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Protected confirmation required" })).toBeDisabled();
  });
});
