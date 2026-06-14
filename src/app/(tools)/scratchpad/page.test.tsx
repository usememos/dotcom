import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useScratchpad } = vi.hoisted(() => ({ useScratchpad: vi.fn() }));
vi.mock("@/features/scratchpad/hooks/use-scratchpad", () => ({ useScratchpad }));
vi.mock("@/features/scratchpad/components/scratchpad-toolbar", () => ({ ScratchpadToolbar: () => <div data-testid="toolbar" /> }));
vi.mock("@/features/scratchpad/components/workspace", () => ({
  Workspace: ({ items }: { items: Array<{ id: string }> }) => <div data-testid="workspace">{items.length}</div>,
}));

import ScratchPage from "./page";

const baseHook = {
  handleCreateTextItem: vi.fn(),
  handleDeleteItem: vi.fn(),
  handleFileUpload: vi.fn(),
  handleRemoveAttachment: vi.fn(),
  handleSelectItem: vi.fn(),
  handleUpdateItemBody: vi.fn(),
  handleUpdateItemLayout: vi.fn(),
  items: [{ id: "a" }],
  lastActiveItemId: null,
  selectedItemIds: [],
  setViewport: vi.fn(),
  viewport: { x: 0, y: 0, scale: 1 },
};

describe("ScratchPage", () => {
  it("renders nothing until the client is ready", () => {
    useScratchpad.mockReturnValue({ ...baseHook, isClient: false });
    const { container } = render(<ScratchPage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the toolbar and workspace once client-ready", () => {
    useScratchpad.mockReturnValue({ ...baseHook, isClient: true });
    render(<ScratchPage />);
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("workspace")).toHaveTextContent("1");
  });
});
