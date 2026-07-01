import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

function renderAt(hash = "#/") {
  window.history.replaceState(null, "", hash);
  render(<App />);
}

describe("fresh-base app shell", () => {
  it("renders the dashboard hero by default", () => {
    renderAt();
    expect(screen.getByRole("heading", { name: "Sun Princess Mediterranean 2026" })).toBeInTheDocument();
    expect(screen.getByText(/Rome to Barcelona over 15 days/i)).toBeInTheDocument();
  });

  it("routes to Today", () => {
    renderAt("#/today");
    expect(screen.getByRole("heading", { name: "Civitavecchia / Rome" })).toBeInTheDocument();
    expect(screen.getByText("Pre-cruise Today")).toBeInTheDocument();
  });

  it("routes to Itinerary", () => {
    renderAt("#/itinerary");
    expect(screen.getByRole("heading", { name: "Voyage timeline" })).toBeInTheDocument();
    expect(screen.getByText("Day 15")).toBeInTheDocument();
  });

  it("routes to Ports", () => {
    renderAt("#/ports");
    expect(screen.getByRole("heading", { name: "Port postcards" })).toBeInTheDocument();
    expect(screen.getByText("Naples")).toBeInTheDocument();
  });

  it("routes to Ship", () => {
    renderAt("#/ship");
    expect(screen.getByRole("heading", { name: "Sun Princess" })).toBeInTheDocument();
    expect(screen.getByText("Identity and character")).toBeInTheDocument();
  });

  it("routes to Plans", () => {
    renderAt("#/plans");
    expect(screen.getByRole("heading", { name: "Selected and backup options" })).toBeInTheDocument();
    expect(screen.getByText("Harbour rhythm and one city story")).toBeInTheDocument();
  });

  it("routes to Memories", () => {
    renderAt("#/memories");
    expect(screen.getByRole("heading", { name: "Daily prompts, not a heavy journal" })).toBeInTheDocument();
    expect(screen.getByText(/What first detail made the ship feel real/i)).toBeInTheDocument();
  });

  it("routes to About", () => {
    renderAt("#/about");
    expect(screen.getByRole("heading", { name: "Static, local-first and cruise-stable" })).toBeInTheDocument();
    expect(screen.getByText(/Confirm against Princess and booking documents/i)).toBeInTheDocument();
  });

  it("navigates between routes from the fresh nav", () => {
    renderAt();
    fireEvent.click(screen.getByRole("button", { name: "Ports" }));
    expect(window.location.hash).toBe("#/ports");
  });
});
