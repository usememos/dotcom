/**
 * LocalStorage utilities for managing instances and scratchpad items
 */

import { decryptToken, encryptToken } from "./encryption";
import type { MemoInstance, ScratchpadItem } from "./types";

const STORAGE_KEYS = {
  INSTANCES: "memos-scratch-instances",
  ITEMS: "memos-scratch-items",
  FIRST_VISIT: "memos-scratch-first-visit",
  SETTINGS: "memos-scratch-settings",
} as const;

const ITEM_STORAGE_VERSION = 2;

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

interface ScratchpadItemEnvelope {
  version: number;
  items: ScratchpadItem[];
}

function createEmptySyncState(): ScratchpadItem["sync"] {
  return {
    status: "local",
  };
}

function hydrateScratchpadItem(item: ScratchpadItem): ScratchpadItem {
  return {
    ...item,
    attachments: item.attachments || [],
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    sync: {
      status: item.sync?.status || "local",
      instanceId: item.sync?.instanceId,
      memoRef: item.sync?.memoRef,
      lastError: item.sync?.lastError,
      lastSyncedAt: item.sync?.lastSyncedAt ? new Date(item.sync.lastSyncedAt) : undefined,
    },
  };
}

function migrateLegacyItem(item: LegacyScratchpadItem, index: number): ScratchpadItem {
  const createdAt = new Date(item.createdAt);
  const savedMemoRef = item.savedMemoRef ?? (item.savedMemoId ? { resourceName: item.savedMemoId } : undefined);

  return {
    id: item.id,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    zIndex: item.zIndex ?? index + 1,
    body: item.type === "text" ? (item.content ?? "") : "",
    attachments: item.type === "file" && item.fileRef ? [item.fileRef] : [],
    createdAt,
    updatedAt: createdAt,
    sync:
      item.savedToInstance || savedMemoRef
        ? {
            instanceId: item.savedToInstance,
            memoRef: savedMemoRef,
            status: "synced",
          }
        : createEmptySyncState(),
  };
}

function parseStoredItems(data: string): { items: ScratchpadItem[]; migrated: boolean } {
  const parsed = JSON.parse(data) as ScratchpadItemEnvelope | LegacyScratchpadItem[];

  if (Array.isArray(parsed)) {
    return {
      items: parsed.map((item, index) => migrateLegacyItem(item, index)),
      migrated: true,
    };
  }

  if (parsed.version === ITEM_STORAGE_VERSION && Array.isArray(parsed.items)) {
    return {
      items: parsed.items.map(hydrateScratchpadItem),
      migrated: false,
    };
  }

  return {
    items: [],
    migrated: false,
  };
}

/**
 * Storage for Memos instances
 */
export const instanceStorage = {
  async getAll(): Promise<MemoInstance[]> {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(STORAGE_KEYS.INSTANCES);
    if (!data) return [];

    try {
      const instances = JSON.parse(data) as MemoInstance[];
      // Decrypt tokens, filtering out any that fail
      const decryptedInstances = await Promise.allSettled(
        instances.map(async (instance) => ({
          ...instance,
          lastConnected: instance.lastConnected ? new Date(instance.lastConnected) : null,
          status: instance.serverProfile ? instance.status : "untested",
          serverProfile: instance.serverProfile
            ? {
                ...instance.serverProfile,
                detectedAt: new Date(instance.serverProfile.detectedAt),
              }
            : undefined,
          accessToken: await decryptToken(instance.accessToken),
        })),
      );

      const validInstances: MemoInstance[] = [];
      const failedCount = decryptedInstances.filter((result) => result.status === "rejected").length;

      for (const result of decryptedInstances) {
        if (result.status === "fulfilled") {
          validInstances.push(result.value);
        }
      }

      // If some instances failed to decrypt, clean up localStorage
      if (failedCount > 0) {
        console.warn(`Failed to decrypt ${failedCount} instance(s). Removing corrupted data.`);
        // Save only the valid instances back
        if (validInstances.length > 0) {
          await this.save(validInstances);
        } else {
          // No valid instances, clear the storage
          localStorage.removeItem(STORAGE_KEYS.INSTANCES);
        }
      }

      return validInstances;
    } catch (error) {
      console.error("Failed to load instances:", error);
      return [];
    }
  },

  async save(instances: MemoInstance[]): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Encrypt tokens before saving
      const encrypted = await Promise.all(
        instances.map(async (instance) => ({
          ...instance,
          accessToken: await encryptToken(instance.accessToken),
        })),
      );
      localStorage.setItem(STORAGE_KEYS.INSTANCES, JSON.stringify(encrypted));
    } catch (error) {
      console.error("Failed to save instances:", error);
      throw new Error("Failed to save instances");
    }
  },

  async add(instance: MemoInstance): Promise<void> {
    const instances = await this.getAll();
    instances.push(instance);
    await this.save(instances);
  },

  async update(id: string, updates: Partial<MemoInstance>): Promise<void> {
    const instances = await this.getAll();
    const index = instances.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Instance not found");

    instances[index] = { ...instances[index], ...updates };
    await this.save(instances);
  },

  async remove(id: string): Promise<void> {
    const instances = await this.getAll();
    const filtered = instances.filter((i) => i.id !== id);
    await this.save(filtered);
  },

  async getDefault(): Promise<MemoInstance | null> {
    const instances = await this.getAll();
    return instances.find((i) => i.isDefault) || instances[0] || null;
  },

  async setDefault(id: string): Promise<void> {
    const instances = await this.getAll();
    instances.forEach((instance) => {
      instance.isDefault = instance.id === id;
    });
    await this.save(instances);
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
      const { items, migrated } = parseStoredItems(data);
      if (migrated) {
        this.save(items);
      }
      return items;
    } catch (error) {
      console.error("Failed to load items:", error);
      return [];
    }
  },

  save(items: ScratchpadItem[]): void {
    if (typeof window === "undefined") return;
    const payload: ScratchpadItemEnvelope = {
      version: ITEM_STORAGE_VERSION,
      items,
    };
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(payload));
  },

  add(item: ScratchpadItem): void {
    const items = this.getAll();
    items.push(item);
    this.save(items);
  },

  update(id: string, updates: Partial<ScratchpadItem>): void {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");

    items[index] = { ...items[index], ...updates };
    this.save(items);
  },

  remove(id: string): void {
    const items = this.getAll();
    const filtered = items.filter((i) => i.id !== id);
    this.save(filtered);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
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

    const recent = items.filter((i) => i.createdAt > cutoffDate);
    this.save(recent);
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
