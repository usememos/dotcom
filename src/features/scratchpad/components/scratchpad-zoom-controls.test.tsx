import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScratchpadZoomControls } from "./scratchpad-zoom-controls";

function setup(overrides = {}) {
  const props = {
    zoomLabel: "100%",
    visible: true,
    onHoverChange: vi.fn(),
    onFocusChange: vi.fn(),
    onZoomOut: vi.fn(),
    onReset: vi.fn(),
    onZoomIn: vi.fn(),
    ...overrides,
  };
  render(<ScratchpadZoomControls {...props} />);
  return props;
}

describe("ScratchpadZoomControls", () => {
  it("renders the zoom label and three controls", () => {
    setup();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
  });

  it("fires the zoom callbacks", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    await user.click(screen.getByRole("button", { name: "Zoom out" }));
    await user.click(screen.getByText("100%"));
    expect(props.onZoomIn).toHaveBeenCalledTimes(1);
    expect(props.onZoomOut).toHaveBeenCalledTimes(1);
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });

  it("reports hover changes", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.hover(screen.getByText("100%"));
    expect(props.onHoverChange).toHaveBeenCalledWith(true);
  });
});
