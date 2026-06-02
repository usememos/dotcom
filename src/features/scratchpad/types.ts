/**
 * TypeScript interfaces and types for the Memos Scratchpad feature
 */

export type ScratchInstanceStatus = "connected" | "error" | "untested" | "unsupported";

export type ScratchVersionFamily = "0.26.x" | "latest" | "unsupported" | "unknown";

export type ScratchSupportStatus = "supported" | "unsupported" | "unknown";

export interface ScratchCapabilities {
  canReadInstanceProfile: boolean;
  canCreateMemo: boolean;
  canUploadAttachment: boolean;
  canSetMemoAttachments: boolean;
  unsupportedReasons: string[];
}

export interface ScratchServerProfile {
  rawVersion?: string;
  versionFamily: ScratchVersionFamily;
  supportStatus: ScratchSupportStatus;
  detectedAt: Date;
  capabilities: ScratchCapabilities;
}

export interface ScratchMemoRef {
  resourceName: string;
}

export type ScratchSyncStatus = "local" | "saving" | "synced" | "dirty" | "error";

export interface MemoInstance {
  id: string;
  name: string; // e.g., "Personal Notes"
  baseUrl: string; // https://memo.example.com
  accessToken: string; // Encrypted
  connectionStatus: ScratchInstanceStatus;
  lastConnectedAt: Date | null;
  serverProfile?: ScratchServerProfile;
}

export interface ScratchpadAttachmentRef {
  id: string; // IndexedDB key
  name: string;
  type: string; // MIME type
  size: number;
}

export interface ScratchpadSyncState {
  instanceId?: string;
  memoRef?: ScratchMemoRef;
  status: ScratchSyncStatus;
  lastSyncedAt?: Date;
  lastError?: string;
}

export interface ScratchpadViewport {
  x: number;
  y: number;
  scale: number;
}

export interface ScratchpadItemLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // Stacking order (higher = on top)
}

export interface ScratchpadItemContent {
  body: string;
  attachments: ScratchpadAttachmentRef[];
}

export interface ScratchpadItemTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type ScratchpadCardTone = "yellow" | "pink" | "blue" | "green" | "purple";

export interface ScratchpadItem {
  id: string;
  layout: ScratchpadItemLayout;
  content: ScratchpadItemContent;
  sync: ScratchpadSyncState;
  timestamps: ScratchpadItemTimestamps;
  tone?: ScratchpadCardTone;
}

export interface ScratchpadDocument {
  items: ScratchpadItem[];
}

export interface ScratchpadItemPatch {
  layout?: Partial<ScratchpadItemLayout>;
  content?: Partial<ScratchpadItemContent>;
  sync?: Partial<ScratchpadSyncState>;
  timestamps?: Partial<ScratchpadItemTimestamps>;
  tone?: ScratchpadCardTone;
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  uploadedAt: Date;
}

export interface StorageQuota {
  usage: number;
  quota: number;
  percentage: number;
}

export interface SaveToMemosOptions {
  visibility?: "PRIVATE" | "PUBLIC" | "PROTECTED";
}

export interface ScratchAttachment {
  resourceName: string;
  filename: string;
  externalLink?: string;
  mimeType: string;
  sizeBytes?: string;
}

export interface ScratchMemo {
  memoRef: ScratchMemoRef;
  content: string;
  visibility: string;
  state?: string;
  createTime?: string;
  updateTime?: string;
  attachments?: ScratchAttachment[];
}

export interface ScratchUser {
  username: string;
  role: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  username?: string;
  serverProfile?: ScratchServerProfile;
  error?: string;
}
