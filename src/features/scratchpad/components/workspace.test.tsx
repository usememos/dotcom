import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./card-item", () => ({ CardItem: ({ item }: { item: { id: string } }) => <div data-testid="card" data-id={item.id} /> }));
vi.mock("./scratchpad-attachment-viewer", () => ({ ScratchpadAttachmentViewer: () => null }));

import type { ScratchpadItem, ScratchpadViewport } from "../types";
import { Workspace } from "./workspace";

const viewport: ScratchpadViewport = { x: 0, y: 0, scale: 1 };
const makeItem = (id: string): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: id, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

function renderWorkspace(items: ScratchpadItem[]) {
  const props = {
    items,
    viewport,
    onViewportChange: vi.fn(),
    onUpdateItemBody: vi.fn(),
    onUpdateItemLayout: vi.fn(),
    onDeleteItem: vi.fn(),
    onRemoveAttachment: vi.fn(),
    onCreateTextItem: vi.fn(),
    onFileUpload: vi.fn(),
    selectedItemIds: [] as string[],
    lastActiveItemId: null,
    onSelectItem: vi.fn(),
  };
  const { container } = render(<Workspace {...props} />);
  return { props, container };
}

describe("Workspace", () => {
  it("renders one card per item", () => {
    renderWorkspace([makeItem("a"), makeItem("b")]);
    expect(screen.getAllByTestId("card")).toHaveLength(2);
  });

  it("shows the empty state and the zoom label when there are no items", () => {
    renderWorkspace([]);
    expect(screen.getByText("Double-click anywhere to add a card")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("creates a text item on background double-click", () => {
    const { props, container } = renderWorkspace([]);
    fireEvent.dblClick(container.firstChild as HTMLElement, { clientX: 120, clientY: 90 });
    expect(props.onCreateTextItem).toHaveBeenCalledWith(120, 90);
  });

  it("clears the selection on a background click", () => {
    const { props, container } = renderWorkspace([makeItem("a")]);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(props.onSelectItem).toHaveBeenCalledWith(null);
  });

  it("flags drag-over on drag enter", () => {
    const { container } = renderWorkspace([]);
    fireEvent.dragOver(container.firstChild as HTMLElement);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });
});
