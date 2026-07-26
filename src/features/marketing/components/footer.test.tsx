import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";

vi.mock("@/features/account/components/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme controls</div>,
}));

describe("Footer", () => {
  it.each([{ compact: false }, { compact: true }])("keeps the theme controls in the footer", ({ compact }) => {
    render(<Footer compact={compact} />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
