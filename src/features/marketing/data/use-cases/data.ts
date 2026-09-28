/**
 * Use case definitions and metadata for Memos
 * This serves as the single source of truth for all use case-related data
 */

import { BookOpenIcon, CodeIcon, GraduationCapIcon, PencilIcon, ServerIcon, ShieldCheckIcon, UsersIcon, WrenchIcon } from "lucide-react";
import type { USE_CASE_SLUGS } from "./slugs";
import type { UseCaseDefinition } from "./types";

/**
 * Complete use case definitions with all metadata
 */
export const USE_CASES = {
  developers: {
    title: "Software Developers & Engineers",
    subtitle: "Code snippets, technical notes, and architecture decisions",
    description:
      "Developers use Memos to save code snippets, debug notes, architecture decisions, and learning resources as short memos. Fenced code blocks, tags, and search make them easy to find again.",
    icon: CodeIcon,
    workflows: [
      "Store reusable code snippets and command-line recipes",
      "Document bug investigations and troubleshooting steps",
      "Record architecture decisions and technical trade-offs",
      "Collect learning resources while exploring new technologies",
      "Track API endpoints, environment details, and configuration notes",
      "Maintain personal development logs and TIL (Today I Learned) entries",
    ],
    whyMemos: [
      "Syntax highlighting for common languages in fenced code blocks",
      "Cmd/Ctrl+Enter saves a memo without leaving the keyboard",
      "REST and gRPC APIs, webhooks, and a built-in MCP server connect Memos to your tools",
      "Self-hosting keeps work notes on a server you run, and new memos start private",
      "No titles to invent: write the snippet and add a #tag",
    ],
    features: [
      { name: "Markdown Support", slug: "markdown-support" },
      { name: "Saving & Drafts", slug: "instant-save" },
      { name: "API-First Design", slug: "api-first" },
    ],
    seo: {
      title: "Memos for Software Developers - Self-Hosted Code Snippet Manager & Technical Notes",
      description:
        "See how software developers use Memos for code snippets, debug notes, architecture decisions, and TIL logs. Open source and self-hosted, with Markdown and syntax highlighting.",
      keywords: [
        "developer note-taking tool",
        "code snippet manager",
        "technical documentation tool",
        "programming notes",
        "developer notes",
        "self-hosted code snippets",
        "markdown code notes",
        "developer wiki",
        "TIL tracker",
        "architecture decision records",
      ],
    },
  },
  writers: {
    title: "Content Creators & Writers",
    subtitle: "Article drafts, research collection, and creative ideas",
    description:
      "Writers and content creators use Memos to catch ideas, collect research, and keep short working notes beside longer drafts. Every memo lands in a timeline you can search by tag or date.",
    icon: PencilIcon,
    workflows: [
      "Sketch outlines and opening lines in Markdown",
      "Collect research links, quotes, and source materials",
      "Capture creative ideas and story concepts as they emerge",
      "Keep a running log of what you published and when",
      "Pin style notes and reusable snippets to the top of your timeline",
      "Tag drafts by project so every version of an idea stays together",
    ],
    whyMemos: [
      "A plain composer: write first, add tags later",
      "Your drafts stay on an instance you run, with ZIP export when you need it",
      "Cmd/Ctrl+Enter saves a thought before it slips away",
      "Markdown formatting for clean, portable content",
      "The timeline shows how an idea developed over time",
    ],
    features: [
      { name: "Markdown Support", slug: "markdown-support" },
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Quick Capture", slug: "quick-capture" },
    ],
    seo: {
      title: "Memos for Writers & Content Creators - Distraction-Free Writing Tool",
      description:
        "See how writers and content creators use Memos to catch ideas, collect research, and keep working notes in Markdown on a server they control.",
      keywords: [
        "writing app for authors",
        "content creation tool",
        "blogging note-taking tool",
        "distraction-free writing",
        "writer's notebook",
        "article draft manager",
        "research collection tool",
        "creative writing software",
        "markdown writing app",
        "self-hosted writing tool",
      ],
    },
  },
  "privacy-professionals": {
    title: "Privacy-Conscious Professionals",
    subtitle: "Journalists, healthcare workers, legal professionals",
    description:
      "Professionals who handle sensitive information use Memos for working notes and research they keep to themselves. New memos start private, and self-hosting lets you decide where the server and database run.",
    icon: ShieldCheckIcon,
    workflows: [
      "Log interview notes and source contacts",
      "Keep observation notes on infrastructure your organization manages",
      "Maintain client case notes and legal research",
      "Store investigative research and sensitive findings",
      "Keep personal journals and reflections as private memos",
      "Archive strategy notes that should not sit in a third-party cloud",
    ],
    whyMemos: [
      "Zero telemetry: the Memos software sends no usage data",
      "Can run in isolated environments you control",
      "New memos default to Private; you choose when to share",
      "Whoever runs the instance controls access, retention, and backups",
      "No third-party service is required to run it",
    ],
    features: [
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "No External Dependencies", slug: "no-dependencies" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Secure Note-Taking for Privacy-Focused Professionals",
      description:
        "See how journalists, healthcare workers, and legal professionals use Memos for sensitive working notes on a self-hosted server they control.",
      keywords: [
        "private note-taking tool",
        "confidential note app",
        "journalist notes tool",
        "legal case management",
        "healthcare note-taking tool",
        "secure patient notes",
        "self-hosted private notes",
        "zero telemetry note taking",
      ],
    },
  },
  "students-researchers": {
    title: "Students & Researchers",
    subtitle: "Academic notes, research compilation, and study materials",
    description:
      "Students and researchers use Memos for lecture notes, reading trails, and thesis work. Write short memos as you go, then find them again by tag, search, or date.",
    icon: GraduationCapIcon,
    workflows: [
      "Take lecture notes with rich Markdown formatting",
      "Note key points and citations from the papers you read",
      "Compile thesis notes and dissertation research",
      "Collect study notes for exam preparation",
      "Share memos with a study group on a shared instance",
      "Archive academic projects and coursework portfolios",
    ],
    whyMemos: [
      "Open source, with no subscription or license fee",
      "No note limits in the software; storage depends on your server",
      "Markdown formatting for academic writing and citations",
      "Attach images, screenshots, and files to any memo",
      "Search memo text, filter by tag, and save filters as views",
    ],
    features: [
      { name: "Zero Subscription Fees", slug: "no-fees" },
      { name: "Markdown Support", slug: "markdown-support" },
      { name: "Media Integration", slug: "media-integration" },
    ],
    seo: {
      title: "Memos for Students & Researchers - Free Academic Note-Taking Software",
      description:
        "See how students and researchers use Memos for lecture notes, reading notes, and thesis research, written in Markdown with no subscription fees.",
      keywords: [
        "student note taking app",
        "academic research tool",
        "thesis writing software",
        "lecture note-taking tool",
        "research organization",
        "citation manager",
        "study notes software",
        "graduate student tools",
        "academic writing app",
        "free student notes",
      ],
    },
  },
  "personal-knowledge": {
    title: "Personal Journaling & Notes",
    subtitle: "Daily journaling, personal notes, and idea trails",
    description:
      "People use Memos for daily journals, reading notes, and idea trails. Each memo lands in a timeline, so you can look back through any day or find an entry by tag or search.",
    icon: BookOpenIcon,
    workflows: [
      "Write daily journal entries and personal reflections",
      "Keep a personal archive of ideas and references",
      "Maintain reading notes and book summaries",
      "Log personal goals, habits, and life milestones",
      "Collect interesting quotes, insights, and inspiration",
      "Let ideas build up over time in a simple timeline",
    ],
    whyMemos: [
      "Short, untitled memos: nothing to set up before you write",
      "A timeline and calendar that follow the order of your days",
      "Tags and memo links add structure after you write",
      "Your journal stays on a server you choose",
      "Export your memos as a ZIP whenever you want",
    ],
    features: [
      { name: "Timeline View", slug: "timeline-view" },
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Performance", slug: "performance" },
    ],
    seo: {
      title: "Memos for Personal Journaling & Notes",
      description:
        "See how people use Memos for personal notes, daily journaling, and idea trails in a personal timeline they host themselves.",
      keywords: [
        "personal notes",
        "journal app",
        "digital garden notes",
        "personal wiki software",
        "daily journaling app",
        "life logging tool",
        "idea trail notes",
        "self-hosted journal",
      ],
    },
  },
  "hobbyists-makers": {
    title: "Hobbyists & Makers",
    subtitle: "Project logs, ideas collection, and creative documentation",
    description:
      "Makers, DIY enthusiasts, and hobbyists use Memos to keep build logs, collect inspiration, and track materials. Photos attach to the memo, and the timeline shows how each project moved.",
    icon: WrenchIcon,
    workflows: [
      "Document DIY projects with photos, notes, and progress logs",
      "Collect inspiration and ideas for future creative projects",
      "Track materials, tools, and equipment for various hobbies",
      "Maintain build logs for electronics, woodworking, or crafts",
      "Store recipes, techniques, and tutorials for quick reference",
      "Create project plans and step-by-step documentation",
    ],
    whyMemos: [
      "Attach photos and videos of your work to a memo",
      "Write a quick memo when an idea strikes mid-project",
      "Chronological logs help track project progress over time",
      "Your project notes stay on a server you run",
      "Tags sort projects by type, status, or material",
    ],
    features: [
      { name: "Media Integration", slug: "media-integration" },
      { name: "Saving & Drafts", slug: "instant-save" },
      { name: "Data Ownership", slug: "data-ownership" },
    ],
    seo: {
      title: "Memos for Makers & Hobbyists - DIY Project Logging & Creative Documentation",
      description:
        "See how makers, DIY enthusiasts, and hobbyists use Memos for build logs, project notes, and idea collection, with photo attachments on a self-hosted server.",
      keywords: [
        "DIY project notes",
        "maker documentation",
        "hobby project tracker",
        "build log app",
        "creative project notes",
        "woodworking notes",
        "electronics project log",
        "crafting documentation",
        "maker note-taking tool",
        "DIY notes",
      ],
    },
  },
  "self-hosting": {
    title: "Homelab & Self-Hosting Community",
    subtitle: "Server documentation, configuration notes, and infrastructure logs",
    description:
      "Self-hosting enthusiasts and homelab operators use Memos to log server configurations, troubleshooting steps, and infrastructure changes. It runs as a single Docker container beside the rest of the stack.",
    icon: ServerIcon,
    workflows: [
      "Document server configurations and network topology",
      "Record troubleshooting steps and the fixes that worked",
      "Track infrastructure changes and upgrade history",
      "Store backup procedures and disaster recovery plans",
      "Maintain hardware inventory and equipment notes",
      "Create runbooks for common maintenance tasks",
    ],
    whyMemos: [
      "Runs on Raspberry Pi and other ARM hardware",
      "A single Go binary with a small footprint",
      "Official Docker images for amd64 and ARM",
      "Multiple database options (SQLite, PostgreSQL, MySQL)",
      "No external dependencies after setup",
    ],
    features: [
      { name: "Cross-Platform Support", slug: "cross-platform" },
      { name: "Performance", slug: "performance" },
      { name: "No External Dependencies", slug: "no-dependencies" },
    ],
    seo: {
      title: "Memos for Homelab & Self-Hosting - Server Documentation & Infrastructure Notes",
      description:
        "See how self-hosting enthusiasts use Memos for homelab notes, server configurations, and infrastructure logs. Open source, light on resources, and simple to run on your own hardware.",
      keywords: [
        "homelab documentation",
        "self-hosting notes",
        "server configuration tool",
        "infrastructure documentation",
        "raspberry pi note-taking tool",
        "sysadmin notes",
        "network documentation",
        "IT runbook software",
        "homelab wiki",
        "self-hosted documentation",
      ],
    },
  },
  family: {
    title: "Families & Friends",
    subtitle: "A shared timeline for your closest people",
    description:
      "Families and friend groups can share one Memos instance for updates, photos, and everyday notes. Protected memos are visible only to people signed in to your instance.",
    icon: UsersIcon,
    workflows: [
      "Share daily updates with family members and close friends",
      "Post milestone photos, travel notes, and personal memories",
      "Keep household plans, lists, and event notes in one place",
      "Collect recipes, traditions, and family reference notes",
      "Keep a shared timeline of moments you want to look back on",
      "Use comments and reactions to stay connected without public social media",
    ],
    whyMemos: [
      "New memos start private; set Protected to share with signed-in members",
      "A simple composer that non-technical family members can use",
      "Your shared memos stay on a server you run",
      "Markdown and attachments work well for notes, photos, and links",
      "The timeline and calendar let you look back through any day",
    ],
    features: [
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Saving & Drafts", slug: "instant-save" },
      { name: "Cross-Platform Support", slug: "cross-platform" },
    ],
    seo: {
      title: "Memos for Families - Private Family Feed & Shared Notes",
      description:
        "See how families and friend groups share updates, photos, and notes on their own Memos instance, visible only to signed-in members, without relying on public platforms.",
      keywords: [
        "private family social app",
        "family notes app",
        "shared family journal",
        "private social feed",
        "friends group notes",
        "family memory archive",
        "self-hosted family app",
        "private updates app",
      ],
    },
  },
  teams: {
    title: "Team Documentation & Collaboration",
    subtitle: "Shared notes, meeting records, and internal updates",
    description:
      "Small teams use Memos for short shared notes, meeting records, and internal updates. It fits teams that want a simple, self-hosted place to post and search them.",
    icon: UsersIcon,
    workflows: [
      "Share meeting agendas, notes, and action items",
      "Post short how-to notes and process reminders",
      "Collect onboarding links and tips in a tagged feed",
      "Maintain project status updates and sprint notes",
      "Document decisions, discussions, and team retrospectives",
      "Link to specs and design documents with a short summary",
    ],
    whyMemos: [
      "No per-user licensing",
      "SQLite by default, with PostgreSQL or MySQL for larger setups",
      "Set your instance name and logo",
      "REST API and webhooks connect Memos to team tools",
      "Self-hosting keeps team notes inside infrastructure you manage",
    ],
    features: [
      { name: "Database Support", slug: "database-support" },
      { name: "Zero Subscription Fees", slug: "no-fees" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Memos for Teams - Shared Notes & Internal Updates",
      description:
        "See how small teams use Memos for shared notes, meeting records, and internal updates. Self-hosted, open source, and simple to run on your own infrastructure.",
      keywords: [
        "team wiki software",
        "collaborative note-taking tool",
        "internal documentation tool",
        "meeting notes software",
        "team notes",
        "shared notes",
        "company wiki",
        "team documentation",
        "self-hosted team wiki",
      ],
    },
  },
} as const satisfies Record<(typeof USE_CASE_SLUGS)[number], UseCaseDefinition>;
