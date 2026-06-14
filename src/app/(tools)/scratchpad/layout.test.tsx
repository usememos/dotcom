import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/scratchpad/components/scratchpad-viewport-lock", () => ({
  ScratchpadViewportLock: () => <div data-testid="viewport-lock" />,
}));

import ScratchLayout, { dynamic, metadata } from "./layout";

describe("ScratchLayout", () => {
  it("renders the viewport lock and its children", () => {
    render(
      <ScratchLayout>
        <main data-testid="content">hi</main>
      </ScratchLayout>,
    );
    expect(screen.getByTestId("viewport-lock")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("exports static rendering and no-index metadata", () => {
    expect(dynamic).toBe("force-static");
    expect(metadata.title).toBe("Scratchpad");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
