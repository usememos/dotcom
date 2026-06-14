import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useIsClerkConfigured } = vi.hoisted(() => ({ useIsClerkConfigured: vi.fn() }));
vi.mock("@/shared/auth/clerk-config", () => ({ useIsClerkConfigured }));

import { ScratchpadAccountMenuSection } from "./scratchpad-account-menu-section";

describe("ScratchpadAccountMenuSection", () => {
  it("renders nothing when Clerk is not configured", () => {
    useIsClerkConfigured.mockReturnValue(false);
    const { container } = render(<ScratchpadAccountMenuSection />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("source guards", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const accountMenuSource = readFileSync(join(dir, "scratchpad-account-menu-section.tsx"), "utf8");
  const toolbarSource = readFileSync(join(dir, "scratchpad-toolbar.tsx"), "utf8");

  it("signed-in scratchpad account menu shows a full-width local-only notice", () => {
    expect(accountMenuSource).toMatch(/Always Local-only/);
    expect(accountMenuSource).not.toMatch(/Signing in only verifies your account/);
    expect(accountMenuSource).toMatch(/Your cards stay on this device and are not uploaded to the cloud/);
    expect(accountMenuSource).toMatch(/Any other thoughts\?/);
    expect(accountMenuSource).toMatch(/w-full rounded-md border border-teal-200/);
    expect(accountMenuSource).toMatch(/mt-1\.5 text-xs leading-4/);
    expect(accountMenuSource).toMatch(/mt-1 inline-flex/);
    expect(accountMenuSource).not.toMatch(/<span className="truncate">Local-only/);
  });

  it("scratchpad account dropdown keeps the standard compact menu width", () => {
    expect(toolbarSource).toMatch(/className="z-50 w-56 /);
    expect(toolbarSource).not.toMatch(/w-\[min\(calc\(100vw-1rem\),18rem\)\]/);
  });

  it("the signed-in menu links to the dashboard and offers sign out", () => {
    expect(accountMenuSource).toMatch(/href="\/dashboard"/);
    expect(accountMenuSource).toMatch(/SignOutItem/);
  });

  it("connection and account management are delegated to the dashboard", () => {
    expect(accountMenuSource).not.toMatch(/connectionMenuLabel/);
    expect(accountMenuSource).not.toMatch(/Connect Memos instance/);
    expect(accountMenuSource).not.toMatch(/Manage account/);
    expect(accountMenuSource).not.toMatch(/AccountActionItems/);
    expect(accountMenuSource).not.toMatch(/PlugIcon/);
  });

  it("the toolbar no longer mounts the connection dialog", () => {
    expect(toolbarSource).not.toMatch(/useMemosConnection/);
    expect(toolbarSource).not.toMatch(/connection\.dialog/);
    expect(accountMenuSource).not.toMatch(/MemosConnectionDialog/);
  });
});
