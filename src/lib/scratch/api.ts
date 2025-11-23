/**
 * API integration for connecting to Memos instances
 */

import type { Attachment, ConnectionTestResult, Memo, MemoInstance, SaveToMemosOptions, UserInfo } from "./types";

/**
 * Test connection to a Memos instance
 */
export async function testConnection(url: string, accessToken: string): Promise<ConnectionTestResult> {
  try {
    // Normalize URL
    const normalizedUrl = url.replace(/\/$/, "");

    const response = await fetch(`${normalizedUrl}/api/v1/auth/sessions/current`, {
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

    const data = (await response.json()) as UserInfo;

    return {
      success: true,
      username: data.username,
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

  const formData = new FormData();
  formData.append("file", file, filename);

  const response = await fetch(`${normalizedUrl}/api/v1/attachments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${instance.accessToken}`,
    },
    body: formData,
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
    attachmentIdList?: string[];
  } = {
    content,
  };

  if (options?.visibility) {
    body.visibility = options.visibility;
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
  attachmentIds: string[],
  options?: SaveToMemosOptions,
): Promise<Memo> {
  const normalizedUrl = instance.url.replace(/\/$/, "");

  const body: {
    content: string;
    visibility?: string;
    attachmentIdList?: string[];
  } = {
    content,
    attachmentIdList: attachmentIds,
  };

  if (options?.visibility) {
    body.visibility = options.visibility;
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
    const attachmentIds: string[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const attachment = await uploadAttachment(instance, file.blob, file.name);
        attachmentIds.push(attachment.id);
      }
    }

    // Create memo with or without attachments
    if (attachmentIds.length > 0) {
      return await createMemoWithAttachments(instance, content, attachmentIds, options);
    } else {
      return await createMemo(instance, content, options);
    }
  } catch (error) {
    console.error("Failed to save to Memos:", error);
    throw error;
  }
}
