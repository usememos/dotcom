import type { ScratchpadAttachmentRef, ScratchpadCardTone, ScratchpadItem, ScratchpadItemPatch, ScratchpadSyncState } from "../types";

type LegacyScratchpadItemInput = {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  body?: string;
  content?: string | { body?: string; attachments?: ScratchpadAttachmentRef[] };
  attachments?: ScratchpadAttachmentRef[];
  fileRef?: ScratchpadAttachmentRef;
  type?: "text" | "file";
  createdAt?: Date | string;
  updatedAt?: Date | string;
  sync?: Partial<ScratchpadSyncState> & { lastSyncedAt?: Date | string };
  savedToInstance?: string;
  savedMemoRef?: { resourceName: string };
  savedMemoId?: string;
  tone?: ScratchpadCardTone;
};

type GroupedScratchpadItemInput = Omit<ScratchpadItem, "sync" | "timestamps"> & {
  sync?: Partial<ScratchpadSyncState> & { lastSyncedAt?: Date | string };
  timestamps: {
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
};

const DEFAULT_CARD_TONE: ScratchpadCardTone = "yellow";

function createScratchpadItemId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function toDate(value: Date | string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function normalizeSyncState(input: LegacyScratchpadItemInput | GroupedScratchpadItemInput): ScratchpadSyncState {
  const savedMemoRef =
    "savedMemoRef" in input && input.savedMemoRef
      ? input.savedMemoRef
      : "savedMemoId" in input && input.savedMemoId
        ? { resourceName: input.savedMemoId }
        : undefined;

  const sync = input.sync ?? {};
  const status = sync.status ?? ("savedToInstance" in input && (input.savedToInstance || savedMemoRef) ? "synced" : "local");
  const normalized: ScratchpadSyncState = { status };

  const instanceId = sync.instanceId ?? ("savedToInstance" in input ? input.savedToInstance : undefined);
  const memoRef = sync.memoRef ?? savedMemoRef;

  if (instanceId) normalized.instanceId = instanceId;
  if (memoRef) normalized.memoRef = memoRef;
  if (sync.lastSyncedAt) normalized.lastSyncedAt = toDate(sync.lastSyncedAt, new Date());
  if (sync.lastError) normalized.lastError = sync.lastError;

  return normalized;
}

function isGroupedScratchpadItemInput(item: LegacyScratchpadItemInput | GroupedScratchpadItemInput): item is GroupedScratchpadItemInput {
  return "layout" in item && "content" in item && "timestamps" in item;
}

export function getScratchpadCardTone(item: Pick<ScratchpadItem, "tone">): ScratchpadCardTone {
  return item.tone ?? DEFAULT_CARD_TONE;
}

export function createScratchpadItem(x: number, y: number, zIndex: number, attachments: ScratchpadAttachmentRef[] = []): ScratchpadItem {
  const now = new Date();

  return {
    id: createScratchpadItemId(),
    layout: {
      x,
      y,
      width: attachments.length > 0 ? 320 : 280,
      height: attachments.length > 0 ? 300 : 180,
      zIndex,
    },
    content: {
      body: "",
      attachments,
    },
    sync: {
      status: "local",
    },
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function normalizeScratchpadItem(item: LegacyScratchpadItemInput | GroupedScratchpadItemInput, index = 0): ScratchpadItem {
  const now = new Date();

  if (isGroupedScratchpadItemInput(item)) {
    const createdAt = toDate(item.timestamps.createdAt, now);

    return {
      id: item.id,
      layout: {
        x: item.layout.x,
        y: item.layout.y,
        width: item.layout.width,
        height: item.layout.height,
        zIndex: item.layout.zIndex ?? index + 1,
      },
      content: {
        body: item.content.body ?? "",
        attachments: item.content.attachments ?? [],
      },
      sync: normalizeSyncState(item),
      timestamps: {
        createdAt,
        updatedAt: toDate(item.timestamps.updatedAt, createdAt),
      },
      ...(item.tone ? { tone: item.tone } : {}),
    };
  }

  const createdAt = toDate(item.createdAt, now);
  const attachments = item.attachments ?? (item.type === "file" && item.fileRef ? [item.fileRef] : []);

  return {
    id: item.id ?? createScratchpadItemId(),
    layout: {
      x: item.x ?? 0,
      y: item.y ?? 0,
      width: item.width ?? 320,
      height: item.height ?? 200,
      zIndex: item.zIndex ?? index + 1,
    },
    content: {
      body: item.body ?? (typeof item.content === "string" ? item.content : item.content?.body) ?? "",
      attachments: typeof item.content === "object" ? (item.content.attachments ?? attachments) : attachments,
    },
    sync: normalizeSyncState(item),
    timestamps: {
      createdAt,
      updatedAt: toDate(item.updatedAt, createdAt),
    },
    ...(item.tone ? { tone: item.tone } : {}),
  };
}

export function normalizeScratchpadItems(items: Array<LegacyScratchpadItemInput | GroupedScratchpadItemInput>): ScratchpadItem[] {
  return items.map((item, index) => normalizeScratchpadItem(item, index));
}

export function patchScratchpadItem(item: ScratchpadItem, patch: ScratchpadItemPatch): ScratchpadItem {
  return {
    ...item,
    layout: patch.layout ? { ...item.layout, ...patch.layout } : item.layout,
    content: patch.content ? { ...item.content, ...patch.content } : item.content,
    sync: patch.sync ? { ...item.sync, ...patch.sync } : item.sync,
    timestamps: patch.timestamps ? { ...item.timestamps, ...patch.timestamps } : item.timestamps,
    tone: patch.tone ?? item.tone,
  };
}
