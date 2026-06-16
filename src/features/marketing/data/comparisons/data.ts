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
    subtitle: "A self-hosted timeline for quick capture vs. a local-first knowledge base.",
    description:
      "Both keep your notes in Markdown, but they solve different problems. Memos is a self-hosted web app for fast, chronological capture you reach from any device. Obsidian is a local-first desktop and mobile app for building a densely linked knowledge base.",
    icon: GemIcon,
    summary:
      "Choose Memos if you want quick, private capture on your own server. Choose Obsidian if you want an offline, deeply linked knowledge graph on a single machine.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary (free for personal use)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local desktop & mobile app" },
      { label: "Sync", memos: "Built in via your server", competitor: "Paid Obsidian Sync or third-party" },
      { label: "Format", memos: "Markdown-native", competitor: "Markdown files on disk" },
      { label: "Best for", memos: "Fast capture into a timeline", competitor: "Linked knowledge base & graph" },
      { label: "Cost", memos: "Free (you host)", competitor: "Free personal; paid sync & commercial" },
    ],
    chooseMemos: [
      "You want quick capture into a chronological feed, not a folder tree.",
      "You want a self-hosted web app you reach from any device.",
      "You want to share selected notes publicly without extra tooling.",
    ],
    chooseCompetitor: [
      "You are building a densely linked knowledge base with backlinks and a graph view.",
      "You work mostly offline on a single machine.",
      "You rely on a large community plugin ecosystem.",
    ],
    features: [
      { name: "Markdown-native", slug: "markdown-support" },
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
      "Memos and Joplin are both open source, Markdown-based, and self-hostable. Memos is a lightweight, web-first timeline for quick capture. Joplin is a notebook system with end-to-end encrypted sync across native desktop and mobile apps.",
    icon: NotebookIcon,
    summary:
      "Choose Memos for a lightweight self-hosted feed you reach from the browser. Choose Joplin for end-to-end encrypted notebooks and offline native clients.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local apps + self-hostable sync" },
      { label: "Sync", memos: "Built in via your server", competitor: "End-to-end encrypted sync" },
      { label: "Format", memos: "Markdown-native", competitor: "Markdown notes & notebooks" },
      { label: "Best for", memos: "Fast capture into a timeline", competitor: "Encrypted notebooks across devices" },
      { label: "Cost", memos: "Free (you host)", competitor: "Free; optional paid Joplin Cloud" },
    ],
    chooseMemos: [
      "You prefer a lightweight timeline over notebooks and folders.",
      "You want a web-first instance you host once and reach anywhere.",
      "You want public sharing and a microblog-style feed.",
    ],
    chooseCompetitor: [
      "You need end-to-end encrypted sync across native apps.",
      "You organize notes into notebooks and sub-notebooks.",
      "You want a built-in web clipper and fully offline desktop clients.",
    ],
    features: [
      { name: "Open source", slug: "open-source" },
      { name: "Markdown-native", slug: "markdown-support" },
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
    subtitle: "An open-source, self-hosted notes app vs. an all-in-one cloud workspace.",
    description:
      "Notion is a powerful hosted workspace with databases and collaboration. Memos goes the other way: a small, self-hosted, open-source tool for private quick capture that you fully own.",
    icon: LayoutGridIcon,
    summary:
      "Choose Memos to own your data and capture fast without a heavy editor. Choose Notion for structured databases and team collaboration in the cloud.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Cloud SaaS (hosted by Notion)" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Stored on Notion's servers" },
      { label: "Format", memos: "Markdown-native", competitor: "Blocks (Markdown import/export)" },
      { label: "Best for", memos: "Fast private capture", competitor: "All-in-one workspace & databases" },
      { label: "Cost", memos: "Free (you host)", competitor: "Freemium; paid plans for teams" },
    ],
    chooseMemos: [
      "You want to own your data on your own server with no vendor lock-in.",
      "You want fast, private capture without a heavy block editor.",
      "You want it free and open source.",
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
    subtitle: "An open-source, self-hosted alternative to Google Keep's quick notes.",
    description:
      "Google Keep is a free, zero-setup note app tied to your Google account. Memos offers the same fast-capture feel but self-hosted, Markdown-native, and private — your notes live on your server, not Google's.",
    icon: StickyNoteIcon,
    summary:
      "Choose Memos to self-host quick notes with Markdown and full ownership. Choose Google Keep for instant, no-server notes inside the Google ecosystem.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Google cloud account" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Tied to your Google account" },
      { label: "Format", memos: "Markdown-native", competitor: "Plain notes & lists, no Markdown" },
      { label: "Best for", memos: "Self-hosted quick capture", competitor: "Zero-setup quick notes" },
      { label: "Cost", memos: "Free (you host)", competitor: "Free with a Google account" },
    ],
    chooseMemos: [
      "You want to own and self-host your notes instead of storing them in Google's cloud.",
      "You want Markdown, tags, and search over a private timeline.",
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
      title: "Memos: The Open-Source, Self-Hosted Google Keep Alternative",
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
    subtitle: "A free, open-source, self-hosted alternative to Evernote.",
    description:
      "Evernote is a mature cloud notebook app with clipping and search on a freemium plan. Memos is a free, open-source, self-hosted alternative focused on lightweight Markdown capture without subscriptions or note limits.",
    icon: FeatherIcon,
    summary:
      "Choose Memos for a free, self-hosted tool you own outright. Choose Evernote for web clipping, OCR, and polished apps if you are comfortable in the cloud.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Cloud SaaS (hosted by Evernote)" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Stored on Evernote's servers" },
      { label: "Format", memos: "Markdown-native", competitor: "Rich-text notebooks" },
      { label: "Best for", memos: "Lightweight private capture", competitor: "Web clipping & cross-notebook search" },
      { label: "Cost", memos: "Free (you host)", competitor: "Freemium; paid plans for full use" },
    ],
    chooseMemos: [
      "You want a free, self-hosted tool with no subscription or note limits.",
      "You prefer Markdown and a lightweight capture flow.",
      "You want full ownership of your data.",
    ],
    chooseCompetitor: [
      "You rely on web clipping, OCR, and document search.",
      "You want polished native apps across every platform.",
      "You do not want to self-host.",
    ],
    features: [
      { name: "Import", slug: "import" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "No fees", slug: "no-fees" },
    ],
    seo: {
      title: "Memos: The Open-Source, Self-Hosted Evernote Alternative",
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
