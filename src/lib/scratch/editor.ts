import type { ScratchpadAttachmentRef, ScratchpadItem, ScratchpadSyncState, ScratchpadViewport } from "./types";
import { DEFAULT_SCRATCHPAD_VIEWPORT } from "./viewport";

export type ScratchpadTransactionPersistence = "debounced" | "immediate" | "none";

export interface ScratchpadEditorTransaction {
  id: number;
  reason: string;
  persistence: ScratchpadTransactionPersistence;
  changes: {
    items: boolean;
    selection: boolean;
    viewport: boolean;
  };
}

export interface ScratchpadEditorState {
  items: ScratchpadItem[];
  selectedItemIds: string[];
  viewport: ScratchpadViewport;
  lastTransaction: ScratchpadEditorTransaction | null;
}

export type ScratchpadEditorOperation =
  | { type: "set-viewport"; viewport: ScratchpadViewport }
  | { type: "add-item"; item: ScratchpadItem }
  | { type: "patch-item"; id: string; patch: Partial<ScratchpadItem> }
  | { type: "delete-items"; ids: string[] }
  | { type: "select-item"; id: string; additive: boolean }
  | { type: "clear-selection" };

type ScratchpadEditorAction =
  | { type: "hydrate"; items: ScratchpadItem[]; viewport: ScratchpadViewport }
  | {
      type: "run-transaction";
      id: number;
      reason: string;
      persistence: ScratchpadTransactionPersistence;
      operations: ScratchpadEditorOperation[];
    };

function createSyncState(overrides: Partial<ScratchpadSyncState> = {}): ScratchpadSyncState {
  return {
    status: "local",
    ...overrides,
  };
}

export function createScratchpadItem(x: number, y: number, zIndex: number, attachments: ScratchpadAttachmentRef[] = []): ScratchpadItem {
  const now = new Date();

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x,
    y,
    width: attachments.length > 0 ? 320 : 280,
    height: attachments.length > 0 ? 300 : 180,
    zIndex,
    body: "",
    attachments,
    createdAt: now,
    updatedAt: now,
    sync: createSyncState(),
  };
}

export function markScratchpadItemDirty(sync: ScratchpadSyncState): ScratchpadSyncState {
  return {
    ...sync,
    status: sync.memoRef ? "dirty" : "local",
    lastError: undefined,
  };
}

export function createScratchpadEditorState(): ScratchpadEditorState {
  return {
    items: [],
    selectedItemIds: [],
    viewport: DEFAULT_SCRATCHPAD_VIEWPORT,
    lastTransaction: null,
  };
}

export function getNextScratchpadZIndex(items: ScratchpadItem[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.zIndex || 0)) + 1;
}

export function getScratchpadItem(items: ScratchpadItem[], id: string): ScratchpadItem | undefined {
  return items.find((item) => item.id === id);
}

export function getSelectedScratchpadItems(state: Pick<ScratchpadEditorState, "items" | "selectedItemIds">): ScratchpadItem[] {
  return state.items.filter((item) => state.selectedItemIds.includes(item.id));
}

function normalizeScratchpadItems(items: ScratchpadItem[]): ScratchpadItem[] {
  return items.map((item, index) => ({
    ...item,
    attachments: item.attachments || [],
    zIndex: item.zIndex ?? index + 1,
  }));
}

function bringScratchpadItemToFront(items: ScratchpadItem[], id: string): ScratchpadItem[] {
  const item = getScratchpadItem(items, id);
  if (!item) return items;

  const maxZIndex = Math.max(...items.map((candidate) => candidate.zIndex || 0));
  if (item.zIndex >= maxZIndex) {
    return items;
  }

  return items.map((candidate) =>
    candidate.id === id
      ? {
          ...candidate,
          zIndex: maxZIndex + 1,
        }
      : candidate,
  );
}

function applyScratchpadEditorOperation(state: ScratchpadEditorState, operation: ScratchpadEditorOperation): ScratchpadEditorState {
  switch (operation.type) {
    case "set-viewport":
      return {
        ...state,
        viewport: operation.viewport,
      };
    case "add-item":
      return {
        ...state,
        items: [...state.items, operation.item],
      };
    case "patch-item":
      return {
        ...state,
        items: state.items.map((item) => (item.id === operation.id ? { ...item, ...operation.patch } : item)),
      };
    case "delete-items": {
      const deletedIds = new Set(operation.ids);
      return {
        ...state,
        items: state.items.filter((item) => !deletedIds.has(item.id)),
        selectedItemIds: state.selectedItemIds.filter((id) => !deletedIds.has(id)),
      };
    }
    case "select-item": {
      const items = bringScratchpadItemToFront(state.items, operation.id);
      if (operation.additive) {
        return {
          ...state,
          items,
          selectedItemIds: state.selectedItemIds.includes(operation.id)
            ? state.selectedItemIds.filter((id) => id !== operation.id)
            : [...state.selectedItemIds, operation.id],
        };
      }

      return {
        ...state,
        items,
        selectedItemIds: [operation.id],
      };
    }
    case "clear-selection":
      return {
        ...state,
        selectedItemIds: [],
      };
  }
}

export function scratchpadEditorReducer(state: ScratchpadEditorState, action: ScratchpadEditorAction): ScratchpadEditorState {
  switch (action.type) {
    case "hydrate":
      return {
        items: normalizeScratchpadItems(action.items),
        selectedItemIds: [],
        viewport: action.viewport,
        lastTransaction: null,
      };
    case "run-transaction": {
      const nextState = action.operations.reduce(applyScratchpadEditorOperation, state);
      const changes = {
        items: nextState.items !== state.items,
        selection: nextState.selectedItemIds !== state.selectedItemIds,
        viewport: nextState.viewport !== state.viewport,
      };

      if (!changes.items && !changes.selection && !changes.viewport) {
        return state;
      }

      return {
        ...nextState,
        lastTransaction: {
          id: action.id,
          reason: action.reason,
          persistence: action.persistence,
          changes,
        },
      };
    }
    default:
      return state;
  }
}
