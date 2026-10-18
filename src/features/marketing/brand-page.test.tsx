import { existsSync, readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandPage from "@/app/(public)/(site)/brand/page";
import { BRAND_ASSETS_PATH, BRAND_AVATAR_PALETTES } from "@/shared/lib/brand-assets";

describe("brand asset catalog", () => {
  it("offers all five official SVGs, both previews, and every avatar", () => {
    const { container } = render(<BrandPage />);
    expect(screen.getByRole("link", { name: "Download SVG — Standard logo" })).toHaveAttribute("href", `${BRAND_ASSETS_PATH}/mark.svg`);
    expect(screen.getByRole("link", { name: "Download SVG — Small logo" })).toHaveAttribute("href", `${BRAND_ASSETS_PATH}/mark-small.svg`);

    for (const palette of BRAND_AVATAR_PALETTES) {
      const png = readFileSync(`public${BRAND_ASSETS_PATH}/avatars/${palette}.png`);
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([512, 512]);
    }
    for (const name of ["Standard lockup", "Small lockup", "Lockup on dark"])
      expect(screen.getByRole("link", { name: `Download SVG — ${name}` })).toBeVisible();
    for (const theme of ["light", "dark"]) {
      const png = readFileSync(`public/brand/previews/timeline-${theme}.png`);
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1448, 1086]);
    }
    const downloads = Array.from(container.querySelectorAll<HTMLAnchorElement>("a[download]"));
    expect(downloads).toHaveLength(15);
    for (const link of downloads) expect(existsSync(`public${link.getAttribute("href")}`)).toBe(true);
    expect(new Set(downloads.map((link) => link.getAttribute("aria-label"))).size).toBe(downloads.length);
  });

  it("shows real small-size previews", () => {
    const { container } = render(<BrandPage />);
    for (const size of [16, 24, 32]) expect(container.querySelectorAll(`svg[viewBox="0 0 512 512"][width="${size}"]`)).toHaveLength(2);
  });
});
