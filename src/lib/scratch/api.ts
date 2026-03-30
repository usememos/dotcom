/**
 * Scratchpad API helpers for Memos compatibility and save operations.
 */

import type {
  ConnectionTestResult,
  MemoInstance,
  SaveToMemosOptions,
  ScratchAttachment,
  ScratchMemo,
  ScratchMemoRef,
  ScratchpadItem,
  ScratchServerProfile,
  ScratchSupportStatus,
  ScratchUser,
  ScratchVersionFamily,
} from "./types";

interface RawAttachment {
  name: string;
  filename: string;
  externalLink?: string;
  type: string;
  size?: string;
}

interface RawMemo {
  name: string;
  content: string;
  visibility: string;
  state?: string;
  createTime?: string;
  updateTime?: string;
  attachments?: RawAttachment[];
}

interface RawUser {
  username: string;
  role: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}

interface RawGetCurrentUserResponse {
  user: RawUser;
}

interface RawInstanceProfileResponse {
  version?: string;
}

const SUPPORTED_VERSION_MESSAGE = "Scratchpad supports Memos 0.26.x and latest.";

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function parseVersionParts(version?: string): number[] | null {
  if (!version) return null;

  const match = version.trim().match(/^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/i);
  if (!match) return null;

  return match.slice(1).map((part) => Number.parseInt(part, 10));
}

function compareVersionParts(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left !== right) {
      return left - right;
    }
  }

  return 0;
}

export function resolveVersionFamily(rawVersion?: string): ScratchVersionFamily {
  const parsed = parseVersionParts(rawVersion);
  if (!parsed) {
    return "unknown";
  }

  if (parsed[0] === 0 && parsed[1] === 26) {
    return "0.26.x";
  }

  if (compareVersionParts(parsed, [0, 26, 0]) > 0) {
    return "latest";
  }

  return "unsupported";
}

function getSupportStatus(versionFamily: ScratchVersionFamily): ScratchSupportStatus {
  if (versionFamily === "0.26.x" || versionFamily === "latest") {
    return "supported";
  }

  if (versionFamily === "unsupported") {
    return "unsupported";
  }

  return "unknown";
}

function getUnsupportedReasons(versionFamily: ScratchVersionFamily, rawVersion?: string, canReadInstanceProfile: boolean = true): string[] {
  if (versionFamily === "0.26.x" || versionFamily === "latest") {
    return [];
  }

  if (!canReadInstanceProfile) {
    return [`${SUPPORTED_VERSION_MESSAGE} Scratchpad could not read /api/v1/instance/profile for this instance.`];
  }

  if (versionFamily === "unknown") {
    return [`${SUPPORTED_VERSION_MESSAGE} Scratchpad could not parse the server version${rawVersion ? ` (${rawVersion})` : ""}.`];
  }

  return [`${SUPPORTED_VERSION_MESSAGE} Detected ${rawVersion ?? "an older version"}.`];
}

function buildServerProfile(rawVersion: string | undefined, canReadInstanceProfile: boolean): ScratchServerProfile {
  const versionFamily = canReadInstanceProfile ? resolveVersionFamily(rawVersion) : "unknown";
  const supported = versionFamily === "0.26.x" || versionFamily === "latest";

  return {
    rawVersion,
    versionFamily,
    supportStatus: getSupportStatus(versionFamily),
    detectedAt: new Date(),
    capabilities: {
      canReadInstanceProfile,
      canCreateMemo: supported,
      canUploadAttachment: supported,
      canSetMemoAttachments: supported,
      unsupportedReasons: getUnsupportedReasons(versionFamily, rawVersion, canReadInstanceProfile),
    },
  };
}

function mapUser(user: RawUser): ScratchUser {
  return {
    username: user.username,
    role: user.role,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
}

function mapAttachment(attachment: RawAttachment): ScratchAttachment {
  return {
    resourceName: attachment.name,
    filename: attachment.filename,
    externalLink: attachment.externalLink,
    mimeType: attachment.type,
    sizeBytes: attachment.size,
  };
}

function mapMemo(memo: RawMemo): ScratchMemo {
  return {
    memoRef: { resourceName: memo.name },
    content: memo.content,
    visibility: memo.visibility,
    state: memo.state,
    createTime: memo.createTime,
    updateTime: memo.updateTime,
    attachments: memo.attachments?.map(mapAttachment),
  };
}

async function requestJson<T>(input: string, init: RequestInit, errors: { unauthorized?: string; fallback: string }): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    if (response.status === 401 && errors.unauthorized) {
      throw new Error(errors.unauthorized);
    }

    throw new Error(`${errors.fallback}: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function fetchCurrentUser(url: string, accessToken: string): Promise<ScratchUser> {
  const normalizedUrl = normalizeUrl(url);
  const data = await requestJson<RawGetCurrentUserResponse>(
    `${normalizedUrl}/api/v1/auth/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
    {
      unauthorized: "Invalid token or unauthorized",
      fallback: "Connection failed",
    },
  );

  return mapUser(data.user);
}

async function fetchInstanceProfile(url: string, accessToken: string): Promise<RawInstanceProfileResponse> {
  const normalizedUrl = normalizeUrl(url);
  return await requestJson<RawInstanceProfileResponse>(
    `${normalizedUrl}/api/v1/instance/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
    {
      unauthorized: "Invalid token or unauthorized",
      fallback: "Failed to read instance profile",
    },
  );
}

async function uploadAttachment(instance: MemoInstance, file: Blob, filename: string): Promise<ScratchAttachment> {
  const normalizedUrl = normalizeUrl(instance.url);
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  const data = await requestJson<RawAttachment>(
    `${normalizedUrl}/api/v1/attachments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${instance.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename,
        type: file.type || "application/octet-stream",
        content: btoa(binary),
      }),
    },
    {
      fallback: "Failed to upload attachment",
    },
  );

  return mapAttachment(data);
}

async function createMemo(instance: MemoInstance, content: string, options?: SaveToMemosOptions): Promise<ScratchMemo> {
  const normalizedUrl = normalizeUrl(instance.url);
  const data = await requestJson<RawMemo>(
    `${normalizedUrl}/api/v1/memos`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${instance.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        state: "NORMAL",
        visibility: options?.visibility ?? "PRIVATE",
      }),
    },
    {
      fallback: "Failed to create memo",
    },
  );

  return mapMemo(data);
}

async function updateMemo(
  instance: MemoInstance,
  memoRef: ScratchMemoRef,
  content: string,
  options?: SaveToMemosOptions,
): Promise<ScratchMemo> {
  const normalizedUrl = normalizeUrl(instance.url);
  const updateMask = encodeURIComponent("content,visibility,state");

  const data = await requestJson<RawMemo>(
    `${normalizedUrl}/api/v1/${memoRef.resourceName}?updateMask=${updateMask}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${instance.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: memoRef.resourceName,
        content,
        state: "NORMAL",
        visibility: options?.visibility ?? "PRIVATE",
      }),
    },
    {
      fallback: "Failed to update memo",
    },
  );

  return mapMemo(data);
}

async function setMemoAttachments(instance: MemoInstance, memoRef: ScratchMemoRef, attachments: ScratchAttachment[]): Promise<void> {
  const normalizedUrl = normalizeUrl(instance.url);
  const response = await fetch(`${normalizedUrl}/api/v1/${memoRef.resourceName}/attachments`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${instance.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: memoRef.resourceName,
      attachments: attachments.map((attachment) => ({ name: attachment.resourceName })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to set memo attachments: ${response.status} ${response.statusText}`);
  }
}

function getUnsupportedReason(profile: ScratchServerProfile): string {
  return profile.capabilities.unsupportedReasons[0] ?? "This Memos instance is not supported by Scratchpad.";
}

function assertSupportedProfile(profile: ScratchServerProfile): void {
  if (profile.supportStatus !== "supported") {
    throw new Error(getUnsupportedReason(profile));
  }
}

export async function detectServerProfile(
  url: string,
  accessToken: string,
): Promise<{ user: ScratchUser; serverProfile: ScratchServerProfile }> {
  const user = await fetchCurrentUser(url, accessToken);

  try {
    const instanceProfile = await fetchInstanceProfile(url, accessToken);
    return {
      user,
      serverProfile: buildServerProfile(instanceProfile.version, true),
    };
  } catch {
    return {
      user,
      serverProfile: buildServerProfile(undefined, false),
    };
  }
}

export async function refreshMemoInstanceProfile(instance: MemoInstance): Promise<MemoInstance> {
  const { serverProfile } = await detectServerProfile(instance.url, instance.accessToken);

  return {
    ...instance,
    url: normalizeUrl(instance.url),
    serverProfile,
    status: serverProfile.supportStatus === "supported" ? "connected" : "unsupported",
    lastConnected: new Date(),
  };
}

export function getSaveBlockReason(instance: MemoInstance | null | undefined, requiresFiles: boolean): string | null {
  const profile = instance?.serverProfile;
  if (!profile) {
    return null;
  }

  if (profile.supportStatus !== "supported") {
    return getUnsupportedReason(profile);
  }

  if (!profile.capabilities.canCreateMemo) {
    return getUnsupportedReason(profile);
  }

  if (requiresFiles && (!profile.capabilities.canUploadAttachment || !profile.capabilities.canSetMemoAttachments)) {
    return getUnsupportedReason(profile);
  }

  return null;
}

export async function testConnection(url: string, accessToken: string): Promise<ConnectionTestResult> {
  try {
    const { user, serverProfile } = await detectServerProfile(url, accessToken);
    return {
      success: true,
      username: user.username,
      serverProfile,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      return {
        success: false,
        error: "Cannot connect. Check URL and network. CORS may need to be enabled on your instance.",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed. Please check your instance URL.",
    };
  }
}

export async function saveScratchpadItemToMemos(
  instance: MemoInstance,
  item: ScratchpadItem,
  files: { blob: Blob; name: string }[],
  options?: SaveToMemosOptions,
): Promise<ScratchMemo> {
  const profile = instance.serverProfile;
  if (!profile) {
    throw new Error("Instance profile is missing. Test the connection before saving.");
  }

  assertSupportedProfile(profile);

  const trimmedBody = item.body.trim();
  const attachmentSummary = files.map((file) => file.name);
  const content =
    trimmedBody ||
    (attachmentSummary.length === 1
      ? `Attachment: ${attachmentSummary[0]}`
      : attachmentSummary.map((filename) => `- ${filename}`).join("\n"));

  if (!content) {
    throw new Error("Cannot save an empty card to Memos.");
  }

  const attachments: ScratchAttachment[] = [];
  for (const file of files) {
    attachments.push(await uploadAttachment(instance, file.blob, file.name));
  }

  const memo = item.sync.memoRef
    ? await updateMemo(instance, item.sync.memoRef, content, options)
    : await createMemo(instance, content, options);

  await setMemoAttachments(instance, memo.memoRef, attachments);
  return {
    ...memo,
    attachments,
  };
}
