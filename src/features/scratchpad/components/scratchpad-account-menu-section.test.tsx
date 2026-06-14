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
