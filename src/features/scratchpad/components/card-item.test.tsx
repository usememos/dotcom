import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("../hooks/use-attachment-previews", () => ({ useAttachmentPreviews: () => new Map() }));

import type { ScratchpadItem } from "../types";
import { CardItem } from "./card-item";

const oldDate = new Date("2020-01-01T00:00:00Z");
const makeItem = (overrides: Partial<ScratchpadItem> = {}): ScratchpadItem => ({
  id: "card-1",
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: "Hello world", attachments: [] },
  timestamps: { createdAt: oldDate, updatedAt: oldDate },
  ...overrides,
});

function renderCard(props: Partial<Parameters<typeof CardItem>[0]> = {}) {
  const handlers = {
    onUpdateBody: vi.fn(),
    onUpdateLayout: vi.fn(),
    onDelete: vi.fn(),
    onRemoveAttachment: vi.fn(),
    onOpenAttachment: vi.fn(),
    onSelect: vi.fn(),
  };
  render(<CardItem item={makeItem()} canvasScale={1} {...handlers} {...props} />);
  return handlers;
}

describe("CardItem", () => {
  it("renders the card body in display mode", () => {
    renderCard();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("enters edit mode on double-click and selects the card", async () => {
    const user = userEvent.setup();
    const handlers = renderCard();
    await user.dblClick(screen.getByText("Hello world"));

    expect(handlers.onSelect).toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("Hello world");
  });

  it("opens a context menu and deletes via it", async () => {
    const user = userEvent.setup();
    const handlers = renderCard();

    const card = document.querySelector('[data-scratchpad-item-id="card-1"]') as HTMLElement;
    fireEvent.contextMenu(card, { clientX: 10, clientY: 10 });

    const deleteItem = await screen.findByRole("menuitem", { name: "Delete" });
    await user.click(deleteItem);
    expect(handlers.onDelete).toHaveBeenCalledWith("card-1");
  });
});
