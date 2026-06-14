import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ScratchpadCardBody } from "./scratchpad-card-body";

const baseProps = {
  textClassName: "",
  placeholderClassName: "text-stone-500",
  textareaRef: createRef<HTMLTextAreaElement>(),
  onBlur: vi.fn(),
  onChange: vi.fn(),
  onKeyDown: vi.fn(),
  onPointerDown: vi.fn(),
};

describe("ScratchpadCardBody", () => {
  it("renders the body text in display mode", () => {
    render(<ScratchpadCardBody {...baseProps} body="Some note" isEditing={false} />);
    expect(screen.getByText("Some note")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows the placeholder text when the body is empty", () => {
    render(<ScratchpadCardBody {...baseProps} body="   " isEditing={false} />);
    expect(screen.getByText("Any thoughts...")).toBeInTheDocument();
  });

  it("renders a textarea in editing mode and forwards change events", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ScratchpadCardBody {...baseProps} onChange={onChange} body="" isEditing />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("placeholder", "Any thoughts...");
    await user.type(textarea, "x");
    expect(onChange).toHaveBeenCalled();
  });
});
