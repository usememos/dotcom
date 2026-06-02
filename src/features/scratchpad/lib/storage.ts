/**
 * LocalStorage utilities for managing the instance setting and scratchpad items
 */

import type { MemoInstance, ScratchpadDocument, ScratchpadItem, ScratchpadItemPatch, ScratchpadViewport } from "../types";
import { decryptToken, encryptToken } from "./encryption";
import { migrateLegacyInstanceSetting, normalizeInstanceSettingInput } from "./instance-setting";
import { normalizeScratchpadItems, patchScratchpadItem } from "./item-model";
import { DEFAULT_SCRATCHPAD_VIEWPORT } from "./viewport";

const STORAGE_KEYS = {
  INSTANCE_SETTING: "memos-scratch-instance-setting",
  INSTANCES: "memos-scratch-instances",
  ITEMS: "memos-scratch-items",
  VIEWPORT: "memos-scratch-viewport",
  FIRST_VISIT: "memos-scratch-first-visit",
  SETTINGS: "memos-scratch-settings",
} as const;

const INSTANCE_SETTING_STORAGE_VERSION = 1;
const ITEM_STORAGE_VERSION = 3;

interface LegacyScratchpadItem {
  id: string;
  type: "text" | "file";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  content?: string;
  fileRef?: {
    id: string;
    name: string;
    type: string;
    size: number;
  };
  savedToInstance?: string;
  savedMemoRef?: { resourceName: string };
  savedMemoId?: string;
  createdAt: string | Date;
}

interface LegacyScratchpadItemEnvelope {
  version: number;
  items: ScratchpadItem[];
}

interface ScratchpadDocumentEnvelope {
  version: number;
  document: ScratchpadDocument;
}

interface MemoInstanceSettingEnvelope {
  version: number;
  instance: MemoInstance | null;
}

function hydrateMemoInstance(instance: MemoInstance): MemoInstance {
  return normalizeInstanceSettingInput({
    ...instance,
    lastConnectedAt: instance.lastConnectedAt ? new Date(instance.lastConnectedAt) : null,
    connectionStatus: instance.serverProfile ? instance.connectionStatus : "untested",
    serverProfile: instance.serverProfile
      ? {
          ...instance.serverProfile,
          detectedAt: new Date(instance.serverProfile.detectedAt),
        }
      : undefined,
  });
}

function parseStoredItems(data: string): { document: ScratchpadDocument; migrated: boolean } {
  const parsed = JSON.parse(data) as ScratchpadDocumentEnvelope | LegacyScratchpadItemEnvelope | LegacyScratchpadItem[];

  if (Array.isArray(parsed)) {
    return {
      document: {
        items: normalizeScratchpadItems(parsed),
      },
      migrated: true,
    };
  }

  if (parsed.version === 2 && "items" in parsed && Array.isArray(parsed.items)) {
    return {
      document: {
        items: normalizeScratchpadItems(parsed.items),
      },
      migrated: true,
    };
  }

  if (parsed.version === ITEM_STORAGE_VERSION && "document" in parsed && parsed.document && Array.isArray(parsed.document.items)) {
    return {
      document: {
        items: normalizeScratchpadItems(parsed.document.items),
      },
      migrated: false,
    };
  }

  return {
    document: {
      items: [],
    },
    migrated: false,
  };
}

/**
 * Storage for the configured Memos instance
 */
export const instanceStorage = {
  async get(): Promise<MemoInstance | null> {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(STORAGE_KEYS.INSTANCE_SETTING);

    if (data) {
      try {
        const payload = JSON.parse(data) as MemoInstanceSettingEnvelope;
        if (payload.version !== INSTANCE_SETTING_STORAGE_VERSION || !payload.instance) return null;

        return hydrateMemoInstance({
          ...payload.instance,
          accessToken: await decryptToken(payload.instance.accessToken),
        });
      } catch (error) {
        console.error("Failed to load instance setting:", error);
        localStorage.removeItem(STORAGE_KEYS.INSTANCE_SETTING);
        return null;
      }
    }

    const legacyData = localStorage.getItem(STORAGE_KEYS.INSTANCES);
    if (!legacyData) return null;

    try {
      const legacyInstances = JSON.parse(legacyData) as MemoInstance[];
      const legacySetting = migrateLegacyInstanceSetting(legacyInstances);
      if (!legacySetting) return null;

      const instance = hydrateMemoInstance({
        ...legacySetting,
        accessToken: await decryptToken(legacySetting.accessToken),
      });

      await this.save(instance);
      localStorage.removeItem(STORAGE_KEYS.INSTANCES);
      return instance;
    } catch (error) {
      console.error("Failed to migrate instance setting:", error);
      localStorage.removeItem(STORAGE_KEYS.INSTANCES);
      return null;
    }
  },

  async save(instance: MemoInstance): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const normalized = normalizeInstanceSettingInput(instance);
      const payload: MemoInstanceSettingEnvelope = {
        version: INSTANCE_SETTING_STORAGE_VERSION,
        instance: {
          ...normalized,
          accessToken: await encryptToken(normalized.accessToken),
        },
      };
      localStorage.setItem(STORAGE_KEYS.INSTANCE_SETTING, JSON.stringify(payload));
      localStorage.removeItem(STORAGE_KEYS.INSTANCES);
    } catch (error) {
      console.error("Failed to save instance setting:", error);
      throw new Error("Failed to save instance setting");
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.INSTANCE_SETTING);
    localStorage.removeItem(STORAGE_KEYS.INSTANCES);
  },
};

/**
 * Storage for scratchpad items
 */
export const itemStorage = {
  getAll(): ScratchpadItem[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!data) return [];

    try {
      const { document, migrated } = parseStoredItems(data);
      if (migrated) {
        this.save(document.items);
      }
      return document.items;
    } catch (error) {
      console.error("Failed to load items:", error);
      return [];
    }
  },

  save(items: ScratchpadItem[]): void {
    if (typeof window === "undefined") return;
    const payload: ScratchpadDocumentEnvelope = {
      version: ITEM_STORAGE_VERSION,
      document: {
        items,
      },
    };
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(payload));
  },

  add(item: ScratchpadItem): void {
    const items = this.getAll();
    items.push(item);
    this.save(items);
  },

  update(id: string, patch: ScratchpadItemPatch): void {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");

    items[index] = patchScratchpadItem(items[index], patch);
    this.save(items);
  },

  remove(id: string): void {
    const items = this.getAll();
    const filtered = items.filter((i) => i.id !== id);
    this.save(filtered);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    this.save([]);
  },

  clearSaved(): void {
    const items = this.getAll();
    const unsaved = items.filter((i) => !i.sync.instanceId);
    this.save(unsaved);
  },

  clearOld(daysOld: number = 30): void {
    const items = this.getAll();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const recent = items.filter((i) => i.timestamps.createdAt > cutoffDate);
    this.save(recent);
  },
};

export const viewportStorage = {
  get(): ScratchpadViewport {
    if (typeof window === "undefined") return DEFAULT_SCRATCHPAD_VIEWPORT;

    const data = localStorage.getItem(STORAGE_KEYS.VIEWPORT);
    if (!data) return DEFAULT_SCRATCHPAD_VIEWPORT;

    try {
      const parsed = JSON.parse(data) as Partial<ScratchpadViewport>;
      return {
        x: typeof parsed.x === "number" ? parsed.x : DEFAULT_SCRATCHPAD_VIEWPORT.x,
        y: typeof parsed.y === "number" ? parsed.y : DEFAULT_SCRATCHPAD_VIEWPORT.y,
        scale: typeof parsed.scale === "number" ? parsed.scale : DEFAULT_SCRATCHPAD_VIEWPORT.scale,
      };
    } catch {
      localStorage.removeItem(STORAGE_KEYS.VIEWPORT);
      return DEFAULT_SCRATCHPAD_VIEWPORT;
    }
  },

  save(viewport: ScratchpadViewport): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.VIEWPORT, JSON.stringify(viewport));
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.VIEWPORT);
  },
};

/**
 * Settings storage
 */
export const settingsStorage = {
  isFirstVisit(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(STORAGE_KEYS.FIRST_VISIT) !== "false";
  },

  setNotFirstVisit(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, "false");
  },

  getSetting<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;

    const data = localStorage.getItem(`${STORAGE_KEYS.SETTINGS}-${key}`);
    if (!data) return defaultValue;

    try {
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  },

  setSetting<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${STORAGE_KEYS.SETTINGS}-${key}`, JSON.stringify(value));
  },
};

/**
 * Check storage quota
 */
export async function getStorageQuota() {
  if (typeof navigator === "undefined" || !navigator.storage) {
    return { usage: 0, quota: 0, percentage: 0 };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentage };
  } catch (error) {
    console.error("Failed to get storage quota:", error);
    return { usage: 0, quota: 0, percentage: 0 };
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
