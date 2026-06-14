import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/indexeddb", () => ({ getFile: vi.fn() }));

import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadAttachmentRef } from "../types";
import { ScratchpadAttachmentViewer } from "./scratchpad-attachment-viewer";

const ref: ScratchpadAttachmentRef = { id: "a", name: "photo.png", type: "image/png", size: 10 };
const imageFile: FileData = { id: "a", name: "photo.png", type: "image/png", size: 10, blob: new Blob(["x"]), uploadedAt: new Date() };

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("ScratchpadAttachmentViewer", () => {
  it("renders nothing without an attachment", () => {
    const { container } = render(<ScratchpadAttachmentViewer attachment={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("loads and shows an image preview", async () => {
    vi.mocked(getFile).mockResolvedValue(imageFile);
    render(<ScratchpadAttachmentViewer attachment={ref} onClose={vi.fn()} />);
    expect(await screen.findByRole("img", { name: "photo.png" })).toBeInTheDocument();
  });

  it("shows an error when the file is gone", async () => {
    vi.mocked(getFile).mockResolvedValue(null);
    render(<ScratchpadAttachmentViewer attachment={ref} onClose={vi.fn()} />);
    expect(await screen.findByText(/no longer available/)).toBeInTheDocument();
  });

  it("closes on the Escape key and the close button", async () => {
    vi.mocked(getFile).mockResolvedValue(imageFile);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ScratchpadAttachmentViewer attachment={ref} onClose={onClose} />);

    await screen.findByRole("img", { name: "photo.png" });
    await user.click(screen.getByRole("button", { name: "Close attachment preview" }));
    expect(onClose).toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
