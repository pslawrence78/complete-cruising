import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the Complete Cruising scaffold", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Complete Cruising" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Application scaffold ready.")).toBeInTheDocument();
  });
});
