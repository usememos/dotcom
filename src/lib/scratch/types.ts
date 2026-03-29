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

export interface MemoInstance {
  id: string;
  name: string; // e.g., "Personal Notes"
  url: string; // https://memo.example.com
  accessToken: string; // Encrypted
  isDefault: boolean;
  lastConnected: Date | null;
  status: ScratchInstanceStatus;
  serverProfile?: ScratchServerProfile;
}

export interface ScratchpadItem {
  id: string;
  type: "text" | "file";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // Stacking order (higher = on top)

  content?: string; // For text items (markdown)

  fileRef?: {
    // For file items
    id: string; // IndexedDB key
    name: string;
    type: string; // MIME type
    size: number;
  };

  savedToInstance?: string; // Instance ID if saved
  savedMemoRef?: ScratchMemoRef; // Remote memo resource name
  savedMemoId?: string; // Deprecated: old resource name storage

  createdAt: Date;
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
