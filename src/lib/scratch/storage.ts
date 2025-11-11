/**
 * LocalStorage utilities for managing instances and scratchpad items
 */

import type { MemoInstance, ScratchpadItem } from './types';
import { encryptToken, decryptToken } from './encryption';

const STORAGE_KEYS = {
  INSTANCES: 'memos-scratch-instances',
  ITEMS: 'memos-scratch-items',
  FIRST_VISIT: 'memos-scratch-first-visit',
  SETTINGS: 'memos-scratch-settings',
} as const;

/**
 * Storage for Memos instances
 */
export const instanceStorage = {
  async getAll(): Promise<MemoInstance[]> {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(STORAGE_KEYS.INSTANCES);
    if (!data) return [];

    try {
      const instances = JSON.parse(data) as MemoInstance[];
      // Decrypt tokens
      return await Promise.all(
        instances.map(async (instance) => ({
          ...instance,
          lastConnected: instance.lastConnected ? new Date(instance.lastConnected) : null,
          accessToken: await decryptToken(instance.accessToken),
        }))
      );
    } catch (error) {
      console.error('Failed to load instances:', error);
      return [];
    }
  },

  async save(instances: MemoInstance[]): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Encrypt tokens before saving
      const encrypted = await Promise.all(
        instances.map(async (instance) => ({
          ...instance,
          accessToken: await encryptToken(instance.accessToken),
        }))
      );
      localStorage.setItem(STORAGE_KEYS.INSTANCES, JSON.stringify(encrypted));
    } catch (error) {
      console.error('Failed to save instances:', error);
      throw new Error('Failed to save instances');
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
    if (index === -1) throw new Error('Instance not found');

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
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!data) return [];

    try {
      const items = JSON.parse(data) as ScratchpadItem[];
      // Parse dates
      return items.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
    } catch (error) {
      console.error('Failed to load items:', error);
      return [];
    }
  },

  save(items: ScratchpadItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  add(item: ScratchpadItem): void {
    const items = this.getAll();
    items.push(item);
    this.save(items);
  },

  update(id: string, updates: Partial<ScratchpadItem>): void {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Item not found');

    items[index] = { ...items[index], ...updates };
    this.save(items);
  },

  remove(id: string): void {
    const items = this.getAll();
    const filtered = items.filter((i) => i.id !== id);
    this.save(filtered);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
  },

  clearSaved(): void {
    const items = this.getAll();
    const unsaved = items.filter((i) => !i.savedToInstance);
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
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEYS.FIRST_VISIT) !== 'false';
  },

  setNotFirstVisit(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'false');
  },

  getSetting<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    const data = localStorage.getItem(`${STORAGE_KEYS.SETTINGS}-${key}`);
    if (!data) return defaultValue;

    try {
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  },

  setSetting<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_KEYS.SETTINGS}-${key}`, JSON.stringify(value));
  },
};

/**
 * Check storage quota
 */
export async function getStorageQuota() {
  if (typeof navigator === 'undefined' || !navigator.storage) {
    return { usage: 0, quota: 0, percentage: 0 };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentage };
  } catch (error) {
    console.error('Failed to get storage quota:', error);
    return { usage: 0, quota: 0, percentage: 0 };
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
