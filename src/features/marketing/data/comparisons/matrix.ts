import type { FeatureCell } from "./types";

/** Section labels that break the matrix into readable groups, in display order. */
export const FEATURE_MATRIX_GROUPS = ["Ownership", "Writing", "Reach", "Data"] as const;

export type FeatureMatrixGroup = (typeof FEATURE_MATRIX_GROUPS)[number];

/**
 * Rows of the shared feature matrix, in display order. Every comparison answers
 * each row for the competitor; Memos' answers are fixed below so the sixteen
 * pages never drift apart on what Memos does.
 */
export const FEATURE_MATRIX_ROWS = [
  { key: "openSource", label: "Open source", group: "Ownership" },
  { key: "selfHosting", label: "Self-hosting", group: "Ownership" },
  { key: "hostedService", label: "Official hosted service", group: "Ownership" },
  { key: "storage", label: "Where notes live", group: "Ownership" },
  { key: "price", label: "Price", group: "Ownership" },
  { key: "markdown", label: "Markdown", group: "Writing" },
  { key: "tags", label: "Tags", group: "Writing" },
  { key: "linking", label: "Links between notes", group: "Writing" },
  { key: "attachments", label: "Attachments", group: "Writing" },
  { key: "search", label: "Full-text search", group: "Writing" },
  { key: "offline", label: "Works offline", group: "Reach" },
  { key: "desktopApp", label: "Desktop app", group: "Reach" },
  { key: "mobileApp", label: "Mobile app", group: "Reach" },
  { key: "sync", label: "Cross-device sync", group: "Reach" },
  { key: "publicSharing", label: "Public sharing", group: "Reach" },
  { key: "api", label: "API and webhooks", group: "Data" },
  { key: "importExport", label: "Import and export", group: "Data" },
  { key: "e2ee", label: "End-to-end encryption", group: "Data" },
] as const satisfies readonly { key: string; label: string; group: FeatureMatrixGroup }[];

type MatrixKey = (typeof FEATURE_MATRIX_ROWS)[number]["key"];

/** Memos' column, stated honestly, including the rows where it says no. */
export const MEMOS_MATRIX: Record<MatrixKey, FeatureCell> = {
  openSource: { support: "yes", detail: "MIT license, developed in public on GitHub" },
  selfHosting: { support: "yes", detail: "Docker image or a single binary on your server" },
  hostedService: { support: "no", detail: "No official hosted plan; you run the instance" },
  markdown: { support: "yes", detail: "Write in Markdown with live rendering, code blocks, and math" },
  offline: { support: "no", detail: "Browser app; reading and writing need a reachable server" },
  desktopApp: { support: "partial", detail: "Install the web app as a PWA; no official native app" },
  mobileApp: { support: "partial", detail: "PWA on iOS and Android, plus community-built apps" },
  sync: { support: "yes", detail: "The server is the source of truth, so every device sees the same memos" },
  tags: { support: "yes", detail: "Inline #tags, nested with a slash" },
  linking: { support: "yes", detail: "Relations link memos to each other" },
  publicSharing: { support: "yes", detail: "Per-memo visibility: private, workspace, or public link" },
  attachments: { support: "yes", detail: "Images and files, stored on disk or in S3" },
  search: { support: "yes", detail: "Full-text search with tag, date, and visibility filters" },
  api: { support: "yes", detail: "REST and gRPC APIs, signed webhooks" },
  importExport: { support: "partial", detail: "ZIP export of Markdown and JSON; import from Memos exports only" },
  e2ee: { support: "no", detail: "The server you run can read your memos; protect it with TLS and disk encryption" },
  storage: { detail: "SQLite, MySQL, or PostgreSQL on your server" },
  price: { detail: "No license fee; you pay for hosting" },
};
