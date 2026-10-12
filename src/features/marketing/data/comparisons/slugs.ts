/**
 * All available comparison slugs - used for static generation and routing.
 * Each targets both "Memos vs X" and "open-source/self-hosted X alternative"
 * search intent. Order here is the fallback order on the index page.
 */
export const COMPARISON_SLUGS = [
  "obsidian",
  "joplin",
  "notion",
  "google-keep",
  "evernote",
  "apple-notes",
  "standard-notes",
  "trilium",
  "logseq",
  "onenote",
  "simplenote",
  "nextcloud-notes",
  "bear",
  "day-one",
  "notesnook",
  "anytype",
] as const;
