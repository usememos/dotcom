import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketingActions } from "./marketing-page";
import { StartSection } from "./start-section";

describe("product references", () => {
  it("ends with useful links without a repeated product pitch or composer", () => {
    const { container } = render(<StartSection />);
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: "Demo" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector("textarea, button, [contenteditable]")).toBeNull();
    expect(container.textContent).not.toMatch(/install|start with|try now/i);
  });

  it("keeps focus and external-link behavior for quiet links on inverse surfaces", () => {
    render(<MarketingActions tone="inverse" actions={[{ label: "Source code", href: "https://github.com/usememos/memos" }]} />);
    const link = screen.getByRole("link", { name: "Source code" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("text-white", "focus-visible:outline-2", "min-h-10");
    expect(link).not.toHaveClass("bg-white");
  });
});
