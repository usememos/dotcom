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
      "Keep a code snippet, a debugging note, or a decision as it happens. Each memo keeps its date, and you can find it again by a word or a tag.",
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
      "Keep a phrase, an observation, or an idea before it goes. A few words can stay a complete memo; longer drafts can grow when you want them to.",
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
    title: "Notes for yourself",
    subtitle: "Observations, reflections, and thoughts you keep private",
    description: "You can write a thought without choosing a title or a folder. Your memos stay private until you decide to share one.",
    icon: ShieldCheckIcon,
    workflows: [
      "Keep a daily reflection",
      "Write down an observation",
      "Save a question for later",
      "Remember a conversation",
      "Keep a personal reading note",
      "Look back through a week of thoughts",
    ],
    whyMemos: [
      "New memos are private by default",
      "Each thought keeps the day you wrote it",
      "Find a memo by word, date, or tag",
      "Take a copy with you as Markdown",
    ],
    features: [
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Timeline", slug: "timeline-view" },
      { name: "Export", slug: "export" },
    ],
    seo: {
      title: "Notes for yourself",
      description: "Keep observations, reflections, and quick thoughts in your private timeline. Find them again by date, word, or tag.",
      keywords: ["private notes", "daily reflections", "personal timeline", "quick thoughts"],
    },
  },
  "students-researchers": {
    title: "Students & Researchers",
    subtitle: "Academic notes, research compilation, and study materials",
    description:
      "Keep a question from a lecture, a passage from your reading, or a finding from your research. Return to it by date, word, or tag.",
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
      "Keep a few words about your day, a thought, or something you want to remember. Your timeline keeps the date so you can return to any day.",
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
      "Keep a project observation, a photo, or the result of an experiment. Your memos give you a dated record of what you tried.",
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
      "Keep configuration notes, troubleshooting steps, and changes to your homelab. A short memo gives you a dated record to return to.",
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
      "Keep your own notes, photos, and everyday thoughts. Share a memo with family and friends when you choose; each person keeps their own memos.",
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
      "You choose where to keep your memos",
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
      description: "Keep photos, updates, and everyday notes. Share the memos you choose with family and friends.",
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
      "Keep your own working notes, meeting records, and questions. Share a memo with the people you work with when they need it.",
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
      "Your own working notes remain private until you share them",
      "Each memo keeps its date",
      "Tags and search bring earlier decisions back",
      "You can link related memos",
      "Your export keeps a copy you can take with you",
    ],
    features: [
      { name: "Database Support", slug: "database-support" },
      { name: "Zero Subscription Fees", slug: "no-fees" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Memos for Teams - Shared Notes & Internal Updates",
      description:
        "Keep your working notes and meeting records. Share each memo with the people who need it, and return to earlier decisions by date or word.",
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
