import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ScratchpadAttachmentRef } from "../types";
import { ScratchpadAttachmentGrid } from "./scratchpad-attachment-grid";

const imageRef: ScratchpadAttachmentRef = { id: "img-1", name: "photo.png", type: "image/png", size: 10 };
const docRef: ScratchpadAttachmentRef = { id: "doc-1", name: "notes.txt", type: "text/plain", size: 5 };

function setup(attachments: ScratchpadAttachmentRef[], previewMap = new Map<string, { previewUrl: string | null }>()) {
  const props = {
    itemId: "card-1",
    attachments,
    previewMap,
    onOpenAttachment: vi.fn(),
    onRemoveAttachment: vi.fn(),
  };
  render(<ScratchpadAttachmentGrid {...props} />);
  return props;
}

describe("ScratchpadAttachmentGrid", () => {
  it("renders nothing when there are no attachments", () => {
    const { container } = render(
      <ScratchpadAttachmentGrid
        itemId="c"
        attachments={[]}
        previewMap={new Map()}
        onOpenAttachment={vi.fn()}
        onRemoveAttachment={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an image preview when a preview URL is available", () => {
    setup([imageRef], new Map([["img-1", { previewUrl: "blob:mock/1" }]]));
    expect(screen.getByRole("img", { name: "photo.png" })).toHaveAttribute("src", "blob:mock/1");
  });

  it("falls back to a file tile for non-images", () => {
    setup([docRef]);
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
  });

  it("fires open and remove callbacks", async () => {
    const user = userEvent.setup();
    const props = setup([docRef]);
    await user.click(screen.getByRole("button", { name: "Open attachment notes.txt" }));
    await user.click(screen.getByRole("button", { name: "Remove attachment" }));
    expect(props.onOpenAttachment).toHaveBeenCalledWith(docRef);
    expect(props.onRemoveAttachment).toHaveBeenCalledWith("card-1", "doc-1");
  });
});
