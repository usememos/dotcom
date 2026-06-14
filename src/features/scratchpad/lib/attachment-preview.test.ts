import { describe, expect, it } from "vitest";
import { formatAttachmentSize, getAttachmentPreviewMode } from "./attachment-preview";

describe("getAttachmentPreviewMode", () => {
  it("classifies by MIME type", () => {
    expect(getAttachmentPreviewMode("image/png", "a.png")).toBe("image");
    expect(getAttachmentPreviewMode("application/pdf", "a.pdf")).toBe("pdf");
    expect(getAttachmentPreviewMode("video/mp4", "a.mp4")).toBe("video");
    expect(getAttachmentPreviewMode("audio/mpeg", "a.mp3")).toBe("audio");
    expect(getAttachmentPreviewMode("text/plain", "a.txt")).toBe("text");
  });

  it("treats SVG as text, not image", () => {
    expect(getAttachmentPreviewMode("image/svg+xml", "a.svg")).toBe("text");
  });

  it("falls back to the file extension when the MIME type is unknown", () => {
    expect(getAttachmentPreviewMode("", "notes.md")).toBe("text");
    expect(getAttachmentPreviewMode(undefined, "data.json")).toBe("text");
  });

  it("defaults to download for unrecognized files", () => {
    expect(getAttachmentPreviewMode("application/zip", "a.zip")).toBe("download");
    expect(getAttachmentPreviewMode("", "binary")).toBe("download");
  });
});

describe("formatAttachmentSize", () => {
  it("formats bytes, KB, MB with sensible precision", () => {
    expect(formatAttachmentSize(512)).toBe("512 B");
    expect(formatAttachmentSize(1536)).toBe("1.5 KB");
    expect(formatAttachmentSize(20 * 1024)).toBe("20 KB");
    expect(formatAttachmentSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
