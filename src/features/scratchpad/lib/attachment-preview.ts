export type AttachmentPreviewMode = "image" | "pdf" | "video" | "audio" | "text" | "download";

const TEXT_EXTENSIONS = new Set(["csv", "css", "js", "json", "jsx", "log", "md", "mdx", "ts", "tsx", "txt", "xml", "yaml", "yml"]);

const TEXT_MIME_TYPES = new Set([
  "application/javascript",
  "application/json",
  "application/ld+json",
  "application/markdown",
  "application/typescript",
  "application/xml",
  "application/x-javascript",
  "application/x-typescript",
  "image/svg+xml",
]);

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return "";
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

export function getAttachmentPreviewMode(type: string | undefined, fileName: string): AttachmentPreviewMode {
  const mimeType = type?.toLowerCase() ?? "";

  if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("text/") || TEXT_MIME_TYPES.has(mimeType)) return "text";
  if (TEXT_EXTENSIONS.has(getFileExtension(fileName))) return "text";

  return "download";
}

export function formatAttachmentSize(size: number): string {
  if (size < 1024) return `${size} B`;

  const units = ["KB", "MB", "GB"] as const;
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}
