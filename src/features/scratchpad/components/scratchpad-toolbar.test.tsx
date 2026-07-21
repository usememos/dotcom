import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/account/components/theme-toggle", () => ({ ThemeToggle: () => null }));

import { ScratchpadToolbar } from "./scratchpad-toolbar";

describe("ScratchpadToolbar", () => {
  it("renders the menu trigger with the Memos logo", () => {
    render(<ScratchpadToolbar />);
    expect(screen.getByTitle("Memos menu")).toBeInTheDocument();
    expect(screen.getByAltText("Memos")).toBeInTheDocument();
  });

  it("stays independent from Clerk and links to the dashboard", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const source = readFileSync(join(dir, "scratchpad-toolbar.tsx"), "utf8");

    expect(source).not.toMatch(/@clerk\/nextjs/);
    expect(source).not.toMatch(/useUser|useClerk|SignIn|SignOut/);
    expect(source).toMatch(/href="\/dashboard"/);
    expect(source).toMatch(/ExternalLinkIcon/);
    expect(source).toMatch(/Saved on this device/);
    expect(source.indexOf('href="/dashboard"')).toBeLessThan(source.indexOf("<ThemeToggle />"));
  });
});
