import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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

describe("card terminology", () => {
  it("scratchpad card copy consistently refers to cards, not notes", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const cardBodySource = readFileSync(join(dir, "scratchpad-card-body.tsx"), "utf8");
    const cardItemSource = readFileSync(join(dir, "card-item.tsx"), "utf8");
    const scratchpadLayoutSource = readFileSync(join(dir, "..", "..", "..", "app", "(tools)", "scratchpad", "layout.tsx"), "utf8");

    expect(cardBodySource).toMatch(/Any thoughts\.\.\./);
    expect(cardItemSource).toMatch(/Click to edit card/);
    expect(cardItemSource).toMatch(/Edit card/);
    expect(cardItemSource).toMatch(/Select card\. Press Enter to edit\./);
    expect(scratchpadLayoutSource).toMatch(/quick cards/);
    expect(scratchpadLayoutSource).toMatch(/visual cards/);
    expect(cardBodySource).not.toMatch(/create card/i);
    expect(cardItemSource).not.toMatch(/create card/i);
    expect(cardBodySource).not.toMatch(/Double-click to add a card/);
    expect(cardItemSource).not.toMatch(/Double-click to add a card/);
    expect(cardItemSource).not.toMatch(/Press Enter to add a card/);
    expect(cardItemSource).not.toMatch(new RegExp("\\bno" + "te\\b", "i"));
    expect(scratchpadLayoutSource).not.toMatch(new RegExp("\\bno" + "tes\\b", "i"));
  });
});

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
