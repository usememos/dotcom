"use client";

import { matchToken, mentions, scanMentions, scanTags, suggestion, type Theme, tags } from "@usememos/editor";
import { emoji } from "@usememos/editor/emoji";
import { MarkdownEditor } from "@usememos/editor/react";
import "@usememos/editor/style.css";

const KNOWN_TAGS = ["work", "work/editor", "work/planning", "reading", "ideas", "journal"];
const PEOPLE = [
  { username: "ada", name: "Ada Lovelace" },
  { username: "alan", name: "Alan Turing" },
  { username: "grace", name: "Grace Hopper" },
  { username: "katherine", name: "Katherine Johnson" },
];

// The editor follows the site's own variables, light and dark included.
const THEME: Theme = {
  tokens: {
    colors: {
      text: "var(--foreground)",
      muted: "var(--muted-foreground)",
      accent: "var(--primary)",
      link: "var(--primary)",
      codeBackground: "var(--muted)",
      border: "var(--border)",
      popupBackground: "var(--popover)",
      hover: "var(--accent)",
      danger: "var(--destructive)",
    },
    font: "inherit",
    mono: "var(--font-mono)",
    radius: 8,
  },
};

const MARKDOWN = { breaks: true, setext: false } as const;

const EXTENSIONS = [
  tags(),
  mentions(),
  suggestion({
    name: "tags",
    trigger: ["#", "＃"],
    match: matchToken(scanTags),
    label: "Tags",
    items: ({ query }) =>
      KNOWN_TAGS.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())).map((tag) => ({ id: tag, label: `#${tag}` })),
  }),
  suggestion({
    name: "people",
    trigger: ["@", "＠"],
    match: matchToken(scanMentions),
    label: "People",
    items: ({ query }) =>
      PEOPLE.filter(
        (person) => person.username.startsWith(query.toLowerCase()) || person.name.toLowerCase().includes(query.toLowerCase()),
      ).map((person) => ({ id: person.username, label: person.name, detail: `@${person.username}`, icon: person.name[0] })),
  }),
  emoji(),
];

const ATTRIBUTES = { "aria-label": "Editor playground", autocorrect: "on", autocapitalize: "sentences" };

export interface EditorPlaygroundLiveProps {
  value: string;
  mode: "rich" | "source";
  editable: boolean;
  onChange: (markdown: string) => void;
  onSubmit: (markdown: string) => void;
}

/** The published editor, configured as a note composer. Loaded on the client only. */
export default function EditorPlaygroundLive({ value, mode, editable, onChange, onSubmit }: EditorPlaygroundLiveProps) {
  return (
    <MarkdownEditor
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      mode={mode}
      editable={editable}
      taskToggle
      markdown={MARKDOWN}
      extensions={EXTENSIONS}
      theme={THEME}
      attributes={ATTRIBUTES}
      slashHint
      placeholder="Write something, or type / for commands…"
      className="min-h-full px-5 py-5 sm:px-7 sm:py-6"
    />
  );
}
