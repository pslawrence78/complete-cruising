import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the Ocean Luxe shell and its trust language", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "App shell ready." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your sailing, fully understood."),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Sun Princess Mediterranean 2026"),
    ).toHaveLength(2);
    expect(screen.getByText("Reviewed")).toBeInTheDocument();
    expect(screen.getByText("Needs refresh")).toBeInTheDocument();
    expect(screen.getByText("High confidence")).toBeInTheDocument();
    expect(
      screen.getByText(/Final sailing details should be confirmed/),
    ).toBeInTheDocument();
  });

  it("exposes route-ready navigation placeholders", () => {
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    [
      "Dashboard",
      "Itinerary",
      "Today",
      "Ports",
      "Ship",
      "Plans",
      "Family",
      "Memories",
      "Import / Export",
    ].forEach((label) => {
      expect(
        within(navigation).getByRole("button", { name: label }),
      ).toBeInTheDocument();
    });
  });
});
