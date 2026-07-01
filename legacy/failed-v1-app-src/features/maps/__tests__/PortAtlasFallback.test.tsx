import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortAtlasFallback } from "../PortAtlasFallback";
import { PortAtlasMap } from "../PortAtlasMap";

describe("Port atlas fallback", () => {
  it("renders a polished missing-coordinate state with useful metadata", () => {
    render(
      <PortAtlasFallback
        metadata={{ country: "Italy", currency: "Euro (EUR)", language: "Italian", reviewStatus: "Needs User Review" }}
        title="Naples"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Map position pending");
    expect(screen.getByText(/Guidebook content is still available below/i)).toBeInTheDocument();
    expect(screen.getByText("Italy")).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
  });

  it("shows provider attribution when the map falls back for missing coordinates", () => {
    render(
      <PortAtlasMap
        points={[{ id: "port-without-geo", label: "Port without coordinates" }]}
        title="Cartographic Port Atlas"
      />,
    );

    expect(screen.getByText("Map position pending")).toBeInTheDocument();
    expect(screen.getByText("OpenFreeMap and OpenStreetMap contributors")).toBeInTheDocument();
  });
});
