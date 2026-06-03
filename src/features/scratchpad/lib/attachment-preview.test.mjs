import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { getAttachmentPreviewMode } = await import("./attachment-preview.ts");

test("classifies browser-native media preview types", () => {
  assert.equal(getAttachmentPreviewMode("image/png", "photo.png"), "image");
  assert.equal(getAttachmentPreviewMode("application/pdf", "paper.pdf"), "pdf");
  assert.equal(getAttachmentPreviewMode("video/mp4", "clip.mp4"), "video");
  assert.equal(getAttachmentPreviewMode("audio/mpeg", "song.mp3"), "audio");
});

test("classifies text-like files for inline text preview", () => {
  assert.equal(getAttachmentPreviewMode("text/plain", "card.txt"), "text");
  assert.equal(getAttachmentPreviewMode("application/json", "data.json"), "text");
  assert.equal(getAttachmentPreviewMode("application/xml", "feed.xml"), "text");
  assert.equal(getAttachmentPreviewMode("", "README.md"), "text");
  assert.equal(getAttachmentPreviewMode("application/octet-stream", "script.ts"), "text");
});

test("falls back for files without a simple in-page preview", () => {
  assert.equal(getAttachmentPreviewMode("application/zip", "archive.zip"), "download");
  assert.equal(getAttachmentPreviewMode("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "doc.docx"), "download");
});
