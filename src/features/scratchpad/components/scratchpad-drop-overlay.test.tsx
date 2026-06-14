import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScratchpadDropOverlay } from "./scratchpad-drop-overlay";

describe("ScratchpadDropOverlay", () => {
  it("renders the drop affordance", () => {
    render(<ScratchpadDropOverlay />);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });
});
