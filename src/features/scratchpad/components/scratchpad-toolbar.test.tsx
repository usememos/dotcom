import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useIsClerkConfigured } = vi.hoisted(() => ({ useIsClerkConfigured: vi.fn(() => false) }));
vi.mock("@/shared/auth/clerk-config", () => ({ useIsClerkConfigured }));
vi.mock("@/features/account/components/theme-menu-items", () => ({ ThemeMenuItems: () => null }));

import { ScratchpadToolbar } from "./scratchpad-toolbar";

describe("ScratchpadToolbar", () => {
  it("renders the menu trigger with the Memos logo when Clerk is unconfigured", () => {
    render(<ScratchpadToolbar />);
    const trigger = screen.getByTitle("Memos menu");
    expect(trigger).toBeInTheDocument();
    expect(screen.getByAltText("Memos")).toBeInTheDocument();
  });
});
