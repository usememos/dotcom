import type { PullRequest, PullResponse, PushRequest, PushResponse } from "./types";

export interface SyncBackend {
  push(req: PushRequest): Promise<PushResponse>;
  pull(req: PullRequest): Promise<PullResponse>;
  hasBlob(hash: string): Promise<boolean>;
  putBlob(hash: string, data: Blob): Promise<void>;
  getBlob(hash: string): Promise<Blob>;
}
