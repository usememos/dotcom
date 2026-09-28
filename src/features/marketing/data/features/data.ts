/**
 * Feature definitions and metadata for Memos
 * This serves as the single source of truth for all feature-related data
 */

import {
  ClockIcon,
  CloudOffIcon,
  CodeIcon,
  DatabaseIcon,
  DollarSignIcon,
  DownloadIcon,
  FeatherIcon,
  FileTextIcon,
  GitBranchIcon,
  GlobeIcon,
  HeartIcon,
  ImageIcon,
  KeyboardIcon,
  LayersIcon,
  LockIcon,
  MessageCircleIcon,
  MonitorSmartphoneIcon,
  PaletteIcon,
  PlusCircleIcon,
  SaveIcon,
  SearchIcon,
  ServerIcon,
  Share2Icon,
  TagIcon,
  UploadIcon,
  ZapIcon,
} from "lucide-react";
import type { FEATURE_SLUGS } from "./slugs";
import type { FeatureDefinition } from "./types";

/**
 * Complete feature definitions with all metadata.
 * Every claim must match current Memos behavior (see docs/brand-guidelines.md, "Claims").
 */
export const FEATURES = {
  // Own: hosting, data, and license
  "self-hosted": {
    title: "Self-Hosted",
    description: "Run Memos on a server you choose, from a Raspberry Pi at home to a company server.",
    icon: ServerIcon,
    hero: {
      title: "Run Memos yourself",
      subtitle: "Put your timeline of memos on hardware you choose and decide who can sign in, how, and what is public.",
    },
    benefits: [
      "Your memos stay on the server you choose: a home server, a VPS, or company hardware",
      "Decide whether people can sign up, and whether they sign in with a password or SSO",
      "Choose whether anonymous visitors can read public memos, or keep the whole instance private",
      "Run it behind the reverse proxy, HTTPS, and backups you already use",
      "Upgrade on your own schedule; database migrations run automatically on startup",
      "No hosted Memos account or cloud service is required",
    ],
    useCases: [
      {
        title: "Home Lab Setup",
        description: "Run Memos on your home server or NAS for personal and family notes.",
      },
      {
        title: "Small Team Deployment",
        description: "Deploy on a small VPS or cloud instance for shared notes without extra service overhead.",
      },
      {
        title: "Existing Infrastructure",
        description: "Run Memos inside networks, identity providers, and backup routines you already manage.",
      },
    ],
    techDetails: [
      "Docker and Docker Compose guides",
      "Kubernetes deployment guide for existing clusters",
      "Binary releases for Linux, macOS, and Windows",
      "Works behind a reverse proxy with HTTPS termination",
    ],
  },
  "data-ownership": {
    title: "Data Ownership",
    description: "Keep memos in a database you choose, with zero telemetry and a ZIP export when you need it.",
    icon: LockIcon,
    hero: {
      title: "Your memos, on your side",
      subtitle: "Memos keeps your memos in your database, on your server. The software sends no usage data anywhere.",
    },
    benefits: [
      "Memos and settings live in the database you choose: SQLite, MySQL, or PostgreSQL",
      "Zero telemetry: the Memos software sends no usage data or analytics",
      "New memos default to private visibility",
      "Attachments stay in the database, on local disk, or in S3-compatible storage you configure",
      "Back up the database and attachment storage with your own tools",
      "Export your memos and attached files as a ZIP of Markdown and JSON",
    ],
    useCases: [
      {
        title: "Private Personal Notes",
        description: "Keep personal thoughts and ideas as private memos on a server you control.",
      },
      {
        title: "Internal Team Notes",
        description: "Keep internal notes on a server your organization runs, under its own access and backup policies.",
      },
      {
        title: "Data Location Requirements",
        description: "Keep notes in an environment where you decide where the data is stored.",
      },
    ],
    techDetails: [
      "SQLite, PostgreSQL, or MySQL storage options",
      "Database, local filesystem, or S3-compatible storage for attachments",
      "No telemetry or analytics in the software",
      "MIT-licensed code you can inspect",
    ],
  },
  "open-source": {
    title: "Open Source",
    description: "MIT licensed and developed in public, so the code can be inspected, forked, and improved.",
    icon: GitBranchIcon,
    hero: {
      title: "Open code you can read",
      subtitle: "Memos is MIT licensed software you can inspect, fork, modify, and run for as long as you need it.",
    },
    benefits: [
      "MIT license: use, modify, and distribute the code, including commercially",
      "Full source code on GitHub",
      "Issues, pull requests, and discussions happen in public",
      "No license fee for the software",
      "Fork and modify it for your own needs",
      "Public version history and commit logs",
    ],
    useCases: [
      {
        title: "Commercial Use",
        description: "Deploy in commercial environments under the terms of the MIT license.",
      },
      {
        title: "Educational Purposes",
        description: "Use for teaching, learning, and academic research projects.",
      },
      {
        title: "Custom Development",
        description: "Fork and modify the codebase to create specialized versions.",
      },
    ],
    techDetails: [
      "MIT License with clear terms",
      "GitHub-hosted with full commit history",
      "Open issue tracking and discussions",
      "Contributing guide in the documentation",
    ],
  },
  "no-fees": {
    title: "Free Software",
    description: "No subscription, seat pricing, or paid tier in Memos. Hosting it may still cost money.",
    icon: DollarSignIcon,
    hero: {
      title: "No license fee",
      subtitle: "Memos is open source under the MIT license. The software has no subscription, no paid tier, and no ads.",
    },
    benefits: [
      "No subscription or license fee for the software",
      "No paid tier or premium-only features",
      "No per-user seat pricing",
      "No ads, and zero telemetry in the software",
      "No trial period or activation step",
      "Community support through GitHub and Discord at no charge",
    ],
    useCases: [
      {
        title: "Personal Projects",
        description: "Use it for personal notes, journals, and ideas without a subscription.",
      },
      {
        title: "Small Businesses",
        description: "Deploy for teams without per-user licensing fees.",
      },
      {
        title: "Educational Institutions",
        description: "Provide it to students and faculty without per-seat costs.",
      },
    ],
    techDetails: [
      "No licensing server or activation required",
      "The same features in every installation",
      "MIT license lets anyone keep running or forking the code",
      "Hosting, storage, and optional AI provider costs are paid by whoever runs the instance",
    ],
  },
  "no-dependencies": {
    title: "Self-Contained",
    description: "One binary with the web app built in. Memos runs without any external service.",
    icon: CloudOffIcon,
    hero: {
      title: "Nothing else to run",
      subtitle: "Zero telemetry and no required outside services. Optional features reach out only when you use them.",
    },
    benefits: [
      "Zero telemetry: no usage reporting, analytics, or update checks",
      "No external service is required to run Memos",
      "The web interface is embedded in the binary and served by Memos itself",
      "SQLite by default, so there is no separate database server to run",
      "Outbound requests come from features you use, such as link previews, maps, webhooks, SSO, S3, or AI transcription",
      "Works on a private network without a cloud account",
    ],
    useCases: [
      {
        title: "Restricted Networks",
        description:
          "Run Memos where internet access is limited. Features that fetch from the web, such as map tiles and link previews, will not load there.",
      },
      {
        title: "Home or Office Network",
        description: "Run Memos on a local network and reach it without going through a cloud service.",
      },
      {
        title: "Fewer Third Parties",
        description: "Keep your note workflow simple by avoiding extra third-party services.",
      },
    ],
    techDetails: [
      "Single binary deployment",
      "Web assets embedded in the binary",
      "Local SQLite database by default",
      "Self-contained Docker image",
    ],
  },
  // Write: getting a thought down
  "instant-save": {
    title: "Saving & Drafts",
    description: "Your draft is kept in the browser as you type, and a memo saves with one shortcut.",
    icon: SaveIcon,
    hero: {
      title: "Keep the draft, save when it is down",
      subtitle: "Memos keeps your draft in the browser while you write. Press Cmd/Ctrl+Enter when the thought is down.",
    },
    benefits: [
      "Drafts are cached in your browser as you type, so a page reload does not lose them",
      "Save with Cmd/Ctrl+Enter or the save button",
      "Return to an unfinished draft with its uploads, location, and visibility intact",
      "New memos default to private visibility, so saving does not publish anything",
      "Markdown is styled in place as you write, with the syntax still editable",
      "Changes appear in your other open tabs and devices without a manual refresh",
    ],
    useCases: [
      {
        title: "Meeting Notes",
        description: "Write down decisions as they happen and save them as one memo when the meeting ends.",
      },
      {
        title: "Brainstorming Sessions",
        description: "Keep a draft open while ideas come. A reload does not lose it.",
      },
      {
        title: "Research Documentation",
        description: "Save findings as separate memos as you go, and tag them to find later.",
      },
    ],
    techDetails: [
      "Drafts stored in browser local storage, per account",
      "Cmd+Enter and Ctrl+Enter both save on every platform",
      "Memos saved through the Memos API to your database",
      "Server-sent events keep open clients up to date",
    ],
  },
  "quick-capture": {
    title: "Quick Capture",
    description: "Write a memo from any page in Memos, from your browser with the Web Clipper, or from Telegram.",
    icon: PlusCircleIcon,
    hero: {
      title: "Write it down before it is gone",
      subtitle: "Open the composer, type, and save. No title, folder, or template comes first.",
    },
    benefits: [
      "Open the composer from the sidebar on any signed-in page",
      "No title or folder to choose before you write",
      "Save with Cmd/Ctrl+Enter",
      "Record audio in the editor, and transcribe it when an admin has set up an AI provider",
      "Save pages, selections, and images with the Web Clipper for Chrome and Firefox",
      "Every memo is timestamped and appears at the top of your timeline",
    ],
    useCases: [
      {
        title: "Fleeting Ideas",
        description: "Write down a sudden idea before it disappears.",
      },
      {
        title: "Quick Reminders",
        description: "Add a task list item now, and find open tasks later with a saved view.",
      },
      {
        title: "Web Clipping",
        description: "Save a page or selection from the web as a memo, with its source link.",
      },
    ],
    techDetails: [
      "Composer available on every signed-in route",
      "Web Clipper extension for Chromium-based browsers and Firefox",
      "Telegram bot (Memogram) and REST API for other ways in",
      "Installable web app for your phone's home screen",
    ],
  },
  "markdown-support": {
    title: "Markdown Notes",
    description: "Write memos in Markdown, with code highlighting, tables, task lists, math, and diagrams.",
    icon: FileTextIcon,
    hero: {
      title: "Write in plain Markdown",
      subtitle: "Memo content is plain text written in Markdown, so it stays readable outside Memos.",
    },
    benefits: [
      "Memo content is stored as plain Markdown text, not a proprietary format",
      "GitHub Flavored Markdown (GFM) compatibility",
      "Syntax highlighting for code blocks",
      "Tables, task lists, footnotes, and strikethrough",
      "Mermaid diagrams for flowcharts and sequence diagrams",
      "LaTeX math with explicit delimiters",
    ],
    useCases: [
      {
        title: "Technical Notes",
        description: "Write technical notes with code blocks, diagrams, and structured content.",
      },
      {
        title: "Study Notes",
        description: "Keep formulas, footnotes, and references in short memos.",
      },
      {
        title: "Project Planning",
        description: "Track requirements and tasks with Markdown task lists.",
      },
    ],
    techDetails: [
      "unified and remark Markdown processing",
      "highlight.js for syntax highlighting",
      "Mermaid for diagram rendering",
      "KaTeX for mathematical expressions",
    ],
  },
  "media-integration": {
    title: "Attachments & Media",
    description: "Attach images, video, audio, and documents to a memo by dropping, pasting, or uploading them.",
    icon: ImageIcon,
    hero: {
      title: "Keep files with the memo",
      subtitle: "Drop in a screenshot, paste an image, or record audio. The file stays attached to the memo it belongs to.",
    },
    benefits: [
      "Drop, paste, or upload files, with progress and retry for inline images",
      "Server-generated thumbnails for images",
      "Support for images, video, audio, PDFs, and other documents",
      "Link previews for URLs, which you can turn off in your display settings",
      "Embedded players from trusted sources such as YouTube, Vimeo, and Spotify",
      "Full-screen lightbox for images and video, and inline playback for audio",
    ],
    useCases: [
      {
        title: "Visual Documentation",
        description: "Keep screenshots, diagrams, and visual explanations next to the notes they explain.",
      },
      {
        title: "Project Archives",
        description: "Store project files, assets, and related documents alongside your memos.",
      },
      {
        title: "Voice Notes",
        description: "Record audio in the editor and keep it with the memo, or transcribe it when your instance has an AI provider.",
      },
    ],
    techDetails: [
      "Configurable upload size limit",
      "JPEG thumbnails generated and cached on the server",
      "Database, local filesystem, or S3-compatible storage, with a file path template",
      "Attachment library with Media, Audio, and Documents tabs and unused-file cleanup",
    ],
  },
  // Find: getting back to a memo
  "universal-search": {
    title: "Search & Filters",
    description: "Find a memo again by searching its text, or filter by tag, date, visibility, and more.",
    icon: SearchIcon,
    hero: {
      title: "Find it when you need it",
      subtitle: "Search the text of your memos, or write a filter and save it as a view to run again.",
    },
    benefits: [
      "Search the text of your memos, with matches highlighted",
      "Case-insensitive matching",
      "Filter by tag, visibility, time range, pinned state, links, code, tasks, or location",
      "Save a filter as a view and open it from the sidebar",
      "Results follow the current Space, view, and tag filters",
      "Look back through a day or month with Calendar, or by place with Map",
    ],
    useCases: [
      {
        title: "Finding a Past Note",
        description: "Search for a word you remember and open the memo it came from.",
      },
      {
        title: "Research Organization",
        description: "Filter research notes by tag and date to narrow a long history.",
      },
      {
        title: "Open Tasks",
        description: "Save a view for unchecked task items and see every open task across your memos.",
      },
    ],
    techDetails: [
      "Case-insensitive text matching in SQLite, MySQL, and PostgreSQL",
      "CEL filter expressions translated to SQL",
      "Validate a filter before saving it as a view",
      "The same filter syntax in the app and the API",
    ],
  },
  tags: {
    title: "Tags",
    description: "Add #tags as you write, nest them with a slash, and filter your memos by any tag.",
    icon: TagIcon,
    hero: {
      title: "Tag while you write",
      subtitle: "Type #project in a memo and it becomes a tag. Structure grows from what you write, not from setup.",
    },
    benefits: [
      "Tags come from the memo text: write #tag anywhere in ordinary text",
      "Suggestions from your existing tags when you type #",
      "Nested tags with a slash, such as #project/backend",
      "A tag tree in the sidebar with memo counts",
      "Filter by one tag or a whole branch, or combine tags with other conditions in a view",
      "Personal tag colors and blur rules, including pattern matches",
    ],
    useCases: [
      {
        title: "Project Organization",
        description: "Tag memos by project, priority, or status for easy tracking.",
      },
      {
        title: "Topic Categorization",
        description: "Group memos by topics, themes, or categories.",
      },
      {
        title: "Status Tags",
        description: "Use tags to move memos through the stages of a workflow.",
      },
    ],
    techDetails: [
      "Hashtag-style tagging (#tag)",
      "Tags extracted and stored when a memo is saved",
      "Tag autocomplete in the editor",
      "Tag names in any language, including numbers and emoji",
    ],
  },
  "timeline-view": {
    title: "Timeline View",
    description: "Browse quick notes, logs, and ideas in the order you wrote them.",
    icon: ClockIcon,
    hero: {
      title: "Your private timeline",
      subtitle: "Browse your memos in time order and look back through them in the order they happened.",
    },
    benefits: [
      "A feed of your memos in time order, with a section for pinned memos",
      "A Calendar page to open any day or month and read what you wrote",
      "A month activity calendar in the sidebar shows which days have memos",
      "Your place in the feed is kept when you return from a memo",
      "Write a memo for a past date from the Calendar",
      "A Map of memos that have a saved location",
    ],
    useCases: [
      {
        title: "Personal Journal",
        description: "Browse your daily memos like a journal and see your thoughts over time.",
      },
      {
        title: "Looking Back",
        description: "See what you were working on during any day or month.",
      },
      {
        title: "Archive",
        description: "Archive memos you are done with. They are kept under Archived, out of the main timeline.",
      },
    ],
    techDetails: [
      "Paged loading for long memo histories",
      "Date-based filtering and navigation",
      "Browse by creation or update time",
      "One, two, three, or automatic columns, with a compact mode",
    ],
  },
  // Share: a second chapter, chosen memo by memo
  "public-sharing": {
    title: "Public Sharing",
    description: "Share one memo with a link, make it public, or save it as an image. Everything else stays private.",
    icon: Share2Icon,
    hero: {
      title: "Share only what you choose",
      subtitle: "New memos start private. Create a link for one memo, with an optional expiry, and revoke it anytime.",
    },
    benefits: [
      "Share links for a single memo that expire never, or after 1, 7, or 30 days",
      "Readers open a share link without signing in",
      "Revoke a link at any time to stop access",
      "Four visibility levels: private, signed-in users, public, or members of a Space",
      "Share a memo as an image for chats and social posts",
      "Public memos appear in Explore when the instance allows public access",
    ],
    useCases: [
      {
        title: "Public Notes",
        description: "Share tutorials, guides, and documentation with colleagues or the public.",
      },
      {
        title: "Public Log",
        description: "Use public memos as a simple log or portfolio of your work.",
      },
      {
        title: "Team Collaboration",
        description: "Share meeting notes and decisions with team members via simple links.",
      },
    ],
    techDetails: [
      "Per-memo visibility: PRIVATE, PROTECTED, PUBLIC, or SPACE",
      "Revocable share tokens that expose only the selected memo and its attachments",
      "Instance-wide switch between public and private access",
      "Share as image rendered in the browser",
    ],
  },
  microblog: {
    title: "Microblog",
    description: "Publish short public memos from your own instance as a personal microblog.",
    icon: MessageCircleIcon,
    hero: {
      title: "A microblog on your own server",
      subtitle: "Share quick thoughts and updates from an instance you run, one public memo at a time.",
    },
    benefits: [
      "Write a short memo and set it to public to publish it",
      "A chronological Explore feed, with no ranking algorithm, ads, or telemetry in the software",
      "Private memos stay out of the public feed",
      "Images, links, and Markdown formatting in every post",
      "Comments and emoji reactions from signed-in users",
      "Served from your own domain through your reverse proxy",
    ],
    useCases: [
      {
        title: "Personal Updates",
        description: "Share daily thoughts, progress updates, and life moments on your own platform.",
      },
      {
        title: "Developer Blog",
        description: "Post quick coding tips, project updates, and technical insights.",
      },
      {
        title: "Digital Garden",
        description: "Keep a public space where short ideas collect over time.",
      },
    ],
    techDetails: [
      "Per-memo visibility, so private memos never enter the public feed",
      "Instance access setting controls whether anonymous visitors can read public memos",
      "Share links and share-as-image for posting elsewhere",
      "REST API and webhooks for publishing workflows",
    ],
  },
  // Using Memos day to day
  "beautiful-design": {
    title: "Interface & Themes",
    description: "A quiet interface for writing and reading, with light, dark, and paper themes on desktop and mobile.",
    icon: LayersIcon,
    hero: {
      title: "A quiet place to write",
      subtitle: "A clean interface that keeps the focus on writing and reading across devices.",
    },
    benefits: [
      "Focus mode for a quieter writing surface",
      "Layouts for phone and desktop screens",
      "Light, dark, and paper themes, or follow your system setting",
      "One, two, three, or automatic columns, plus a compact mode",
      "Link previews shown with memos, configurable per account",
      "Changes appear across open tabs and devices without a refresh",
    ],
    useCases: [
      {
        title: "Mobile Note-Taking",
        description: "Write on the go from your phone's browser or the installed web app.",
      },
      {
        title: "Desktop Writing",
        description: "A focused desktop layout with keyboard shortcuts for formatting and saving.",
      },
      {
        title: "Several Devices",
        description: "Every device reads the same instance, and open clients update when memos change.",
      },
    ],
    techDetails: [
      "React 19",
      "TypeScript for type safety",
      "Tailwind CSS for consistent styling",
      "Dark mode with system preference detection",
      "Installable as a web app",
    ],
  },
  "pwa-support": {
    title: "Progressive Web App",
    description: "Add Memos to your home screen or desktop and open it in its own window.",
    icon: MonitorSmartphoneIcon,
    hero: {
      title: "Install it like an app",
      subtitle: "Memos ships a web app manifest, so supported browsers can install it with an icon and its own window.",
    },
    benefits: [
      "Install on desktop and mobile from a supported browser",
      "App icon and standalone window",
      "The same interface and features as the browser version",
      "Updates arrive when your instance is upgraded, with no app store step",
    ],
    useCases: [
      {
        title: "Phone Home Screen",
        description: "Open Memos from your home screen and start a memo without finding a browser tab.",
      },
      {
        title: "App-Like Experience",
        description: "Use Memos in its own window on desktop or mobile, with every feature of the web app.",
      },
      {
        title: "Desktop Window",
        description: "Keep Memos in a window beside your other work.",
      },
    ],
    techDetails: [
      "Web App Manifest with standalone display",
      "App icons for Android and iOS home screens",
      "Served from your own instance; no app store listing",
      "Needs a network connection to your instance",
    ],
  },
  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    description: "Save a memo and format Markdown from the keyboard while you write.",
    icon: KeyboardIcon,
    hero: {
      title: "Write without reaching for the mouse",
      subtitle: "The editor has shortcuts for saving, formatting, headings, and lists.",
    },
    benefits: [
      "Cmd/Ctrl+Enter saves the memo",
      "Cmd/Ctrl+B, I, and E for bold, italic, and inline code; Cmd/Ctrl+Shift+S for strikethrough",
      "Cmd/Ctrl+Alt+1, 2, or 3 for headings, Cmd/Ctrl+Alt+0 for a paragraph, and Cmd/Ctrl+Alt+C for a code block",
      "Cmd/Ctrl+Shift+7, 8, or 9 for numbered, bulleted, and task lists",
      "Tab and Shift+Tab indent and outdent list items",
      "Type # for tag suggestions, and press Escape to leave the editor",
    ],
    useCases: [
      {
        title: "Longer Memos",
        description: "Add headings and lists without leaving the keyboard.",
      },
      {
        title: "Keyboard Users",
        description: "Escape moves focus out of the editor, so Tab does not trap you inside it.",
      },
      {
        title: "Quick Saves",
        description: "Write, press Cmd/Ctrl+Enter, and move on.",
      },
    ],
    techDetails: [
      "CodeMirror 6 editor keymap",
      "Cmd and Ctrl both work for saving on every platform",
      "Shortcuts are fixed and cannot be remapped",
      "Quick Find opens from the sidebar; the Cmd/Ctrl+K shortcut was removed in 0.31",
    ],
  },
  "customizable-ui": {
    title: "Customizable",
    description: "Set your instance's name, logo, and theme, and add your own CSS.",
    icon: PaletteIcon,
    hero: {
      title: "Set it up your way",
      subtitle: "Name the instance, add a logo, pick a theme, and adjust the details so it feels like your own.",
    },
    benefits: [
      "Custom instance title, description, and logo, also used as the browser icon",
      "Light, dark, and paper themes, or follow the system setting",
      "Additional CSS for instance-wide style changes",
      "Additional JavaScript for trusted instance-wide scripts",
      "Interface in more than 40 languages",
      "Personal display settings for columns, compact mode, link previews, and tag colors",
    ],
    useCases: [
      {
        title: "Organization Branding",
        description: "Match your organization's name and logo.",
      },
      {
        title: "Personal Touch",
        description: "Create a note-taking space that looks the way you like.",
      },
      {
        title: "Telling Instances Apart",
        description: "Differentiate between multiple Memos instances with custom branding.",
      },
    ],
    techDetails: [
      "Instance settings managed from the admin settings page or the API",
      "Additional CSS and JavaScript injection",
      "Custom title and logo applied to the browser tab",
      "Custom icons or emoji for views and Spaces",
      "i18n support with community language packs",
    ],
  },
  // Running Memos
  "cross-platform": {
    title: "Cross-Platform",
    description: "Run Memos with Docker, as a native binary on Linux, macOS, or Windows, or in Kubernetes.",
    icon: ServerIcon,
    hero: {
      title: "Deploy where you already run things",
      subtitle: "From a Raspberry Pi to a larger server setup, Memos runs in the environments people actually use.",
    },
    benefits: [
      "Docker images for amd64, arm64, and armv7",
      "Native binaries for Linux, macOS (Intel and Apple Silicon), and Windows",
      "A Kubernetes guide for clusters you already operate",
      "Runs on ARM boards such as the Raspberry Pi and on x86-64 servers",
      "Docker Compose for deployments that are easy to recreate",
      "One binary with the web interface built in",
    ],
    useCases: [
      {
        title: "Home Server Setup",
        description: "Install directly on your home server or NAS device.",
      },
      {
        title: "Cloud Deployment",
        description: "Deploy on any cloud provider using Docker or Kubernetes.",
      },
      {
        title: "Development Environment",
        description: "Run locally for development and testing on any platform.",
      },
    ],
    techDetails: [
      "Go backend compiled for each platform",
      "Multi-architecture Docker images (linux/amd64, linux/arm64, linux/arm/v7)",
      "Release archives published on GitHub Releases",
      "Runs under systemd, launchd, or a Windows service wrapper",
      "GitHub Actions automated builds for all platforms",
    ],
  },
  performance: {
    title: "Performance",
    description: "One Go process with in-process caching and no extra services, so a modest host can run it.",
    icon: ZapIcon,
    hero: {
      title: "Few moving parts",
      subtitle: "One Go process serves the API and the web app. There is no separate cache, queue, or search service to run.",
    },
    benefits: [
      "The app talks to your own server, not a third-party cloud",
      "An in-process cache for settings and users, cleared on every write",
      "SQLite in WAL mode by default, so reads continue during writes",
      "Server-generated image thumbnails keep attachment views light",
      "Long feeds load in pages",
      "Move to MySQL or PostgreSQL when you want a separate database server",
    ],
    useCases: [
      {
        title: "Personal Instances",
        description: "A single user on SQLite needs no separate database server.",
      },
      {
        title: "Resource-Constrained Environments",
        description: "Run on a small VPS, a Raspberry Pi, or other low-power hardware.",
      },
      {
        title: "Shared Instances",
        description: "For more users, use MySQL or PostgreSQL and size the host from real usage.",
      },
    ],
    techDetails: [
      "Go backend with the Echo web framework",
      "SQLite WAL mode and busy timeout by default",
      "In-memory caching layer",
      "Connect RPC and gRPC over Protocol Buffers",
    ],
  },
  lightweight: {
    title: "Lightweight",
    description: "One binary and SQLite by default, so Memos fits on small hardware.",
    icon: FeatherIcon,
    hero: {
      title: "Fits on small hardware",
      subtitle: "One process and a SQLite file are enough to start. No separate database, cache, or search server is required.",
    },
    benefits: [
      "A single binary with the web interface built in",
      "SQLite by default, stored in your data directory",
      "No separate cache, queue, or search service",
      "ARM builds for Raspberry Pi-class hardware",
      "Runs as one Docker container with a persistent data directory",
      "A good fit for a Raspberry Pi, an old laptop, or a small VPS",
    ],
    useCases: [
      {
        title: "Raspberry Pi Hosting",
        description: "Run a personal Memos instance on a Raspberry Pi at home.",
      },
      {
        title: "Small VPS",
        description: "Host Memos on a small virtual server.",
      },
      {
        title: "Old Hardware",
        description: "Put a spare computer to use as a home Memos server.",
      },
    ],
    techDetails: [
      "Compiled Go binary with minimal dependencies",
      "In-process cache with a bounded size",
      "Web assets embedded in the binary",
      "Editor code loaded on demand",
    ],
  },
  "database-support": {
    title: "Multi-Database",
    description: "Choose between SQLite, PostgreSQL, or MySQL to match your infrastructure needs.",
    icon: DatabaseIcon,
    hero: {
      title: "Your database, your choice",
      subtitle: "Memos supports SQLite, PostgreSQL, and MySQL, so you can choose the database that fits your setup.",
    },
    benefits: [
      "SQLite by default, with no database server to run",
      "PostgreSQL for managed or larger deployments",
      "MySQL for teams already using it in their stack",
      "Database migrations run automatically on startup",
      "SQLite WAL mode and busy timeout set by default",
      "View filters translated to each database, and validated before saving",
    ],
    useCases: [
      {
        title: "Single-User Setup",
        description: "Use SQLite for personal instances with minimal configuration.",
      },
      {
        title: "Team Collaboration",
        description: "Use PostgreSQL or MySQL for multi-user instances.",
      },
      {
        title: "Existing Database Infrastructure",
        description: "Integrate with existing database infrastructure and backup systems.",
      },
    ],
    techDetails: [
      "Native Go drivers for SQLite, MySQL, and PostgreSQL",
      "Automated migrations and versioning",
      "Configured with MEMOS_DRIVER and MEMOS_DSN",
      "SQLite pragmas tunable through the DSN",
    ],
  },
  "api-first": {
    title: "API & Integrations",
    description: "REST and gRPC APIs for custom capture flows, integrations, and automation.",
    icon: CodeIcon,
    hero: {
      title: "Built for integration",
      subtitle: "Every Memos feature is available over the API, so scripts, bots, and assistants can write and find memos too.",
    },
    benefits: [
      "REST API for custom integrations and automation",
      "gRPC and Connect RPC, backed by the same services",
      "OpenAPI 3.0 specification for client generation",
      "Personal access tokens sent as Bearer credentials, revocable at any time",
      "Signed webhooks when memos are created, updated, deleted, or commented on",
      "A built-in MCP server at /mcp for AI assistants",
    ],
    useCases: [
      {
        title: "Custom Applications",
        description: "Build custom frontends or mobile apps using the API.",
      },
      {
        title: "Automation Workflows",
        description: "Trigger scripts or automation services from webhooks, and post memos back with the API.",
      },
      {
        title: "Data Migration",
        description: "Move data in and out of Memos with the API.",
      },
    ],
    techDetails: [
      "RESTful HTTP API with JSON responses",
      "gRPC API with Protocol Buffers",
      "OpenAPI 3.0 specification with reference documentation",
      "Personal access tokens with optional expiration",
      "Standard Webhooks-compatible signatures",
    ],
  },
  // Community & Ecosystem
  community: {
    title: "Community-Driven",
    description: "Developed in public on GitHub, with discussions, Discord, and outside contributors.",
    icon: HeartIcon,
    hero: {
      title: "Built together",
      subtitle: "Memos is built in the open. Report bugs, suggest features, translate, and contribute code on GitHub.",
    },
    benefits: [
      "Issues, pull requests, and releases are public on GitHub",
      "Release notes published with each version",
      "Feature requests and bug reports through GitHub issues",
      "Multiple communication channels including Discord and GitHub Discussions",
      "A live demo to try before you install",
      "Community translations of the interface",
    ],
    useCases: [
      {
        title: "Feature Requests",
        description: "Suggest new features in GitHub issues or Discussions.",
      },
      {
        title: "Bug Reporting",
        description: "Report issues and work on fixes with the maintainers.",
      },
      {
        title: "Getting Help",
        description: "Ask questions and share solutions with other Memos users in Discord or GitHub Discussions.",
      },
    ],
    techDetails: [
      "GitHub Discussions for community interaction",
      "Discord server for real-time chat",
      "Versioned releases with published notes",
      "Contributing guide in the documentation",
    ],
  },
  "multi-language": {
    title: "Multi-Language Support",
    description: "Use Memos in more than 40 languages, with translations contributed by the community.",
    icon: GlobeIcon,
    hero: {
      title: "Use it in your language",
      subtitle: "Community translations help more people use Memos in the language they prefer.",
    },
    benefits: [
      "Interface in more than 40 languages",
      "Community-contributed translations",
      "Switch languages in settings",
      "Right-to-left layout for languages such as Arabic, Hebrew, and Persian",
      "Relative dates shown in your language",
      "Language detected from your browser on first visit",
    ],
    useCases: [
      {
        title: "International Teams",
        description: "Support team members who speak different languages.",
      },
      {
        title: "Global Organizations",
        description: "Deploy across regions with localized interfaces.",
      },
      {
        title: "Personal Preference",
        description: "Use Memos in the language you think in.",
      },
    ],
    techDetails: [
      "i18next internationalization framework",
      "JSON-based translation files in the repository",
      "Language detection from browser settings",
      "Translations contributed through GitHub pull requests",
    ],
  },
  // Own: moving memos in and out
  import: {
    title: "Import",
    description: "Import a Memos export ZIP into your account on another instance. Imports from other note apps are not supported.",
    icon: UploadIcon,
    wip: true,
    hero: {
      title: "Move your memos between instances",
      subtitle: "Upload a Memos export, check the preview, and choose how to handle memos that already exist.",
    },
    benefits: [
      "Imports Memos export ZIPs, including older memos-archive files",
      "Validates the file and shows a preview before creating or replacing memos",
      "Choose to keep yours, replace, or create a copy when a memo already exists",
      "Restores attachments, relations, and comment threads when their targets resolve",
      "Matches Spaces you belong to by ID, then by name",
      "Reports created, updated, skipped, and failed memos, with warnings",
    ],
    useCases: [
      {
        title: "Moving Instances",
        description: "Take your memos from one Memos server to another.",
      },
      {
        title: "Merging Accounts",
        description: "Import an export into an existing account and keep or copy matching memos.",
      },
      {
        title: "Restoring Your Memos",
        description: "Restore your own memos from a personal export. Instance backups use the database and storage instead.",
      },
    ],
    techDetails: [
      "Memos Export Format: Markdown content plus JSON metadata",
      "Existing memos matched by ID, not by text",
      "Accounts, settings, access tokens, and share links are not transferred",
      "Other apps' exports and loose Markdown files are not supported",
    ],
  },
  export: {
    title: "Export",
    description: "Download every memo you wrote, with attached files, as a ZIP of Markdown and JSON.",
    icon: DownloadIcon,
    hero: {
      title: "Take your memos with you",
      subtitle: "Export packs your memos, their metadata, and attached files into one ZIP you can read outside Memos.",
    },
    benefits: [
      "Memo content as Markdown you can read in any text editor",
      "JSON metadata for each memo: times, visibility, pinned state, location, and Space",
      "Includes your active and archived memos and your comments, regardless of filters",
      "Attached files included, whether stored in the database, on disk, or in S3",
      "Relations kept, so links between memos survive an import",
      "Share a single memo as an image when you need a picture instead",
    ],
    useCases: [
      {
        title: "Personal Backup",
        description: "Keep a personal copy of your memos and their files.",
      },
      {
        title: "Reading Outside Memos",
        description: "Open the Markdown in any text editor.",
      },
      {
        title: "Archival Storage",
        description: "Keep a finished period of notes as a single file.",
      },
    ],
    techDetails: [
      "Memos Export Format ZIP from Settings or the ExportMemos API",
      "Import the same ZIP into another Memos instance",
      "The ZIP is not encrypted; store it accordingly",
      "Instance backups use the database and attachment storage, not this export",
    ],
  },
} as const satisfies Record<(typeof FEATURE_SLUGS)[number], FeatureDefinition>;
