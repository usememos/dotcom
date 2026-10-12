import {
  BookOpenIcon,
  BoxesIcon,
  CalendarDaysIcon,
  CloudIcon,
  FeatherIcon,
  FolderTreeIcon,
  GemIcon,
  LayoutGridIcon,
  ListTreeIcon,
  LockKeyholeIcon,
  NotebookIcon,
  NotepadTextIcon,
  PenLineIcon,
  ShieldCheckIcon,
  StickyNoteIcon,
  TextIcon,
} from "lucide-react";
import type { ComparisonDefinition, ComparisonSlug } from "./types";

const REVIEWED_AT = "2026-10-12";

/**
 * Honest, fact-based comparisons. Each page is written to help the reader choose
 * correctly — including when the other tool is the better fit — which is what
 * earns trust and ranks for "Memos vs X" / "open-source X alternative" intent.
 *
 * Feature-matrix cells describe the competitor as of `reviewedAt`. Prices are
 * described in shape ("free plan; paid tiers") rather than numbers so the pages
 * do not go stale between reviews.
 */
export const COMPARISONS: Record<ComparisonSlug, ComparisonDefinition> = {
  obsidian: {
    competitor: "Obsidian",
    title: "Memos vs Obsidian",
    subtitle: "A personal timeline of short memos vs. a local-first vault of linked notes.",
    description:
      "Both use Markdown, but they solve different problems. Memos is a personal timeline of short, untitled memos, self-hosted on a server you reach from any browser. Obsidian is a local-first desktop and mobile app for building a vault of densely linked notes.",
    icon: GemIcon,
    category: "local-first",
    reviewedAt: REVIEWED_AT,
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
    matrix: {
      openSource: { support: "no", detail: "Proprietary; free for personal and commercial use" },
      selfHosting: { support: "partial", detail: "Nothing to host; sync through git or your own storage" },
      hostedService: { support: "yes", detail: "Obsidian Sync and Publish, paid" },
      markdown: { support: "yes", detail: "Markdown files on disk" },
      offline: { support: "yes", detail: "Local-first; works fully offline" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "partial", detail: "Paid Obsidian Sync, or iCloud, git, and plugins" },
      tags: { support: "yes", detail: "Inline #tags with nesting" },
      linking: { support: "yes", detail: "Wikilinks, backlinks, graph view" },
      publicSharing: { support: "partial", detail: "Obsidian Publish, paid, or third-party tools" },
      attachments: { support: "yes", detail: "Files stored inside the vault folder" },
      search: { support: "yes", detail: "Full-text search with operators" },
      api: { support: "partial", detail: "Plugin API and URI scheme; no web API" },
      importExport: { support: "yes", detail: "Plain files; importer plugin for other apps" },
      e2ee: { support: "partial", detail: "Obsidian Sync is end-to-end encrypted; local files are plain" },
      storage: { detail: "Markdown files in a local folder" },
      price: { detail: "Free; paid Sync and Publish add-ons" },
    },
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
    faq: [
      {
        question: "Is Memos an open-source alternative to Obsidian?",
        answer:
          "Partly. Both write Markdown, but Obsidian is a local app for long linked notes and Memos is a self-hosted web timeline for short ones. Memos is MIT-licensed; Obsidian is proprietary but free to use.",
      },
      {
        question: "Can I move my Obsidian vault into Memos?",
        answer:
          "Not with a built-in importer. Memos imports only its own export format today. You can paste notes or script the REST API to create memos from your Markdown files.",
      },
      {
        question: "Does Memos work offline like Obsidian?",
        answer:
          "No. Memos runs in the browser and needs a reachable server to read and write. Obsidian stores files on the device and works fully offline.",
      },
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
    category: "self-hosted",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos for a self-hosted timeline of short memos you open in any browser. Choose Joplin for end-to-end encrypted notebooks and offline native clients.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source (AGPL-3.0)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local apps + self-hostable sync" },
      { label: "Sync", memos: "Server-based; open it in any browser", competitor: "End-to-end encrypted sync" },
      { label: "Format", memos: "Markdown memos with tags", competitor: "Markdown notes & notebooks" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Encrypted notebooks across devices" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; optional paid Joplin Cloud" },
    ],
    matrix: {
      openSource: { support: "yes", detail: "AGPL-3.0" },
      selfHosting: { support: "yes", detail: "Joplin Server with Docker" },
      hostedService: { support: "yes", detail: "Joplin Cloud, paid" },
      markdown: { support: "yes", detail: "Markdown, with an optional rich-text editor" },
      offline: { support: "yes", detail: "Local-first native apps" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Joplin Cloud, Joplin Server, Nextcloud, WebDAV, Dropbox, OneDrive, S3" },
      tags: { support: "yes", detail: "Tags per note; no nesting" },
      linking: { support: "yes", detail: "Links between notes; backlinks through plugins" },
      publicSharing: { support: "partial", detail: "Publish notes through Joplin Cloud or Joplin Server" },
      attachments: { support: "yes", detail: "Files stored as resources" },
      search: { support: "yes", detail: "Full-text search, including OCR on images and PDFs" },
      api: { support: "yes", detail: "Local data API used by the web clipper; no webhooks" },
      importExport: { support: "yes", detail: "Imports Evernote ENEX and Markdown; exports JEX, Markdown, PDF" },
      e2ee: { support: "yes", detail: "Optional end-to-end encryption for sync" },
      storage: { detail: "Local SQLite on each device, synced to a target you choose" },
      price: { detail: "Free; paid Joplin Cloud optional" },
    },
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
    faq: [
      {
        question: "Memos or Joplin for self-hosting?",
        answer:
          "Both self-host. Memos is one container that serves the whole app in the browser. Joplin Server only syncs; you still install Joplin's native apps on each device.",
      },
      {
        question: "Does Memos encrypt notes end to end like Joplin?",
        answer:
          "No. Memos stores memos readably in the database on your server, so protect the server itself. Joplin can encrypt notes before they leave the device.",
      },
      {
        question: "Can I import Joplin notes into Memos?",
        answer:
          "There is no Joplin importer. Export Joplin notes as Markdown and create memos through the Memos API, or paste the ones you still need.",
      },
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
    category: "cloud",
    reviewedAt: REVIEWED_AT,
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
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "Cloud only" },
      hostedService: { support: "yes", detail: "Notion is the hosted service" },
      markdown: { support: "partial", detail: "Block editor with Markdown shortcuts; Markdown export" },
      offline: { support: "partial", detail: "Recently opened pages only" },
      desktopApp: { support: "yes", detail: "Windows and macOS" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Cloud sync with real-time collaboration" },
      tags: { support: "partial", detail: "Database properties; no global inline tags" },
      linking: { support: "yes", detail: "Page links, backlinks, database relations" },
      publicSharing: { support: "yes", detail: "Publish pages to the web" },
      attachments: { support: "yes", detail: "Upload size limits on the free plan" },
      search: { support: "yes", detail: "Workspace search; AI search on paid plans" },
      api: { support: "yes", detail: "Public REST API and webhooks" },
      importExport: { support: "yes", detail: "Imports many formats; exports Markdown, CSV, HTML, PDF" },
      e2ee: { support: "no", detail: "Encrypted in transit and at rest; Notion can read content" },
      storage: { detail: "Notion's cloud" },
      price: { detail: "Free plan; paid plans per user" },
    },
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
    faq: [
      {
        question: "Is Memos a self-hosted Notion alternative?",
        answer:
          "For short personal notes, yes. Memos replaces the quick-capture part of Notion on a server you run. It does not replace Notion's databases, team workspaces, or page editor.",
      },
      {
        question: "Can I import Notion pages into Memos?",
        answer:
          "Not directly. Export from Notion as Markdown, then create memos through the Memos API or by pasting. Memos' built-in importer handles Memos exports only.",
      },
      {
        question: "Is Memos free compared to Notion?",
        answer:
          "Memos has no license fee or per-user plan; you pay only for the server it runs on. Notion has a free plan and charges per user for paid features.",
      },
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
    subtitle: "Quick notes on your own server vs. quick notes inside Google's cloud.",
    description:
      "Google Keep is free, instant, and tied to a Google account. Memos keeps the quick-capture feel but runs on a server you control, supports Markdown, and can be exported at any time.",
    icon: StickyNoteIcon,
    category: "cloud",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want Keep-style quick notes with Markdown on your own server. Choose Google Keep if you want zero setup and deep integration with Google apps.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Google's cloud" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Google account" },
      { label: "Format", memos: "Markdown with tags", competitor: "Plain text, labels, checklists" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Quick notes & reminders" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free with a Google account" },
    ],
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "Cloud only" },
      hostedService: { support: "yes", detail: "Part of a Google account" },
      markdown: { support: "no", detail: "Basic rich text; no Markdown" },
      offline: { support: "yes", detail: "Mobile apps and Chrome work offline" },
      desktopApp: { support: "partial", detail: "Web app and Chrome extension; no native desktop app" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Google account" },
      tags: { support: "yes", detail: "Labels and colors" },
      linking: { support: "no", detail: "No links between notes" },
      publicSharing: { support: "partial", detail: "Share with collaborators; no public link" },
      attachments: { support: "yes", detail: "Images, drawings, audio" },
      search: { support: "yes", detail: "Search by text, label, color, and type" },
      api: { support: "partial", detail: "Keep API for enterprise Workspace accounts only" },
      importExport: { support: "partial", detail: "Export through Google Takeout; no import" },
      e2ee: { support: "no", detail: "Google can read content" },
      storage: { detail: "Google's cloud" },
      price: { detail: "Free with a Google account" },
    },
    chooseMemos: [
      "You want your notes on infrastructure you control instead of a Google account.",
      "You want Markdown, tags, and a searchable timeline rather than sticky-note cards.",
      "You want open-source software you can export from at any time.",
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
    faq: [
      {
        question: "Is Memos a good Google Keep alternative?",
        answer:
          "Yes, if you want the same quick notes with Markdown on a server you control. You give up Keep's reminders, Google integrations, and zero-setup sync.",
      },
      {
        question: "Can I move my Google Keep notes into Memos?",
        answer:
          "Export them with Google Takeout, which gives you one file per note. Memos has no Keep importer, so create memos from those files through the API or by pasting.",
      },
      {
        question: "Does Memos have reminders like Google Keep?",
        answer: "No. Memos is a timeline of memos with tags and search. It does not send reminders or notifications on a schedule.",
      },
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
    category: "cloud",
    reviewedAt: REVIEWED_AT,
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
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "Cloud only" },
      hostedService: { support: "yes", detail: "Evernote is the hosted service" },
      markdown: { support: "partial", detail: "Rich-text editor with Markdown shortcuts" },
      offline: { support: "partial", detail: "Offline notebooks on paid plans" },
      desktopApp: { support: "yes", detail: "Windows and macOS" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Evernote cloud; device limits on the free plan" },
      tags: { support: "yes", detail: "Tags with nesting" },
      linking: { support: "yes", detail: "Internal note links" },
      publicSharing: { support: "yes", detail: "Public links and shared notes" },
      attachments: { support: "yes", detail: "Files, with OCR inside images and PDFs" },
      search: { support: "yes", detail: "Full-text including OCR and handwriting" },
      api: { support: "partial", detail: "Developer API with approval; no self-serve webhooks" },
      importExport: { support: "yes", detail: "ENEX export; imports from several apps" },
      e2ee: { support: "partial", detail: "Encrypts selected text only" },
      storage: { detail: "Evernote's cloud" },
      price: { detail: "Free plan with note limits; paid plans" },
    },
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
    faq: [
      {
        question: "Is Memos a free Evernote alternative?",
        answer:
          "Memos has no license fee and no note or device limits in the software. You still pay for the server that runs it. Evernote's free plan caps notes and devices.",
      },
      {
        question: "Can Memos import an Evernote ENEX export?",
        answer:
          "Not today. Memos imports its own export format only. Convert ENEX to Markdown with a third-party tool, then create memos through the API.",
      },
      {
        question: "Does Memos do OCR or web clipping like Evernote?",
        answer:
          "Memos has a browser Web Clipper for saving selections and pages as memos. It does not run OCR on images or PDFs; attachments are stored as files.",
      },
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
  "apple-notes": {
    competitor: "Apple Notes",
    title: "Memos vs Apple Notes",
    subtitle: "Self-hosted Markdown memos in any browser vs. the notes app built into every Apple device.",
    description:
      "Apple Notes is free, fast, and already installed on every iPhone and Mac, synced through iCloud. Memos trades that convenience for control: an open-source timeline of Markdown memos on your own server, reachable from any device with a browser, including Android, Windows, and Linux.",
    icon: NotepadTextIcon,
    category: "cloud",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you use devices outside Apple's ecosystem or want your notes on your own server. Choose Apple Notes if you live on Apple hardware and want zero setup with offline native apps.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary, bundled with Apple devices" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "iCloud" },
      { label: "Platforms", memos: "Any browser; PWA", competitor: "iPhone, iPad, Mac, iCloud.com" },
      { label: "Format", memos: "Markdown with tags", competitor: "Rich text with Markdown export" },
      { label: "Best for", memos: "Short memos across any device", competitor: "Notes that stay inside Apple's ecosystem" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; iCloud storage plans" },
    ],
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "iCloud or on-device only" },
      hostedService: { support: "yes", detail: "iCloud" },
      markdown: { support: "partial", detail: "Rich text; Markdown import and export added in 2025" },
      offline: { support: "yes", detail: "Local on every Apple device" },
      desktopApp: { support: "partial", detail: "macOS; iCloud.com in a browser elsewhere" },
      mobileApp: { support: "partial", detail: "iPhone and iPad only; no Android app" },
      sync: { support: "yes", detail: "iCloud, or IMAP accounts" },
      tags: { support: "yes", detail: "#tags and Smart Folders" },
      linking: { support: "yes", detail: "Links between notes" },
      publicSharing: { support: "partial", detail: "Share with other iCloud users; no public link" },
      attachments: { support: "yes", detail: "Photos, scans, sketches, files" },
      search: { support: "yes", detail: "Full-text including handwriting and scanned text" },
      api: { support: "no", detail: "No public API; Shortcuts and AppleScript automation" },
      importExport: { support: "partial", detail: "Per-note Markdown or PDF export; no bulk export" },
      e2ee: { support: "partial", detail: "Locked notes, or all notes with Advanced Data Protection" },
      storage: { detail: "iCloud, or an on-device account" },
      price: { detail: "Free with Apple devices; paid iCloud storage" },
    },
    chooseMemos: [
      "You switch between Apple, Android, Windows, or Linux devices and want one place for notes.",
      "You want notes on a server you run, not in iCloud.",
      "You write in Markdown and want tags, a timeline, and public sharing by link.",
    ],
    chooseCompetitor: [
      "Every device you own is made by Apple.",
      "You want offline native apps with handwriting, scanning, and Apple Pencil support.",
      "You want zero setup and sync you never think about.",
    ],
    features: [
      { name: "Cross-platform", slug: "cross-platform" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "Markdown", slug: "markdown-support" },
    ],
    faq: [
      {
        question: "Can I use Memos on Android or Windows like Apple Notes on an iPhone?",
        answer:
          "Yes. Memos runs in any browser and installs as a PWA on Android, Windows, Linux, and Apple devices. That is the main reason people leave Apple Notes for it.",
      },
      {
        question: "How do I move Apple Notes into Memos?",
        answer:
          "Export notes as Markdown from Apple Notes, then create memos through the Memos API or by pasting. There is no bulk Apple Notes importer in Memos.",
      },
      {
        question: "Does Memos work offline on my phone?",
        answer: "No. Memos needs a reachable server. Apple Notes stores notes on the device and syncs later.",
      },
    ],
    seo: {
      title: "Memos vs Apple Notes: Self-Hosted, Cross-Platform Alternative",
      description:
        "Memos vs Apple Notes: an open-source, self-hosted Markdown notes app that works on Android, Windows, and Linux too. Compare sync, platforms, and privacy.",
      keywords: [
        "apple notes alternative",
        "apple notes alternative for android",
        "open source apple notes alternative",
        "self-hosted apple notes alternative",
        "memos vs apple notes",
      ],
    },
  },
  "standard-notes": {
    competitor: "Standard Notes",
    title: "Memos vs Standard Notes",
    subtitle: "A plain self-hosted timeline vs. an end-to-end encrypted notes service you can also self-host.",
    description:
      "Standard Notes and Memos are both open source and both run on your own server. Standard Notes encrypts every note before it leaves the device and sells editors and file storage on paid plans. Memos keeps the whole app free and simple: short Markdown memos in a timeline, readable by the server you control.",
    icon: LockKeyholeIcon,
    category: "self-hosted",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want a free, fully featured timeline on your own server and trust that server. Choose Standard Notes if end-to-end encryption is the requirement and you accept paid plans for richer editors.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source (AGPL-3.0)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Hosted service or self-hosted server" },
      { label: "Encryption", memos: "Server can read memos; secure the server", competitor: "End-to-end encrypted by default" },
      { label: "Format", memos: "Markdown with tags", competitor: "Plain text free; Markdown and rich editors paid" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Private long-form notes" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free plan; paid plans for editors and files" },
    ],
    matrix: {
      openSource: { support: "yes", detail: "AGPL-3.0 clients and server", source: "https://github.com/standardnotes/app" },
      selfHosting: {
        support: "yes",
        detail: "Official Docker-based server",
        source: "https://standardnotes.com/help/self-hosting/getting-started",
      },
      hostedService: { support: "yes", detail: "standardnotes.com", source: "https://standardnotes.com/plans" },
      markdown: { support: "partial", detail: "Plain text on the free plan; Markdown and rich editors on paid plans" },
      offline: { support: "yes", detail: "Local-first; works offline" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Encrypted sync through their server or yours" },
      tags: { support: "yes", detail: "Tags; nested folders on paid plans" },
      linking: { support: "partial", detail: "Note linking on paid plans" },
      publicSharing: { support: "partial", detail: "Listed blogging on paid plans" },
      attachments: { support: "partial", detail: "Encrypted files on paid plans" },
      search: { support: "yes", detail: "Local full-text search" },
      api: { support: "no", detail: "No public notes API; content is encrypted" },
      importExport: { support: "yes", detail: "Imports Evernote, Simplenote, Google Keep, text; exports decrypted backups" },
      e2ee: { support: "yes", detail: "XChaCha20-Poly1305 by default", source: "https://standardnotes.com/plans" },
      storage: { detail: "Encrypted on their server or yours; decrypted on your devices" },
      price: { detail: "Free plan; paid plans unlock editors, files, and history" },
    },
    chooseMemos: [
      "You want every feature free on your own server, with no plan tiers.",
      "You want Markdown, tags, public sharing, and an API without paying for editors.",
      "You trust the server you run and prefer searchable, server-side data.",
    ],
    chooseCompetitor: [
      "Notes must be unreadable to the server, including your own.",
      "You want native offline apps with encrypted file storage.",
      "You are happy with plain text or a paid plan for richer editors.",
    ],
    features: [
      { name: "Open source", slug: "open-source" },
      { name: "No fees", slug: "no-fees" },
      { name: "Data ownership", slug: "data-ownership" },
    ],
    faq: [
      {
        question: "Is Memos end-to-end encrypted like Standard Notes?",
        answer:
          "No. Memos stores memos readably in the database so the server can search and render them. Protect the server with TLS, access control, and disk encryption instead.",
      },
      {
        question: "Which is cheaper to self-host, Memos or Standard Notes?",
        answer:
          "Both are free to run. Memos includes every feature on any server. Standard Notes' richer editors and files are paid features, with an offline activation path for self-hosters.",
      },
      {
        question: "Can I import Standard Notes into Memos?",
        answer:
          "Export a decrypted backup from Standard Notes, then create memos from the text through the Memos API. There is no direct importer.",
      },
    ],
    seo: {
      title: "Memos vs Standard Notes: Open-Source, Self-Hosted Notes",
      description:
        "Memos vs Standard Notes compared: two open-source, self-hostable note apps with different trade-offs on encryption, pricing, and Markdown. See which fits.",
      keywords: [
        "memos vs standard notes",
        "standard notes alternative",
        "open source standard notes alternative",
        "self-hosted notes app",
        "standard notes vs memos",
      ],
    },
  },
  trilium: {
    competitor: "Trilium Notes",
    title: "Memos vs Trilium Notes",
    subtitle: "A flat timeline of short memos vs. a deep tree of hierarchical notes, both on your server.",
    description:
      "Trilium Notes and Memos are both open source and built for self-hosters, and they are opposites in shape. Trilium organizes notes in an infinitely nested tree with attributes, scripting, and a relation map. Memos has no tree at all: write a memo, tag it, and find it later in a timeline.",
    icon: FolderTreeIcon,
    category: "self-hosted",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want fast capture into a timeline with minimal structure. Choose Trilium Notes if you want a personal knowledge base with hierarchy, attributes, and scripting.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source (AGPL-3.0)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Self-hosted server or desktop app" },
      { label: "Structure", memos: "Timeline with tags", competitor: "Nested note tree with attributes" },
      { label: "Format", memos: "Markdown", competitor: "Rich text editor; Markdown import and export" },
      { label: "Best for", memos: "Short memos captured fast", competitor: "Structured personal knowledge base" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free" },
    ],
    matrix: {
      openSource: { support: "yes", detail: "AGPL-3.0", source: "https://github.com/TriliumNext/Trilium" },
      selfHosting: { support: "yes", detail: "Server install or Docker" },
      hostedService: { support: "partial", detail: "Third-party hosting providers only" },
      markdown: { support: "partial", detail: "Rich text editor; Markdown import and export" },
      offline: { support: "yes", detail: "Desktop app with a local database" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "partial", detail: "Mobile web layout; community apps" },
      sync: { support: "yes", detail: "Sync server you host" },
      tags: { support: "partial", detail: "Labels and attributes instead of tags" },
      linking: { support: "yes", detail: "Links, backlinks, relation map" },
      publicSharing: { support: "yes", detail: "Share notes publicly from the server" },
      attachments: { support: "yes", detail: "Files and images" },
      search: { support: "yes", detail: "Full-text and attribute search" },
      api: { support: "yes", detail: "ETAPI REST API and in-app scripting" },
      importExport: { support: "yes", detail: "Imports Markdown, Evernote, OPML; exports Markdown and HTML" },
      e2ee: { support: "partial", detail: "Protected notes encrypted per note; sync is not end to end" },
      storage: { detail: "SQLite on the desktop and the server" },
      price: { detail: "Free" },
    },
    chooseMemos: [
      "You capture many short notes a day and do not want to decide where each one goes.",
      "You want a lighter app with a smaller surface to learn and maintain.",
      "You want public sharing and a REST API without scripting.",
    ],
    chooseCompetitor: [
      "You want a hierarchical tree where one note can live in several places.",
      "You use attributes, templates, and scripts to build your own tooling.",
      "You want a native desktop app with a local database.",
    ],
    features: [
      { name: "Quick capture", slug: "quick-capture" },
      { name: "Lightweight", slug: "lightweight" },
      { name: "Tags", slug: "tags" },
    ],
    faq: [
      {
        question: "Memos or Trilium Notes for a homelab?",
        answer:
          "Both run as one container. Pick Memos for short notes and a timeline you browse by tag and date. Pick Trilium for a deep tree, attributes, and scripting.",
      },
      {
        question: "Can Memos nest notes like Trilium?",
        answer:
          "No. Memos is deliberately flat. You get nested tags such as #project/backend and relations between memos, not a note tree.",
      },
      {
        question: "Can I import Trilium notes into Memos?",
        answer: "Export Trilium as Markdown, then create memos through the Memos API. Memos' importer accepts Memos exports only.",
      },
    ],
    seo: {
      title: "Memos vs Trilium Notes: Self-Hosted Notes Compared",
      description:
        "Memos vs Trilium Notes: two open-source, self-hosted note apps for homelabs. Compare the timeline vs. the note tree, Markdown, API, and sync.",
      keywords: ["memos vs trilium", "trilium vs memos", "trilium alternative", "self-hosted notes app", "trilium notes alternative"],
    },
  },
  logseq: {
    competitor: "Logseq",
    title: "Memos vs Logseq",
    subtitle: "A server-side timeline of memos vs. a local outliner built on blocks and backlinks.",
    description:
      "Logseq is an open-source outliner that stores Markdown or Org-mode files on your device and links every block. Memos is an open-source web app on your server where each memo is a short, standalone entry in a timeline. Both are free; they differ on where notes live and how they connect.",
    icon: ListTreeIcon,
    category: "local-first",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want a server you reach from any browser and notes that stand on their own. Choose Logseq if you think in outlines, block references, and a local graph.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source (AGPL-3.0)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local files on each device" },
      { label: "Sync", memos: "Server-based; open it in any browser", competitor: "Logseq Sync, git, or iCloud" },
      { label: "Format", memos: "Markdown memos in a database", competitor: "Markdown or Org-mode files" },
      { label: "Best for", memos: "Short standalone memos", competitor: "Outlines, journals, block references" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; paid Logseq Sync" },
    ],
    matrix: {
      openSource: { support: "yes", detail: "AGPL-3.0" },
      selfHosting: { support: "partial", detail: "Local files; sync through git or your own storage" },
      hostedService: { support: "partial", detail: "Logseq Sync, paid" },
      markdown: { support: "yes", detail: "Markdown or Org-mode files" },
      offline: { support: "yes", detail: "Local-first" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "partial", detail: "Logseq Sync, git, or iCloud" },
      tags: { support: "yes", detail: "Tags are pages" },
      linking: { support: "yes", detail: "Block references, backlinks, graph view" },
      publicSharing: { support: "partial", detail: "Publish a static site yourself" },
      attachments: { support: "yes", detail: "Assets folder next to the files" },
      search: { support: "yes", detail: "Full-text search across the graph" },
      api: { support: "partial", detail: "Plugin API and local HTTP API" },
      importExport: { support: "yes", detail: "Plain files; imports Roam and OPML" },
      e2ee: { support: "partial", detail: "Logseq Sync is end-to-end encrypted; local files are plain" },
      storage: { detail: "Markdown files in a local folder" },
      price: { detail: "Free; paid Logseq Sync" },
    },
    chooseMemos: [
      "You want one instance on a server, open in any browser, with no file sync to manage.",
      "Your notes are short and standalone rather than nested outlines.",
      "You want to share a memo publicly or post to the API from scripts.",
    ],
    chooseCompetitor: [
      "You outline and reference blocks across daily journal pages.",
      "You want local files you can open with any editor, fully offline.",
      "You rely on plugins and the graph view.",
    ],
    features: [
      { name: "Timeline", slug: "timeline-view" },
      { name: "Self-hosted", slug: "self-hosted" },
      { name: "API", slug: "api-first" },
    ],
    faq: [
      {
        question: "Is Memos a self-hosted alternative to Logseq?",
        answer:
          "For daily short notes, yes. Memos runs on a server instead of syncing files between devices. It does not have an outliner or block references.",
      },
      {
        question: "Can I keep daily journal pages in Memos?",
        answer:
          "Memos is already a journal: every memo is timestamped in a timeline you filter by date and tag. There are no separate journal pages to create.",
      },
      {
        question: "Can I import a Logseq graph into Memos?",
        answer: "Not with a built-in importer. Your graph is plain Markdown, so you can script memos through the Memos API.",
      },
    ],
    seo: {
      title: "Memos vs Logseq: Self-Hosted Notes vs. Local Outliner",
      description:
        "Memos vs Logseq: both open source and free. Compare a self-hosted timeline of memos with Logseq's local outliner on sync, hosting, linking, and Markdown.",
      keywords: ["memos vs logseq", "logseq vs memos", "logseq alternative", "self-hosted logseq alternative", "open source note app"],
    },
  },
  onenote: {
    competitor: "Microsoft OneNote",
    title: "Memos vs OneNote",
    subtitle: "Short Markdown memos on your server vs. freeform notebooks in OneDrive.",
    description:
      "OneNote is a free, mature notebook app with a freeform canvas, ink, and deep Microsoft 365 integration, stored in OneDrive. Memos is an open-source, self-hosted timeline of short Markdown memos with tags and search, with no Microsoft account involved.",
    icon: BookOpenIcon,
    category: "cloud",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want plain Markdown notes on infrastructure you control. Choose OneNote if you want a freeform canvas, handwriting, and Office integration in Microsoft's cloud.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "OneDrive" },
      { label: "Data ownership", memos: "Your database, zero telemetry", competitor: "Microsoft account" },
      { label: "Format", memos: "Markdown", competitor: "Freeform canvas, rich text, ink" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Notebooks, sections, handwritten pages" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; Microsoft 365 for storage" },
    ],
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "OneDrive required for the free edition" },
      hostedService: { support: "yes", detail: "OneDrive and Microsoft 365" },
      markdown: { support: "no", detail: "Freeform rich text; no Markdown" },
      offline: { support: "yes", detail: "Local cache syncs later" },
      desktopApp: { support: "yes", detail: "Windows and macOS" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "OneDrive" },
      tags: { support: "partial", detail: "Paragraph tags such as To Do; no notebook-wide tags" },
      linking: { support: "yes", detail: "Links to pages, sections, and paragraphs" },
      publicSharing: { support: "yes", detail: "Share pages and notebooks by OneDrive link" },
      attachments: { support: "yes", detail: "Files, images, audio, ink" },
      search: { support: "yes", detail: "Full-text including OCR in images" },
      api: { support: "yes", detail: "Microsoft Graph API" },
      importExport: { support: "partial", detail: "Exports from desktop OneNote; no Markdown export" },
      e2ee: { support: "no", detail: "Password-protected sections only" },
      storage: { detail: "OneDrive" },
      price: { detail: "Free; Microsoft 365 for more storage" },
    },
    chooseMemos: [
      "You want notes outside a Microsoft account, on a server you run.",
      "You write in Markdown and want tags, search, and a timeline instead of notebooks.",
      "You want portable data: a ZIP of Markdown and JSON whenever you ask.",
    ],
    chooseCompetitor: [
      "You handwrite, draw, or clip rich content onto a freeform page.",
      "You already live in Microsoft 365 and Teams.",
      "You want offline native apps on every platform at no cost.",
    ],
    features: [
      { name: "Markdown", slug: "markdown-support" },
      { name: "Export", slug: "export" },
      { name: "Self-hosted", slug: "self-hosted" },
    ],
    faq: [
      {
        question: "Is Memos an open-source OneNote alternative?",
        answer:
          "For text notes, yes. Memos is MIT-licensed and self-hosted. It does not have OneNote's freeform canvas, ink, or Office integration.",
      },
      {
        question: "How do I get notes out of OneNote and into Memos?",
        answer:
          "OneNote has no Markdown export, so convert pages with a third-party tool first, then create memos through the Memos API. Memos imports only its own export format.",
      },
      {
        question: "Does Memos support handwriting?",
        answer: "No. Memos is text and Markdown. You can attach images of handwritten pages, but they are not searchable.",
      },
    ],
    seo: {
      title: "Memos: An Open-Source, Self-Hosted OneNote Alternative",
      description:
        "Memos is an open-source, self-hosted OneNote alternative for Markdown notes. Compare hosting, data ownership, format, and cost before you switch.",
      keywords: [
        "onenote alternative",
        "open source onenote alternative",
        "self-hosted onenote alternative",
        "memos vs onenote",
        "onenote alternative linux",
      ],
    },
  },
  simplenote: {
    competitor: "Simplenote",
    title: "Memos vs Simplenote",
    subtitle: "Two deliberately simple note apps: one you host, one Automattic hosts for free.",
    description:
      "Simplenote and Memos share a philosophy: fast, plain, tag-based notes without a page editor. Simplenote is a free hosted service with native apps on every platform. Memos is open source end to end and runs on your own server, adding Markdown rendering, attachments, public sharing, and an API.",
    icon: TextIcon,
    category: "cloud",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want the same simplicity on a server you control, with Markdown rendering and attachments. Choose Simplenote if you want free native apps and never want to run anything.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Apps GPL-2.0; server proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Automattic's servers" },
      { label: "Apps", memos: "Any browser; PWA", competitor: "Native apps on every platform" },
      { label: "Format", memos: "Markdown with attachments", competitor: "Plain text with Markdown preview" },
      { label: "Best for", memos: "Short memos on your server", competitor: "Plain text notes, synced for free" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free" },
    ],
    matrix: {
      openSource: { support: "partial", detail: "Apps are GPL-2.0; the sync server is proprietary" },
      selfHosting: { support: "no", detail: "Hosted by Automattic only" },
      hostedService: { support: "yes", detail: "simplenote.com" },
      markdown: { support: "yes", detail: "Markdown preview per note" },
      offline: { support: "yes", detail: "Native apps cache notes" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Free sync across devices" },
      tags: { support: "yes", detail: "Tags; no nesting" },
      linking: { support: "yes", detail: "Internal note links" },
      publicSharing: { support: "yes", detail: "Publish a note to a public URL" },
      attachments: { support: "no", detail: "Text only" },
      search: { support: "yes", detail: "Instant search with tag filters" },
      api: { support: "no", detail: "No supported public API" },
      importExport: { support: "yes", detail: "Imports text and Evernote; exports a ZIP of text files" },
      e2ee: { support: "no", detail: "Automattic can read content" },
      storage: { detail: "Automattic's servers" },
      price: { detail: "Free" },
    },
    chooseMemos: [
      "You want notes on your own server rather than a free hosted service.",
      "You want images and files in notes, rendered Markdown, and a REST API.",
      "You want per-memo visibility and a public microblog-style feed.",
    ],
    chooseCompetitor: [
      "You want native apps on every platform with offline support.",
      "Plain text is enough and you never want to maintain a server.",
      "You want note history and sync at no cost.",
    ],
    features: [
      { name: "Lightweight", slug: "lightweight" },
      { name: "Media", slug: "media-integration" },
      { name: "Public sharing", slug: "public-sharing" },
    ],
    faq: [
      {
        question: "Is Memos a self-hosted Simplenote alternative?",
        answer:
          "Yes. It keeps the plain, tag-first feel and adds Markdown rendering, attachments, and an API, on a server you run instead of Automattic's.",
      },
      {
        question: "Can I import Simplenote notes into Memos?",
        answer:
          "Simplenote exports a ZIP of text files. Memos has no Simplenote importer, so create memos from those files through the API.",
      },
      {
        question: "Is Simplenote open source like Memos?",
        answer:
          "The Simplenote apps are open source under GPL-2.0, but the sync service is proprietary and cannot be self-hosted. Memos is open source end to end.",
      },
    ],
    seo: {
      title: "Memos vs Simplenote: Self-Hosted, Open-Source Alternative",
      description:
        "Memos vs Simplenote: a self-hosted, open-source alternative with Markdown, attachments, and an API. Compare hosting, apps, sharing, and cost.",
      keywords: [
        "simplenote alternative",
        "self-hosted simplenote alternative",
        "open source simplenote alternative",
        "memos vs simplenote",
      ],
    },
  },
  "nextcloud-notes": {
    competitor: "Nextcloud Notes",
    title: "Memos vs Nextcloud Notes",
    subtitle: "A standalone memo timeline vs. Markdown files inside a Nextcloud you already run.",
    description:
      "Nextcloud Notes stores plain Markdown files in your Nextcloud Files and edits them in the web app and mobile apps. Memos is a standalone, single-container app with a richer memo model: tags, relations, attachments, per-memo visibility, and an API. If you already run Nextcloud, the question is whether notes deserve their own app.",
    icon: CloudIcon,
    category: "self-hosted",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want a focused notes app with tags, sharing, and an API, independent of Nextcloud. Choose Nextcloud Notes if you already run Nextcloud and want plain Markdown files with no extra service.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source (AGPL-3.0)" },
      { label: "Hosting", memos: "One container, standalone", competitor: "App inside your Nextcloud server" },
      { label: "Storage", memos: "SQLite, MySQL, or PostgreSQL", competitor: "Markdown files in Nextcloud Files" },
      { label: "Organization", memos: "Tags, relations, timeline", competitor: "Categories as folders" },
      { label: "Best for", memos: "Short memos captured fast", competitor: "Markdown files next to your other files" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free with Nextcloud" },
    ],
    matrix: {
      openSource: { support: "yes", detail: "AGPL-3.0", source: "https://github.com/nextcloud/notes" },
      selfHosting: { support: "yes", detail: "Runs inside your Nextcloud server" },
      hostedService: { support: "partial", detail: "Through any Nextcloud provider" },
      markdown: { support: "yes", detail: "Plain Markdown files" },
      offline: { support: "partial", detail: "Mobile apps cache notes; the web app needs the server" },
      desktopApp: { support: "partial", detail: "Web app; files sync with the Nextcloud desktop client" },
      mobileApp: { support: "yes", detail: "Android and iOS apps" },
      sync: { support: "yes", detail: "Nextcloud sync" },
      tags: { support: "partial", detail: "Categories as folders; no inline tags" },
      linking: { support: "partial", detail: "Markdown links to other notes" },
      publicSharing: { support: "yes", detail: "Share through Nextcloud Files" },
      attachments: { support: "yes", detail: "Images and files through Nextcloud Files" },
      search: { support: "yes", detail: "Nextcloud unified search" },
      api: { support: "yes", detail: "REST API", source: "https://github.com/nextcloud/notes" },
      importExport: { support: "yes", detail: "Plain Markdown files; copy them in or out" },
      e2ee: { support: "no", detail: "Server-side encryption option; notes readable by the server" },
      storage: { detail: "Markdown files in your Nextcloud Files" },
      price: { detail: "Free; you host Nextcloud" },
    },
    chooseMemos: [
      "You want a notes app that runs on its own, without Nextcloud's footprint.",
      "You want tags, relations, and per-memo visibility instead of folders.",
      "You want to post memos from scripts or the Web Clipper through an API.",
    ],
    chooseCompetitor: [
      "You already run Nextcloud and want one less service to maintain.",
      "You want plain Markdown files you can open with any editor.",
      "Folders are enough organization for you.",
    ],
    features: [
      { name: "Lightweight", slug: "lightweight" },
      { name: "Tags", slug: "tags" },
      { name: "API", slug: "api-first" },
    ],
    faq: [
      {
        question: "Why run Memos if I already have Nextcloud Notes?",
        answer:
          "For the memo model: tags, relations, attachments, per-memo visibility, a timeline, and an API. Nextcloud Notes is a Markdown file editor; Memos is a notes app.",
      },
      {
        question: "Can Memos store notes in Nextcloud?",
        answer: "No. Memos uses its own database on your server. Attachments can go to local disk or S3-compatible storage.",
      },
      {
        question: "Can I import Nextcloud Notes into Memos?",
        answer: "Your notes are already Markdown files. Memos has no file importer, so create memos from them through the API.",
      },
    ],
    seo: {
      title: "Memos vs Nextcloud Notes: Self-Hosted Notes Compared",
      description:
        "Memos vs Nextcloud Notes: both open source and self-hosted. Compare a standalone memo timeline with Markdown files in Nextcloud on tags, sharing, and API.",
      keywords: [
        "memos vs nextcloud notes",
        "nextcloud notes alternative",
        "self-hosted notes app",
        "nextcloud notes vs memos",
        "open source notes app docker",
      ],
    },
  },
  bear: {
    competitor: "Bear",
    title: "Memos vs Bear",
    subtitle: "Self-hosted Markdown memos in any browser vs. a polished Markdown app for Apple devices.",
    description:
      "Bear is a beautifully made Markdown notes app for Mac, iPhone, and iPad, synced through iCloud with a Bear Pro subscription. Memos is open source and self-hosted, reachable from any browser on any platform, with tags, a timeline, and public sharing built in.",
    icon: PenLineIcon,
    category: "local-first",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you need notes outside Apple's platforms or want them on your own server. Choose Bear if you are all-in on Apple and want the nicest native Markdown editor.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local app, iCloud sync" },
      { label: "Platforms", memos: "Any browser; PWA", competitor: "Mac, iPhone, iPad" },
      { label: "Format", memos: "Markdown with tags", competitor: "Markdown with nested tags" },
      { label: "Best for", memos: "Short memos across any device", competitor: "Writing in a native Apple app" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; Bear Pro subscription for sync" },
    ],
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "Local app with iCloud sync" },
      hostedService: { support: "yes", detail: "iCloud sync with Bear Pro" },
      markdown: { support: "yes", detail: "Markdown-based editor" },
      offline: { support: "yes", detail: "Local-first" },
      desktopApp: { support: "partial", detail: "macOS only" },
      mobileApp: { support: "partial", detail: "iPhone and iPad only" },
      sync: { support: "partial", detail: "iCloud, with a Bear Pro subscription" },
      tags: { support: "yes", detail: "Nested #tags" },
      linking: { support: "yes", detail: "Wiki links and backlinks" },
      publicSharing: { support: "no", detail: "No publish; export to share" },
      attachments: { support: "yes", detail: "Images and files" },
      search: { support: "yes", detail: "Full-text search with operators" },
      api: { support: "partial", detail: "x-callback-url automation; no web API" },
      importExport: { support: "yes", detail: "Imports Markdown, text, Evernote; exports Markdown, PDF, HTML, more" },
      e2ee: { support: "partial", detail: "Note locking; iCloud encryption" },
      storage: { detail: "Local database synced through iCloud" },
      price: { detail: "Free; Bear Pro subscription for sync and themes" },
    },
    chooseMemos: [
      "You use Android, Windows, or Linux alongside, or instead of, Apple devices.",
      "You want notes on a server you run, not in iCloud.",
      "You want public sharing and an API for scripts and the Web Clipper.",
    ],
    chooseCompetitor: [
      "You want the best native Markdown editor on Mac and iOS.",
      "You want offline apps, themes, and rich export formats.",
      "iCloud sync is fine and a subscription is acceptable.",
    ],
    features: [
      { name: "Cross-platform", slug: "cross-platform" },
      { name: "Markdown", slug: "markdown-support" },
      { name: "Tags", slug: "tags" },
    ],
    faq: [
      {
        question: "Is there a Bear alternative for Windows or Android?",
        answer:
          "Memos is one option. It runs in any browser and installs as a PWA, so the same notes are on Apple, Android, Windows, and Linux.",
      },
      {
        question: "Can I import Bear notes into Memos?",
        answer:
          "Export from Bear as Markdown, then create memos through the Memos API. Bear's nested tags map to Memos' slash-nested tags.",
      },
      {
        question: "Does Memos look as good as Bear?",
        answer:
          "Memos is a web app with a clean, simple interface and dark mode. Bear's native editor and themes are a step above; try the live demo and judge.",
      },
    ],
    seo: {
      title: "Memos vs Bear: Self-Hosted, Cross-Platform Markdown Notes",
      description:
        "Memos vs Bear: an open-source, self-hosted Markdown notes app that runs on Windows, Android, and Linux too. Compare platforms, sync, tags, and cost.",
      keywords: [
        "bear alternative",
        "bear notes alternative windows",
        "bear alternative android",
        "open source bear alternative",
        "memos vs bear",
      ],
    },
  },
  "day-one": {
    competitor: "Day One",
    title: "Memos vs Day One",
    subtitle: "A self-hosted timeline you can journal in vs. a dedicated journaling app in the cloud.",
    description:
      "Day One is a purpose-built journaling app with photos, on-this-day memories, templates, and end-to-end encrypted sync on paid plans. Memos is a general-purpose memo timeline that many people use as a journal: timestamped Markdown entries with tags and attachments on a server they own.",
    icon: CalendarDaysIcon,
    category: "cloud",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want a private, self-hosted journal in Markdown with no subscription. Choose Day One if you want journaling-specific features like prompts, memories, and rich media on native apps.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Proprietary" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Day One's cloud" },
      { label: "Encryption", memos: "Server can read memos; secure the server", competitor: "Optional end-to-end encryption" },
      { label: "Format", memos: "Markdown with tags and attachments", competitor: "Rich entries with photos, audio, video" },
      { label: "Best for", memos: "Daily notes and journal on your server", competitor: "Guided journaling with memories" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free plan; Premium subscription" },
    ],
    matrix: {
      openSource: { support: "no", detail: "Proprietary" },
      selfHosting: { support: "no", detail: "Day One's cloud" },
      hostedService: { support: "yes", detail: "Day One Sync", source: "https://dayoneapp.com/pricing/" },
      markdown: { support: "yes", detail: "Markdown and rich text editing" },
      offline: { support: "yes", detail: "Local-first native apps" },
      desktopApp: { support: "yes", detail: "macOS and Windows" },
      mobileApp: { support: "yes", detail: "iOS, Android, Apple Watch" },
      sync: { support: "partial", detail: "One device on the free plan; sync on paid plans", source: "https://dayoneapp.com/pricing/" },
      tags: { support: "yes", detail: "Tags per entry" },
      linking: { support: "no", detail: "No links between entries" },
      publicSharing: { support: "partial", detail: "Shared journals on paid plans" },
      attachments: { support: "yes", detail: "Photos, audio, video; one photo per entry on the free plan" },
      search: { support: "yes", detail: "Full-text search with filters" },
      api: { support: "no", detail: "No public API; IFTTT and CLI on macOS" },
      importExport: { support: "yes", detail: "Imports from journaling apps; exports PDF and JSON" },
      e2ee: { support: "yes", detail: "Optional end-to-end encryption on all plans", source: "https://dayoneapp.com/pricing/" },
      storage: { detail: "Day One's servers, or on-device on the free plan" },
      price: { detail: "Free plan; paid subscription for sync and media" },
    },
    chooseMemos: [
      "You want a journal on your own server, in Markdown, with no subscription.",
      "You mix journal entries with other quick notes and find them by tag and date.",
      "You want to write from any device through a browser.",
    ],
    chooseCompetitor: [
      "You want journaling features: prompts, streaks, on-this-day memories, templates.",
      "You attach lots of photos, audio, and video to entries.",
      "You want end-to-end encryption and polished native apps.",
    ],
    features: [
      { name: "Timeline", slug: "timeline-view" },
      { name: "Data ownership", slug: "data-ownership" },
      { name: "Media", slug: "media-integration" },
    ],
    faq: [
      {
        question: "Can I use Memos as a journal like Day One?",
        answer:
          "Yes. Every memo is timestamped in a timeline, so a daily entry is just a memo. Filter by date or a tag such as #journal to read back. There are no prompts or streaks.",
      },
      {
        question: "Can I import Day One entries into Memos?",
        answer:
          "Day One exports JSON with entry text and dates. Memos has no Day One importer, so create memos through the API and set the created time per entry.",
      },
      {
        question: "Is a journal in Memos private?",
        answer:
          "New memos are private by default and stay on your server. Memos does not encrypt them end to end, so protect the server itself.",
      },
    ],
    seo: {
      title: "Memos vs Day One: Self-Hosted, Open-Source Journal Alternative",
      description:
        "Memos vs Day One: a self-hosted, open-source journaling alternative in Markdown with no subscription. Compare privacy, sync, media, and cost.",
      keywords: [
        "day one alternative",
        "self-hosted day one alternative",
        "open source journal app",
        "day one alternative android",
        "memos vs day one",
      ],
    },
  },
  notesnook: {
    competitor: "Notesnook",
    title: "Memos vs Notesnook",
    subtitle: "A plain self-hosted timeline vs. an end-to-end encrypted notes app you can also self-host.",
    description:
      "Notesnook is an open-source notes app that encrypts everything end to end, with native apps on every platform and a self-hostable sync server. Memos is an open-source web app on your server with a simpler model: short Markdown memos, readable by the server you control, with tags, sharing, and an API.",
    icon: ShieldCheckIcon,
    category: "self-hosted",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want a free, simple timeline on your own server and an API. Choose Notesnook if end-to-end encryption and native offline apps matter more than server-side search and automation.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Open source (GPL-3.0)" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Hosted service or self-hosted sync server" },
      { label: "Encryption", memos: "Server can read memos; secure the server", competitor: "End-to-end encrypted by default" },
      { label: "Format", memos: "Markdown", competitor: "Rich text with Markdown shortcuts" },
      { label: "Best for", memos: "Short memos in a timeline", competitor: "Private notebooks across native apps" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free plan; paid tiers for storage" },
    ],
    matrix: {
      openSource: { support: "yes", detail: "GPL-3.0 clients and server", source: "https://notesnook.com/pricing/" },
      selfHosting: { support: "yes", detail: "Sync server is self-hostable", source: "https://notesnook.com/pricing/" },
      hostedService: { support: "yes", detail: "notesnook.com" },
      markdown: { support: "partial", detail: "Rich text editor with Markdown shortcuts; Markdown export" },
      offline: { support: "yes", detail: "Local-first native apps" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Encrypted sync" },
      tags: { support: "yes", detail: "Tags and notebooks" },
      linking: { support: "yes", detail: "Internal note links" },
      publicSharing: { support: "yes", detail: "Monographs: public encrypted note links" },
      attachments: { support: "partial", detail: "Encrypted attachments; storage limits by plan" },
      search: { support: "yes", detail: "Local full-text search" },
      api: { support: "no", detail: "No public API" },
      importExport: { support: "yes", detail: "Imports Evernote, Obsidian, Markdown and more; exports Markdown, HTML, PDF" },
      e2ee: { support: "yes", detail: "End-to-end encrypted by default", source: "https://notesnook.com/pricing/" },
      storage: { detail: "Encrypted on their server or yours; decrypted on your devices" },
      price: { detail: "Free plan; paid tiers for storage and features", source: "https://notesnook.com/pricing/" },
    },
    chooseMemos: [
      "You want every feature free on your own server with no plan tiers.",
      "You want server-side search, webhooks, and an API for automation.",
      "You prefer plain Markdown over a rich-text editor.",
    ],
    chooseCompetitor: [
      "Notes must be unreadable to any server, including your own.",
      "You want native offline apps and encrypted attachments.",
      "You want built-in importers from many other note apps.",
    ],
    features: [
      { name: "Open source", slug: "open-source" },
      { name: "API", slug: "api-first" },
      { name: "No fees", slug: "no-fees" },
    ],
    faq: [
      {
        question: "Is Memos encrypted like Notesnook?",
        answer:
          "Not end to end. Memos stores memos readably so the server can search, render, and serve them to any browser. Protect the server with TLS and disk encryption.",
      },
      {
        question: "Which is simpler to self-host, Memos or Notesnook?",
        answer:
          "Memos: one container serves the whole app. Notesnook's self-hosted setup runs several services and you still install native apps on each device.",
      },
      {
        question: "Can I import Notesnook notes into Memos?",
        answer: "Export from Notesnook as Markdown, then create memos through the Memos API. There is no direct importer.",
      },
    ],
    seo: {
      title: "Memos vs Notesnook: Open-Source, Self-Hosted Notes",
      description:
        "Memos vs Notesnook compared: two open-source, self-hostable note apps with different trade-offs on encryption, API, Markdown, and pricing. See which fits.",
      keywords: [
        "memos vs notesnook",
        "notesnook alternative",
        "open source notesnook alternative",
        "self-hosted notes app",
        "notesnook vs memos",
      ],
    },
  },
  anytype: {
    competitor: "Anytype",
    title: "Memos vs Anytype",
    subtitle: "A simple server-side timeline vs. a local-first, encrypted object database for everything.",
    description:
      "Anytype is a local-first workspace where every note is an object with types and relations, encrypted and synced peer to peer or through a network you can self-host. Memos is a far smaller idea: short Markdown memos in a timeline on your server, with tags, relations, and sharing.",
    icon: BoxesIcon,
    category: "local-first",
    reviewedAt: REVIEWED_AT,
    summary:
      "Choose Memos if you want fast capture into a timeline and a server you reach from any browser. Choose Anytype if you want a structured, encrypted, local-first workspace with types and relations.",
    rows: [
      { label: "License", memos: "Open source (MIT)", competitor: "Any Source Available License" },
      { label: "Hosting", memos: "Self-hosted web server", competitor: "Local-first; self-hostable sync network" },
      { label: "Encryption", memos: "Server can read memos; secure the server", competitor: "Zero-knowledge, end to end" },
      { label: "Format", memos: "Markdown memos", competitor: "Typed objects in a block editor" },
      { label: "Best for", memos: "Short memos captured fast", competitor: "Structured personal workspace" },
      { label: "Cost", memos: "No license fee (you host)", competitor: "Free; paid plans for network storage" },
    ],
    matrix: {
      openSource: {
        support: "partial",
        detail: "Any Source Available License; code is public",
        source: "https://github.com/anyproto/anytype-ts",
      },
      selfHosting: { support: "yes", detail: "Self-host the any-sync network" },
      hostedService: { support: "yes", detail: "Anytype network with free and paid storage" },
      markdown: { support: "partial", detail: "Block editor; Markdown import and export" },
      offline: { support: "yes", detail: "Local-first", source: "https://github.com/anyproto/anytype-ts" },
      desktopApp: { support: "yes", detail: "Windows, macOS, Linux" },
      mobileApp: { support: "yes", detail: "iOS and Android" },
      sync: { support: "yes", detail: "Peer-to-peer and network sync" },
      tags: { support: "partial", detail: "Tag relations on objects" },
      linking: { support: "yes", detail: "Links, backlinks, graph view" },
      publicSharing: { support: "partial", detail: "Invite links to spaces; web publishing for selected objects" },
      attachments: { support: "yes", detail: "Files as objects" },
      search: { support: "yes", detail: "Full-text search across the space" },
      api: { support: "partial", detail: "Local API in development" },
      importExport: { support: "yes", detail: "Imports Notion and Markdown; exports Markdown and JSON" },
      e2ee: { support: "yes", detail: "Zero-knowledge encryption", source: "https://github.com/anyproto/anytype-ts" },
      storage: { detail: "On your devices, encrypted; optional network backup" },
      price: { detail: "Free; paid plans for more network storage" },
    },
    chooseMemos: [
      "You want to write a note in five seconds without choosing a type or template.",
      "You want one server reachable from any browser, not an app on every device.",
      "You want public sharing by link and a REST API.",
    ],
    chooseCompetitor: [
      "You want notes as typed objects with relations, sets, and views.",
      "Encryption and local-first storage are requirements.",
      "You want a workspace that can also hold tasks, bookmarks, and files.",
    ],
    features: [
      { name: "Quick capture", slug: "quick-capture" },
      { name: "Lightweight", slug: "lightweight" },
      { name: "Public sharing", slug: "public-sharing" },
    ],
    faq: [
      {
        question: "Is Memos simpler than Anytype?",
        answer:
          "Much. Memos has memos, tags, relations, and a timeline. Anytype has objects, types, relations, sets, and spaces. Pick the one that matches how much structure you want.",
      },
      {
        question: "Is Memos encrypted like Anytype?",
        answer: "No. Memos stores memos readably on the server you run. Anytype encrypts everything on the device before it syncs.",
      },
      {
        question: "Can I import Anytype into Memos?",
        answer: "Export from Anytype as Markdown, then create memos through the Memos API. There is no direct importer.",
      },
    ],
    seo: {
      title: "Memos vs Anytype: Self-Hosted Notes vs. Local-First Workspace",
      description:
        "Memos vs Anytype: a simple, open-source, self-hosted memo timeline compared with Anytype's encrypted local-first workspace on hosting, structure, and cost.",
      keywords: ["memos vs anytype", "anytype alternative", "open source anytype alternative", "self-hosted notes app", "anytype vs memos"],
    },
  },
};
