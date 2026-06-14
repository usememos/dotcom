import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScratchpadSection } from "./home-scratchpad-section";

describe("HomeScratchpadSection", () => {
  it("renders the heading and the feature list", () => {
    render(<HomeScratchpadSection />);
    expect(screen.getByRole("heading", { name: "Type. Save. Done." })).toBeInTheDocument();
    expect(screen.getByText("Works entirely in your browser—no account needed")).toBeInTheDocument();
    expect(screen.getByText("Drag-and-drop interface for quick organization")).toBeInTheDocument();
    expect(screen.getByText("Supports text notes and file attachments")).toBeInTheDocument();
    expect(screen.getByText("Optional sync to your self-hosted Memos instance")).toBeInTheDocument();
  });

  it("links to the scratchpad", () => {
    render(<HomeScratchpadSection />);
    expect(screen.getByRole("link", { name: /Launch Scratchpad/ })).toHaveAttribute("href", "/scratchpad");
  });
});
