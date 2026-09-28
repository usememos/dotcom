import { FeatherIcon, GemIcon, LayoutGridIcon, NotebookIcon, StickyNoteIcon } from "lucide-react";
import type { ComparisonDefinition, ComparisonSlug } from "./types";

/**
 * Honest, fact-based comparisons. Each page is written to help the reader choose
 * correctly — including when the other tool is the better fit — which is what
 * earns trust and ranks for "Memos vs X" / "open-source X alternative" intent.
 */
export const COMPARISONS: Record<ComparisonSlug, ComparisonDefinition> = {
  obsidian: {
    competitor: "Obsidian",
    title: "Memos vs Obsidian",
    subtitle: "A personal timeline of short memos vs. a local-first vault of linked notes.",
    description:
      "Both use Markdown, but they solve different problems. Memos is a personal timeline of short, untitled memos, self-hosted on a server you reach from any browser. Obsidian is a local-first desktop and mobile app for building a vault of densely linked notes.",
    icon: GemIcon,
    summary:
      "Choose Memos if you want to write short memos into a timeline on your own server. Choose Obsidian if you want local Markdown files, backlinks, and a graph view on your own devices.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary (free to use)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local desktop & mobile app" },
      { label: "Sync", memos: "Server-based; open it in any browser", competitor: "Paid Obsidian Sync or third-party" },
      { label: "Format", memos: "Written in Markdown, stored in a database", competitor: "Markdown files on disk" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Linked notes & graph view" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; paid Sync & Publish add-ons" },
    ],
    chooseMemos: [
      "You want to write short, untitled memos into a timeline, not file pages into folders.",
      "You want one self-hosted web app you reach from any browser.",
      "You want to share a single memo publicly or by link without extra tooling.",
    ],
    chooseCompetitor: [
      "You are building long, densely linked notes with backlinks and a graph view.",
      "You want local files and full offline use on your own devices.",
      "You rely on a large community plugin ecosystem.",
    ],
    features: [
      { name: "Markdown", slug: "markdown-support" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "Lightweight", slug: "lightweight" },
    ],
    seo: {
      title: "Memos vs Obsidian: Open-Source, Self-Hosted Alternative",
      description:
        "Memos vs Obsidian: how a self-hosted, open-source notes app compares to Obsidian on licensing, hosting, sync, and Markdown — and when to choose each.",
      keywords: [
        "memos vs obsidian",
        "obsidian vs memos",
        "obsidian alternative",
        "open source obsidian alternative",
        "self-hosted obsidian alternative",
      ],
    },
  },
  joplin: {
    competitor: "Joplin",
    title: "Memos vs Joplin",
    subtitle: "Two open-source note apps with different shapes: a timeline vs. encrypted notebooks.",
    description:
      "Memos and Joplin are both open source, use Markdown, and can be self-hosted. Memos is a web-based personal timeline of short, untitled memos. Joplin is a notebook system with end-to-end encrypted sync across native desktop and mobile apps.",
    icon: NotebookIcon,
    summary:
      "Choose Memos for a self-hosted timeline of short memos you open in any browser. Choose Joplin for end-to-end encrypted notebooks and offline native clients.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local apps + self-hostable sync" },
      { label: "Sync", memos: "Server-based; open it in any browser", competitor: "End-to-end encrypted sync" },
      { label: "Format", memos: "Markdown memos with tags", competitor: "Markdown notes & notebooks" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Encrypted notebooks across devices" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; optional paid Joplin Cloud" },
    ],
    chooseMemos: [
      "You prefer writing into a timeline and adding tags later over filing notes into notebooks.",
      "You want a web-first instance you host once and reach anywhere.",
      "You want to share selected memos publicly in a microblog-style feed.",
    ],
    chooseCompetitor: [
      "You need end-to-end encrypted sync across native apps.",
      "You organize notes into notebooks and sub-notebooks.",
      "You want fully offline desktop and mobile clients.",
    ],
    features: [
      { name: "Open source", slug: "open-source" },
      { name: "Markdown", slug: "markdown-support" },
      { name: "Self-hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Memos vs Joplin: Open-Source, Self-Hosted Notes",
      description:
        "Memos vs Joplin compared: two open-source, self-hosted note apps. See hosting, sync, encryption, and Markdown — and which fits your workflow.",
      keywords: ["memos vs joplin", "joplin vs memos", "joplin alternative", "open source note app", "self-hosted notes app"],
    },
  },
  notion: {
    competitor: "Notion",
    title: "Memos vs Notion",
    subtitle: "An open-source, self-hosted timeline of memos vs. a hosted workspace for docs and databases.",
    description:
      "Notion is a hosted workspace with pages, databases, and team collaboration. Memos goes the other way: a personal timeline of short memos, open source and running on a server you choose.",
    icon: LayoutGridIcon,
    summary:
      "Choose Memos to write short memos without a page editor and keep them on your own server. Choose Notion for structured databases and team collaboration in the cloud.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Cloud SaaS (hosted by Notion)" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Stored on Notion's servers" },
      { label: "Format", memos: "Written in Markdown", competitor: "Blocks (Markdown import/export)" },
      { label: "Best for", memos: "Short personal memos", competitor: "Shared docs, wikis & databases" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Freemium; paid plans for teams" },
    ],
    chooseMemos: [
      "You want your memos on your own server, with a ZIP export when you need it.",
      "You want to write a quick memo without setting up a page or a database.",
      "You want open-source software with no license fee.",
    ],
    chooseCompetitor: [
      "You need structured databases, kanban boards, and rich documents.",
      "You collaborate with a team in shared workspaces.",
      "You prefer a managed cloud you do not have to operate.",
    ],
    features: [
      { name: "Lightweight", slug: "lightweight" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "Data ownership", slug: "data-ownership" },
    ],
    seo: {
      title: "Memos vs Notion: Self-Hosted, Open-Source Alternative",
      description:
        "Looking for a self-hosted, open-source Notion alternative? See how Memos compares to Notion on hosting, data ownership, cost, and features.",
      keywords: [
        "memos vs notion",
        "notion vs memos",
        "notion alternative",
        "open source notion alternative",
        "self-hosted notion alternative",
      ],
    },
  },
  "google-keep": {
    competitor: "Google Keep",
    title: "Memos vs Google Keep",
    subtitle: "Short notes on your own server vs. quick notes in your Google account.",
    description:
      "Google Keep is a free, zero-setup note app tied to your Google account. Memos is also built for short notes: a personal timeline of memos written in Markdown, on a server you choose instead of Google's.",
    icon: StickyNoteIcon,
    summary:
      "Choose Memos to keep short Markdown memos on your own server. Choose Google Keep for zero-setup notes and reminders inside the Google ecosystem.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Google cloud account" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Tied to your Google account" },
      { label: "Format", memos: "Written in Markdown", competitor: "Plain notes & lists, no Markdown" },
      { label: "Best for", memos: "Short memos on your server", competitor: "Zero-setup quick notes" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free with a Google account" },
    ],
    chooseMemos: [
      "You want your notes on a server you run instead of in Google's cloud.",
      "You want Markdown, tags, and search over your own timeline, with new memos private by default.",
      "You want an open-source tool with zero telemetry.",
    ],
    chooseCompetitor: [
      "You want zero setup and instant sync across Google apps.",
      "You mainly jot short notes, lists, and reminders.",
      "You do not want to run a server.",
    ],
    features: [
      { name: "Quick capture", slug: "quick-capture" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "Open source", slug: "open-source" },
    ],
    seo: {
      title: "Memos: An Open-Source, Self-Hosted Google Keep Alternative",
      description:
        "Memos is an open-source, self-hosted Google Keep alternative. Compare hosting, privacy, Markdown, and cost — and see when to choose each.",
      keywords: [
        "google keep alternative",
        "open source google keep alternative",
        "google keep alternative open source",
        "self-hosted google keep",
        "memos vs google keep",
      ],
    },
  },
  evernote: {
    competitor: "Evernote",
    title: "Memos vs Evernote",
    subtitle: "A self-hosted timeline of short memos vs. a cloud notebook app.",
    description:
      "Evernote is a mature cloud notebook app with clipping and search on a freemium plan. Memos is a personal timeline of short memos written in Markdown: open source, self-hosted, and with no subscription or note limits in the software.",
    icon: FeatherIcon,
    summary:
      "Choose Memos for short memos on a server you control, with no license fee. Choose Evernote for OCR, document search, and polished native apps if you are comfortable in the cloud.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Cloud SaaS (hosted by Evernote)" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Stored on Evernote's servers" },
      { label: "Format", memos: "Written in Markdown", competitor: "Rich-text notebooks" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Web clipping & cross-notebook search" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Freemium; paid plans for full use" },
    ],
    chooseMemos: [
      "You want self-hosted, open-source software with no subscription or note limits.",
      "You prefer short Markdown memos over formatted notebook pages.",
      "You want your memos on your own server, with a ZIP export when you need it.",
    ],
    chooseCompetitor: [
      "You rely on OCR, document scanning, and search inside PDFs and images.",
      "You want polished native apps on desktop and mobile.",
      "You do not want to self-host.",
    ],
    features: [
      { name: "Import", slug: "import" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "No fees", slug: "no-fees" },
    ],
    seo: {
      title: "Memos: An Open-Source, Self-Hosted Evernote Alternative",
      description:
        "Memos is a free, open-source, self-hosted Evernote alternative. Compare hosting, data ownership, Markdown, and cost before you switch.",
      keywords: [
        "evernote alternative",
        "open source evernote alternative",
        "self-hosted evernote alternative",
        "free evernote alternative",
        "memos vs evernote",
      ],
    },
  },
};
