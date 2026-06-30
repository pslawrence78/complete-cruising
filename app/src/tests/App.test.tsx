import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { db } from "../db/completeCruisingDb";
import { ACTIVE_SAILING_SETTING, seedSampleData } from "../db/seedDatabase";
import { commitGuidePack, createGuidePackPreview } from "../features/guide-loader/guidePackService";
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
    expect(await screen.findByRole("heading", { name: "Voyage map context" })).toBeInTheDocument();
    expect(screen.getByText(/Voyage context line - visual sequence, not navigational routing/i)).toBeInTheDocument();
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
    expect(screen.getByRole("heading", { name: "Today's port orientation" })).toBeInTheDocument();
    expect(screen.getByText("Today's port orientation will appear here when the sailing is active.")).toBeInTheDocument();
    expect(screen.getByText(/Your cruise day companion is preparing for embarkation/)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2, name: /Pending/ }).length).toBeGreaterThan(0);
    expect(screen.getByText("Not set")).toBeInTheDocument();
    expect(screen.getByText("Weather and comfort")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Worth opening next Explore the voyage route/ })).toBeInTheDocument();
  });

  it("loads the real sailing Today context and trust metadata", async () => {
    await renderRoute("#/today");
    const checklist = (await screen.findByRole("heading", { name: "Take ashore" })).closest("section")!;
    expect(within(checklist).queryAllByRole("checkbox")).toHaveLength(4);
    expect(screen.getAllByText("Italian").length).toBeGreaterThan(0);
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
    expect(screen.getByRole("heading", { name: "Cartographic Port Atlas" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Where Civitavecchia sits" })).toBeInTheDocument();
    expect(screen.getAllByText(/OpenFreeMap/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Reusable port guidebook .* not an itinerary day/).length).toBeGreaterThan(0);
  });

  it("does not request browser geolocation for atlas surfaces", async () => {
    const geolocation = { getCurrentPosition: vi.fn(), watchPosition: vi.fn(), clearWatch: vi.fn() };
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: geolocation });
    await renderRoute("#/ports");
    await screen.findByRole("heading", { name: "Cartographic Port Atlas" });
    expect(geolocation.getCurrentPosition).not.toHaveBeenCalled();
    expect(geolocation.watchPosition).not.toHaveBeenCalled();
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
    expect(labels.slice(0, 6)).toEqual(["Dashboard", "Today", "Itinerary", "Ports", "Ship", "Plans"]);
    fireEvent.click(within(navigation).getByText("More"));
    expect(within(navigation).getByRole("menuitem", { name: "Guide Loader" })).toBeInTheDocument();
    expect(within(navigation).getByRole("menuitem", { name: "Backstage" })).toBeInTheDocument();
  });

  it("closes the desktop More menu after selecting a route", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const moreButton = within(navigation).getByRole("button", { name: "More" });

    fireEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(within(navigation).getByRole("menuitem", { name: "Plans" }));

    expect(await screen.findByRole("heading", { name: "Guide pending." })).toBeInTheDocument();
    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the desktop More menu when Escape is pressed", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const moreButton = within(navigation).getByRole("button", { name: "More" });

    fireEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the desktop More menu on outside click", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const moreButton = within(navigation).getByRole("button", { name: "More" });

    fireEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(document.body);

    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the desktop More menu when the hash route changes", async () => {
    await renderRoute();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    const moreButton = within(navigation).getByRole("button", { name: "More" });

    fireEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    window.history.replaceState(null, "", "#/weather-review");
    fireEvent(window, new HashChangeEvent("hashchange"));

    expect(window.location.hash).toBe("#/weather-review");
    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the mobile More menu and keeps its items reachable", async () => {
    await renderRoute();
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    const moreButton = within(mobileNavigation).getByRole("button", { name: "More" });

    fireEvent.click(moreButton);

    const moreMenu = screen
      .getAllByRole("menu")
      .find((menu) => menu.className.includes("mobile-navigation__more-menu"));

    expect(moreMenu).toBeDefined();
    expect(moreButton).toHaveAttribute("aria-expanded", "true");
    expect(moreMenu).toHaveAttribute("data-open", "true");
    expect(within(moreMenu!).getByRole("menuitem", { name: "Ship" })).toBeInTheDocument();
    expect(within(moreMenu!).getByRole("menuitem", { name: "Backstage" })).toBeInTheDocument();
  });

  it("closes the mobile More menu after selecting a route", async () => {
    await renderRoute();
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    const moreButton = within(mobileNavigation).getByRole("button", { name: "More" });

    fireEvent.click(moreButton);
    const moreMenu = screen
      .getAllByRole("menu")
      .find((menu) => menu.className.includes("mobile-navigation__more-menu"));

    expect(moreMenu).toBeDefined();
    fireEvent.click(within(moreMenu!).getByRole("menuitem", { name: "Ship" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Sun Princess" })).toBeInTheDocument();
    expect(moreButton).toHaveAttribute("aria-expanded", "false");
    expect(moreMenu).toHaveAttribute("data-open", "false");
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

  it("renders the simpler Guide Loader with technical details collapsed by default", async () => {
    await renderRoute("#/guide-loader");
    expect(await screen.findByRole("heading", { level: 1, name: /Bring guide content in without opening the whole workshop/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Guide pack JSON")).toBeInTheDocument();
    expect(screen.getByText("Guide Loader")).toBeInTheDocument();
    expect(screen.getByText("Show technical details").closest("details")).not.toHaveAttribute("open");
  });

  it("groups advanced routes under Backstage / Data tools", async () => {
    await renderRoute("#/backstage");
    expect(await screen.findByRole("heading", { level: 1, name: /Technical controls, quietly off the main stage/i })).toBeInTheDocument();
    expect(screen.getByText("Weather Review")).toBeInTheDocument();
    expect(screen.getByText("Import / Export")).toBeInTheDocument();
    expect(screen.getByText("Prompt Studio")).toBeInTheDocument();
    expect(screen.getByText("Data Safety")).toBeInTheDocument();
  });

  it("keeps weather refresh buttons off the calmer main routes", async () => {
    await renderRoute("#/today");
    expect(screen.queryByRole("button", { name: "Refresh weather" })).not.toBeInTheDocument();

    window.history.replaceState(null, "", "#/itinerary");
    fireEvent(window, new HashChangeEvent("hashchange"));
    await screen.findByRole("heading", { name: "Voyage map context" });
    expect(screen.queryByRole("button", { name: "Refresh weather" })).not.toBeInTheDocument();

    window.history.replaceState(null, "", "#/ports");
    fireEvent(window, new HashChangeEvent("hashchange"));
    await screen.findByRole("heading", { name: "Cartographic Port Atlas" });
    expect(screen.queryByRole("button", { name: "Refresh weather" })).not.toBeInTheDocument();
  });

  it("shows imported port guide content on the normal Ports route", async () => {
    const guidePack = {
      schema: "complete-cruising-guide-pack-v1",
      schemaVersion: 1,
      createdAt: "2026-06-30T10:00:00.000Z",
      source: "ChatGPT",
      target: {
        type: "port",
        id: "port-civitavecchia",
        name: "Civitavecchia",
        portName: "Civitavecchia",
      },
      guide: {
        title: "Civitavecchia harbour rhythm",
        shortSummary: "A calmer port-day opener for the Rome gateway.",
        sections: [
          {
            sectionType: "highlights",
            title: "Best first hour ashore",
            shortSummary: "Start with the harbour edge and keep Rome ambitions realistic.",
          },
        ],
      },
      metadata: {
        confidence: "medium",
        reviewStatus: "needs_user_review",
        refreshRecommended: true,
        sourceTypesUsed: ["generated"],
      },
    };

    const preview = await createGuidePackPreview(JSON.stringify(guidePack), { kind: "port", id: "port-civitavecchia" });
    await commitGuidePack(preview);

    await renderRoute("#/ports");
    expect(await screen.findByRole("heading", { name: "Best first hour ashore" })).toBeInTheDocument();
  });

  it("shows imported ship guide content on the normal Ship route", async () => {
    const guidePack = {
      schema: "complete-cruising-guide-pack-v1",
      schemaVersion: 1,
      createdAt: "2026-06-30T10:00:00.000Z",
      source: "ChatGPT",
      target: {
        type: "ship",
        id: "ship-sun-princess",
        name: "Sun Princess",
      },
      guide: {
        title: "Sun Princess quiet corners",
        shortSummary: "A quick family guide to finding calmer spaces on board.",
        sections: [
          {
            sectionType: "practical_tips",
            title: "Calmer corners",
            shortSummary: "Learn one indoor fallback and one outer-deck retreat early.",
          },
        ],
      },
      metadata: {
        confidence: "medium",
        reviewStatus: "needs_user_review",
        refreshRecommended: true,
        sourceTypesUsed: ["generated"],
      },
    };

    const preview = await createGuidePackPreview(JSON.stringify(guidePack), { kind: "ship", id: "ship-sun-princess" });
    await commitGuidePack(preview);

    await renderRoute("#/ship");
    expect(await screen.findByRole("heading", { name: "Calmer corners" })).toBeInTheDocument();
  });
});
