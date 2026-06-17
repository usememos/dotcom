import { useEffect, useMemo, useState } from "react";
import { getFile } from "../lib/indexeddb";
import { getLocalBlob } from "../sync/blobs";
import type { FileData, ScratchpadAttachmentRef } from "../types";

interface AttachmentPreview {
  id: string;
  fileData: FileData | null;
  previewUrl: string | null;
}

export function useAttachmentPreviews(attachments: ScratchpadAttachmentRef[]): Map<string, AttachmentPreview> {
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const loadAttachments = async () => {
      const previews = await Promise.all(
        attachments.map(async (attachment) => {
          let fileData = await getFile(attachment.id);
          if (!fileData && attachment.hash) {
            const local = await getLocalBlob(attachment.hash);
            if (local) {
              fileData = {
                id: attachment.id,
                name: local.name,
                type: local.type,
                size: local.size,
                blob: local.blob,
                uploadedAt: new Date(),
              };
            }
          }
          if (cancelled || !fileData) {
            return {
              id: attachment.id,
              fileData: null,
              previewUrl: null,
            };
          }

          if (fileData.type.startsWith("image/")) {
            const url = URL.createObjectURL(fileData.blob);
            urls.push(url);
            return {
              id: attachment.id,
              fileData,
              previewUrl: url,
            };
          }

          return {
            id: attachment.id,
            fileData,
            previewUrl: null,
          };
        }),
      );

      if (!cancelled) {
        setAttachmentPreviews(previews);
      }
    };

    void loadAttachments();

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachments]);

  return useMemo(() => new Map(attachmentPreviews.map((preview) => [preview.id, preview])), [attachmentPreviews]);
}
