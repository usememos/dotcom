import { useEffect, useMemo, useState } from "react";
import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadItem } from "../types";

interface AttachmentPreview {
  id: string;
  fileData: FileData | null;
  previewUrl: string | null;
}

export function useAttachmentPreviews(attachments: ScratchpadItem["attachments"]): Map<string, AttachmentPreview> {
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const loadAttachments = async () => {
      const previews = await Promise.all(
        attachments.map(async (attachment) => {
          const fileData = await getFile(attachment.id);
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
