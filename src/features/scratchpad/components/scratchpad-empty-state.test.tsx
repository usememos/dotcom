import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScratchpadEmptyState } from "./scratchpad-empty-state";

describe("ScratchpadEmptyState", () => {
  it("renders the prompt copy", () => {
    render(<ScratchpadEmptyState />);
    expect(screen.getByText("Double-click anywhere to add a card")).toBeInTheDocument();
    expect(screen.getByText("Paste or drop files to collect them here.")).toBeInTheDocument();
  });
});
