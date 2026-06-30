import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useUser } = vi.hoisted(() => ({ useUser: vi.fn(() => ({ isLoaded: true, isSignedIn: false, user: null })) }));
vi.mock("@clerk/nextjs", () => ({ useUser, useClerk: () => ({}) }));
vi.mock("@/features/account/components/theme-toggle", () => ({ ThemeToggle: () => null }));

import { ScratchpadToolbar } from "./scratchpad-toolbar";

describe("ScratchpadToolbar", () => {
  it("renders the menu trigger with the Memos logo when the user is signed out", () => {
    render(<ScratchpadToolbar />);
    expect(screen.getByTitle("Memos menu")).toBeInTheDocument();
    expect(screen.getByAltText("Memos")).toBeInTheDocument();
  });
});
