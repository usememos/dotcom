import type { ScratchpadDocument, ScratchpadItem, ScratchpadItemPatch, ScratchpadSyncState, ScratchpadViewport } from "../types";
import { normalizeScratchpadItems, patchScratchpadItem } from "./item-model";
import { DEFAULT_SCRATCHPAD_VIEWPORT } from "./viewport";

export { createScratchpadItem } from "./item-model";

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
  document: ScratchpadDocument;
  selectedItemIds: string[];
  viewport: ScratchpadViewport;
  lastTransaction: ScratchpadEditorTransaction | null;
}

export type ScratchpadEditorOperation =
  | { type: "set-viewport"; viewport: ScratchpadViewport }
  | { type: "add-item"; item: ScratchpadItem }
  | { type: "patch-item"; id: string; patch: ScratchpadItemPatch }
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

export function markScratchpadItemDirty(sync: ScratchpadSyncState): ScratchpadSyncState {
  return {
    ...sync,
    status: sync.memoRef ? "dirty" : "local",
    lastError: undefined,
  };
}

export function createScratchpadEditorState(): ScratchpadEditorState {
  return {
    document: {
      items: [],
    },
    selectedItemIds: [],
    viewport: DEFAULT_SCRATCHPAD_VIEWPORT,
    lastTransaction: null,
  };
}

export function getNextScratchpadZIndex(items: ScratchpadItem[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.layout.zIndex || 0)) + 1;
}

export function getScratchpadItem(items: ScratchpadItem[], id: string): ScratchpadItem | undefined {
  return items.find((item) => item.id === id);
}

export function getSelectedScratchpadItems(state: Pick<ScratchpadEditorState, "document" | "selectedItemIds">): ScratchpadItem[] {
  return state.document.items.filter((item) => state.selectedItemIds.includes(item.id));
}

function bringScratchpadItemToFront(items: ScratchpadItem[], id: string): ScratchpadItem[] {
  const item = getScratchpadItem(items, id);
  if (!item) return items;

  const maxZIndex = Math.max(...items.map((candidate) => candidate.layout.zIndex || 0));
  if (item.layout.zIndex >= maxZIndex) {
    return items;
  }

  return items.map((candidate) =>
    candidate.id === id
      ? {
          ...candidate,
          layout: {
            ...candidate.layout,
            zIndex: maxZIndex + 1,
          },
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
        document: {
          ...state.document,
          items: [...state.document.items, operation.item],
        },
      };
    case "patch-item":
      return {
        ...state,
        document: {
          ...state.document,
          items: state.document.items.map((item) => (item.id === operation.id ? patchScratchpadItem(item, operation.patch) : item)),
        },
      };
    case "delete-items": {
      const deletedIds = new Set(operation.ids);
      return {
        ...state,
        document: {
          ...state.document,
          items: state.document.items.filter((item) => !deletedIds.has(item.id)),
        },
        selectedItemIds: state.selectedItemIds.filter((id) => !deletedIds.has(id)),
      };
    }
    case "select-item": {
      const items = bringScratchpadItemToFront(state.document.items, operation.id);
      if (operation.additive) {
        return {
          ...state,
          document: {
            ...state.document,
            items,
          },
          selectedItemIds: state.selectedItemIds.includes(operation.id)
            ? state.selectedItemIds.filter((id) => id !== operation.id)
            : [...state.selectedItemIds, operation.id],
        };
      }

      return {
        ...state,
        document: {
          ...state.document,
          items,
        },
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
        document: {
          items: normalizeScratchpadItems(action.items),
        },
        selectedItemIds: [],
        viewport: action.viewport,
        lastTransaction: null,
      };
    case "run-transaction": {
      const nextState = action.operations.reduce(applyScratchpadEditorOperation, state);
      const changes = {
        items: nextState.document.items !== state.document.items,
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
