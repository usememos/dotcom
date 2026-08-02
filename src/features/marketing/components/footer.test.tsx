import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";

vi.mock("@/shared/ui/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme controls</div>,
}));

describe("Footer", () => {
  it.each([{ compact: false }, { compact: true }])("keeps the theme controls in the footer", ({ compact }) => {
    render(<Footer compact={compact} />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("places the API reference in Resources", () => {
    render(<Footer />);

    const resources = screen.getByRole("heading", { name: "Resources" }).parentElement;
    const tools = screen.getByRole("heading", { name: "Tools" }).parentElement;

    expect(resources).not.toBeNull();
    expect(tools).not.toBeNull();
    expect(within(resources as HTMLElement).getByRole("link", { name: "API Reference" })).toHaveAttribute("href", "/docs/api");
    expect(within(tools as HTMLElement).queryByRole("link", { name: "API Reference" })).not.toBeInTheDocument();
  });
});
