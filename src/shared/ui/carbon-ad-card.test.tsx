import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CarbonAdCard } from "./carbon-ad-card";

// With no carbon ad loaded (the jsdom default), the component renders its sponsor
// fallback. The default variant should size to its content (padding) rather than a
// fixed height, so the surrounding layout stays compact.
describe("CarbonAdCard", () => {
  it("default fallback uses content-driven spacing, not a fixed height", () => {
    render(<CarbonAdCard />);

    const region = screen.getByRole("complementary", { name: "Sponsored content" });
    expect(region.className).toMatch(/\bpy-2\b/);
    expect(region.className).not.toMatch(/\bh-\d/);

    const link = screen.getByRole("link", { name: "Support Memos" });
    expect(link).toHaveAttribute("href", "https://github.com/sponsors/usememos");
    expect(link.className).toMatch(/\bleading-5\b/);
  });
});
