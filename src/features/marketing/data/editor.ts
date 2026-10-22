/**
 * Facts about `@usememos/editor` shown on /editor. Keep them in step with the
 * pinned dependency in package.json; `editor.test.ts` checks the version.
 */

export const EDITOR_PACKAGE_NAME = "@usememos/editor";
export const EDITOR_VERSION = "26.10.25";
export const EDITOR_GITHUB_URL = "https://github.com/usememos/editor";
export const EDITOR_NPM_URL = "https://www.npmjs.com/package/@usememos/editor";
export const EDITOR_README_URL = `${EDITOR_GITHUB_URL}#readme`;
export const EDITOR_SYNTAX_DOC_URL = `${EDITOR_GITHUB_URL}/blob/main/docs/syntax.md`;
export const EDITOR_ARCHITECTURE_DOC_URL = `${EDITOR_GITHUB_URL}/blob/main/docs/architecture.md`;
export const EDITOR_LICENSE_URL = `${EDITOR_GITHUB_URL}/blob/main/LICENSE`;
export const EDITOR_INSTALL_COMMAND = `npm install ${EDITOR_PACKAGE_NAME}`;

/** What people type in the playground. Note style, as Memos uses it: line breaks stay, no setext headings. */
export const EDITOR_PLAYGROUND_SAMPLE = `## Release notes #work/editor

This is **@usememos/editor**, the block editor inside Memos. It edits blocks and stores *Markdown*, nothing else. Type \`/\` for a block, \`#\` for a tag, \`@\` for a person, or select some text for the toolbar.

- [x] Watch the Markdown pane while you type
- [ ] Press Tab on a list item to nest it
- [ ] Type \`> [!tip] \` at the start of a line

> [!TIP]
> A block you did not touch is saved exactly as it was loaded.

| Shortcut | Becomes |
| :-- | :-- |
| \`# \` | Heading |
| \`- [ ] \` | Task |
| \`---\` | Divider |

\`\`\`ts
const editor = new Editor({ element, content, onChange });
\`\`\`

Ask @ada to try the link card, then file it under #reading.
`;

/**
 * The preserved-source figure. The "after" text is what the package's own
 * serializer writes once the paragraph gains " Follow up with **Ada**."; the
 * test in editor.test.ts performs that edit and compares.
 */
export const EDITOR_PRESERVE_BEFORE = `Weekly review
=============

* Ship the editor page
* Reply to the issue

Notes from Tuesday's call.

1) Draft the copy
2) Check it on a phone
`;

export const EDITOR_PRESERVE_EDIT = { plain: " Follow up with ", bold: "Ada", tail: "." } as const;

export const EDITOR_PRESERVE_AFTER = `Weekly review
=============

* Ship the editor page
* Reply to the issue

Notes from Tuesday's call. Follow up with **Ada**.

1) Draft the copy
2) Check it on a phone
`;

/** The one line the edit changes, by its text in `EDITOR_PRESERVE_BEFORE`. */
export const EDITOR_PRESERVE_EDITED_LINE = "Notes from Tuesday's call.";

export const EDITOR_TYPING_SHORTCUTS = [
  { typed: "# ", becomes: "Heading, levels 1 to 6" },
  { typed: "- ", becomes: "Bullet list item" },
  { typed: "1. ", becomes: "Numbered list item, starting at that number" },
  { typed: "[ ] ", becomes: "Task list item" },
  { typed: "> ", becomes: "Quote" },
  { typed: "> [!tip] ", becomes: "Callout: note, tip, important, warning or caution" },
  { typed: ">>> ", becomes: "Collapsible section with the rest of the line as its title" },
  { typed: "```ts ", becomes: "Code block in that language" },
  { typed: "---", becomes: "Divider, on the third dash" },
  { typed: "**bold**", becomes: "Bold, with the asterisks removed as you close them" },
] as const;

export const EDITOR_REACT_SNIPPET = `import { MarkdownEditor } from "@usememos/editor/react";
import "@usememos/editor/style.css";

function CommentBox() {
  const [markdown, setMarkdown] = useState("");
  return (
    <MarkdownEditor
      value={markdown}
      onChange={setMarkdown}
      onSubmit={post}
      placeholder="Leave a comment…"
    />
  );
}`;

export const EDITOR_VANILLA_SNIPPET = `import { Editor } from "@usememos/editor";
import "@usememos/editor/style.css";

const editor = new Editor({
  element: document.querySelector("#editor"),
  content: "# Hello",
  onChange: (markdown) => save(markdown),
});`;

export const EDITOR_THEME_SNIPPET = `:root {
  --mbe-accent-light: #0969da;
  --mbe-accent-dark: #58a6ff;
  --mbe-font: Inter, sans-serif;
}`;

/** Date of the editor project's size measurements (`npm run size`, minified and gzipped, 1 KB = 1,000 bytes). */
export const EDITOR_SIZE_MEASURED_ON = "2026-10-13";

/**
 * The same measurement for other editors set up for Markdown with tables,
 * task lists and undo, from docs/architecture.md (npm versions of 2026-10-13,
 * React not included).
 */
export const EDITOR_SIZE_COMPARISON: readonly { name: string; detail: string; kb: number; subject?: boolean }[] = [
  { name: "@usememos/editor", detail: "Editor only", kb: 56, subject: true },
  { name: "Milkdown 7.22", detail: "Kit: core, CommonMark and GFM presets, history, listener", kb: 141 },
  { name: "Tiptap 3.31", detail: "StarterKit, Markdown, tables, task lists", kb: 155 },
  { name: "Lexical 0.52", detail: "Rich text, history, Markdown, lists, links, code, tables", kb: 160 },
  { name: "CodeMirror 6", detail: "As Memos set it up before: lang-markdown with GFM, autocomplete, history", kb: 185 },
];
