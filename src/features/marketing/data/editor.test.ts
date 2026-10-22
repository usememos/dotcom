import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { commands, loadMarkdown, serializeMarkdown } from "@usememos/editor";
import { describe, expect, it } from "vitest";
import {
  EDITOR_PLAYGROUND_SAMPLE,
  EDITOR_PRESERVE_AFTER,
  EDITOR_PRESERVE_BEFORE,
  EDITOR_PRESERVE_EDIT,
  EDITOR_PRESERVE_EDITED_LINE,
  EDITOR_VERSION,
} from "./editor";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");

describe("editor page facts", () => {
  it("shows the version that is installed", () => {
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    const installed = JSON.parse(readFileSync(join(repoRoot, "node_modules", "@usememos", "editor", "package.json"), "utf8")) as {
      version: string;
    };

    expect(packageJson.dependencies["@usememos/editor"]).toBe(EDITOR_VERSION);
    expect(installed.version).toBe(EDITOR_VERSION);
  });

  it("loads the playground sample without losing a byte", () => {
    const { doc, source } = loadMarkdown(EDITOR_PLAYGROUND_SAMPLE, { breaks: true, setext: false });

    expect(serializeMarkdown(doc, { source, breaks: true, setext: false })).toBe(EDITOR_PLAYGROUND_SAMPLE);
  });

  it("keeps every block it did not edit byte for byte in the preserved-source figure", () => {
    const { doc, source } = loadMarkdown(EDITOR_PRESERVE_BEFORE);
    const paragraph = doc.blocks.find((block) => block.type === "paragraph");
    if (paragraph?.type !== "paragraph") throw new Error("The figure needs one paragraph to edit.");

    const text = paragraph.content.map((span) => span.text).join("");
    expect(text).toBe(EDITOR_PRESERVE_EDITED_LINE);

    const caret = { blockId: paragraph.id, offset: text.length };
    let state = { doc, selection: { anchor: caret, focus: caret }, storedMarks: null };
    state = commands.insertText(state, EDITOR_PRESERVE_EDIT.plain);
    state = commands.toggleMark(state, "bold");
    state = commands.insertText(state, EDITOR_PRESERVE_EDIT.bold);
    state = commands.toggleMark(state, "bold");
    state = commands.insertText(state, EDITOR_PRESERVE_EDIT.tail);

    expect(serializeMarkdown(state.doc, { source })).toBe(EDITOR_PRESERVE_AFTER);
    // Without the source, the same document is normalized: the figure's point.
    expect(serializeMarkdown(state.doc)).not.toBe(EDITOR_PRESERVE_AFTER);
  });
});
