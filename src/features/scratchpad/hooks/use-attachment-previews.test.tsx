import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/indexeddb", () => ({ getFile: vi.fn() }));

import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadAttachmentRef } from "../types";
import { useAttachmentPreviews } from "./use-attachment-previews";

const ref = (id: string, type: string): ScratchpadAttachmentRef => ({ id, name: `${id}`, type, size: 1 });
const fileData = (id: string, type: string): FileData => ({ id, name: id, type, size: 1, blob: new Blob(["x"]), uploadedAt: new Date() });

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("useAttachmentPreviews", () => {
  it("creates object URLs for image attachments and indexes them by id", async () => {
    vi.mocked(getFile).mockResolvedValue(fileData("img", "image/png"));
    const { result } = renderHook(() => useAttachmentPreviews([ref("img", "image/png")]));

    await waitFor(() => expect(result.current.get("img")?.previewUrl).toMatch(/^blob:/));
    expect(result.current.get("img")?.fileData?.type).toBe("image/png");
  });

  it("leaves previewUrl null for non-image attachments", async () => {
    vi.mocked(getFile).mockResolvedValue(fileData("doc", "application/pdf"));
    const { result } = renderHook(() => useAttachmentPreviews([ref("doc", "application/pdf")]));

    await waitFor(() => expect(result.current.get("doc")).toBeDefined());
    expect(result.current.get("doc")?.previewUrl).toBeNull();
  });

  it("revokes created object URLs on unmount", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    vi.mocked(getFile).mockResolvedValue(fileData("img", "image/png"));
    const { result, unmount } = renderHook(() => useAttachmentPreviews([ref("img", "image/png")]));

    await waitFor(() => expect(result.current.get("img")?.previewUrl).toMatch(/^blob:/));
    unmount();
    expect(revoke).toHaveBeenCalled();
  });
});
