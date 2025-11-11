/**
 * API integration for connecting to Memos instances
 */

import type { MemoInstance, UserInfo, ConnectionTestResult, Memo, MemoResource, SaveToMemosOptions } from './types';

/**
 * Test connection to a Memos instance
 */
export async function testConnection(url: string, accessToken: string): Promise<ConnectionTestResult> {
  try {
    // Normalize URL
    const normalizedUrl = url.replace(/\/$/, '');

    const response = await fetch(`${normalizedUrl}/api/v1/auth/sessions/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: 'Invalid token or unauthorized' };
      }
      return { success: false, error: `Server error: ${response.status}` };
    }

    const data = await response.json() as UserInfo;

    return {
      success: true,
      username: data.username,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      return { success: false, error: 'Cannot connect. Check URL and network. CORS may need to be enabled on your instance.' };
    }
    return { success: false, error: 'Connection failed. Please check your instance URL.' };
  }
}

/**
 * Upload a file/resource to Memos instance
 */
export async function uploadResource(
  instance: MemoInstance,
  file: Blob,
  filename: string
): Promise<MemoResource> {
  const normalizedUrl = instance.url.replace(/\/$/, '');

  const formData = new FormData();
  formData.append('file', file, filename);

  const response = await fetch(`${normalizedUrl}/api/v1/resources`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${instance.accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as MemoResource;
}

/**
 * Create a memo in Memos instance
 */
export async function createMemo(
  instance: MemoInstance,
  content: string,
  options?: SaveToMemosOptions
): Promise<Memo> {
  const normalizedUrl = instance.url.replace(/\/$/, '');

  const body: {
    content: string;
    visibility?: string;
    resourceIdList?: string[];
  } = {
    content,
  };

  if (options?.visibility) {
    body.visibility = options.visibility;
  }

  const response = await fetch(`${normalizedUrl}/api/v1/memos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${instance.accessToken}`,
      'Content-Type': 'application/json',
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
 * Create a memo with resources
 */
export async function createMemoWithResources(
  instance: MemoInstance,
  content: string,
  resourceIds: string[],
  options?: SaveToMemosOptions
): Promise<Memo> {
  const normalizedUrl = instance.url.replace(/\/$/, '');

  const body: {
    content: string;
    visibility?: string;
    resourceIdList?: string[];
  } = {
    content,
    resourceIdList: resourceIds,
  };

  if (options?.visibility) {
    body.visibility = options.visibility;
  }

  const response = await fetch(`${normalizedUrl}/api/v1/memos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${instance.accessToken}`,
      'Content-Type': 'application/json',
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
  options?: SaveToMemosOptions
): Promise<Memo> {
  try {
    // Upload files first if any
    const resourceIds: string[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const resource = await uploadResource(instance, file.blob, file.name);
        resourceIds.push(resource.id);
      }
    }

    // Create memo with or without resources
    if (resourceIds.length > 0) {
      return await createMemoWithResources(instance, content, resourceIds, options);
    } else {
      return await createMemo(instance, content, options);
    }
  } catch (error) {
    console.error('Failed to save to Memos:', error);
    throw error;
  }
}
