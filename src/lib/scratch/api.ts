/**
 * API integration for connecting to Memos instances
 */

import type { Attachment, ConnectionTestResult, GetCurrentUserResponse, Memo, MemoInstance, SaveToMemosOptions } from "./types";

/**
 * Test connection to a Memos instance
 */
export async function testConnection(url: string, accessToken: string): Promise<ConnectionTestResult> {
  try {
    // Normalize URL
    const normalizedUrl = url.replace(/\/$/, "");

    const response = await fetch(`${normalizedUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Invalid token or unauthorized" };
      }
      return { success: false, error: `Server error: ${response.status}` };
    }

    const data = (await response.json()) as GetCurrentUserResponse;

    return {
      success: true,
      username: data.user?.username,
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
      error: "Connection failed. Please check your instance URL.",
    };
  }
}

/**
 * Upload an attachment to Memos instance
 */
export async function uploadAttachment(instance: MemoInstance, file: Blob, filename: string): Promise<Attachment> {
  const normalizedUrl = instance.url.replace(/\/$/, "");

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const base64 = btoa(binary);
  const mimeType = file.type || "application/octet-stream";

  const response = await fetch(`${normalizedUrl}/api/v1/attachments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${instance.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      type: mimeType,
      content: base64,
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as Attachment;
}

/**
 * Create a memo in Memos instance
 */
export async function createMemo(instance: MemoInstance, content: string, options?: SaveToMemosOptions): Promise<Memo> {
  const normalizedUrl = instance.url.replace(/\/$/, "");

  const body: {
    content: string;
    visibility?: string;
    state: string;
  } = {
    content,
    state: "NORMAL",
  };

  if (options?.visibility) {
    body.visibility = options.visibility;
  } else {
    body.visibility = "PRIVATE";
  }

  const response = await fetch(`${normalizedUrl}/api/v1/memos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${instance.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create memo: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as Memo;
}

/**
 * Create a memo with attachments
 */
export async function createMemoWithAttachments(
  instance: MemoInstance,
  content: string,
  attachments: Attachment[],
  options?: SaveToMemosOptions,
): Promise<Memo> {
  const memo = await createMemo(instance, content, options);
  if (!memo.name) {
    throw new Error("Failed to create memo: missing memo name");
  }

  const normalizedUrl = instance.url.replace(/\/$/, "");
  const response = await fetch(`${normalizedUrl}/api/v1/${memo.name}/attachments`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${instance.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: memo.name,
      attachments: attachments.map((attachment) => ({ name: attachment.name })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to set memo attachments: ${response.status} ${response.statusText}`);
  }

  return memo;
}

/**
 * Save a scratchpad item to Memos
 */
export async function saveScratchpadItemToMemos(
  instance: MemoInstance,
  content: string,
  files: { blob: Blob; name: string }[],
  options?: SaveToMemosOptions,
): Promise<Memo> {
  try {
    // Upload files first if any
    const attachments: Attachment[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const attachment = await uploadAttachment(instance, file.blob, file.name);
        attachments.push(attachment);
      }
    }

    // Create memo with or without attachments
    if (attachments.length > 0) {
      return await createMemoWithAttachments(instance, content, attachments, options);
    } else {
      return await createMemo(instance, content, options);
    }
  } catch (error) {
    console.error("Failed to save to Memos:", error);
    throw error;
  }
}
