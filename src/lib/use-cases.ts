/**
 * Use case definitions and metadata for Memos
 * This serves as the single source of truth for all use case-related data
 */

export interface UseCaseDefinition {
  title: string;
  subtitle: string;
  description: string;
  icon: string; // Icon name from lucide-react
  gradient: string;
  iconBg: string;
  workflows: string[];
  whyMemos: string[];
  features: Array<{
    name: string;
    slug: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export type UseCaseSlug = keyof typeof USE_CASES;

/**
 * All available use case slugs - used for static generation and routing
 */
export const USE_CASE_SLUGS = [
  "self-hosting",
  "family",
  "developers",
  "writers",
  "personal-knowledge",
  "hobbyists-makers",
  "students-researchers",
  "privacy-professionals",
  "teams",
] as const;

/**
 * Complete use case definitions with all metadata
 */
export const USE_CASES = {
  developers: {
    title: "Software Developers & Engineers",
    subtitle: "Code snippets, technical notes, and architecture decisions",
    description:
      "Developers use Memos to capture code snippets, debug notes, architecture decisions, and learning resources. Markdown and quick capture make it a natural fit for fast-moving development work.",
    icon: "CodeIcon",
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    iconBg: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
    workflows: [
      "Store reusable code snippets and command-line recipes",
      "Document bug investigations and troubleshooting steps",
      "Record architecture decisions and technical trade-offs",
      "Collect learning resources while exploring new technologies",
      "Track API endpoints, credentials, and configuration notes",
      "Maintain personal development logs and TIL (Today I Learned) entries",
    ],
    whyMemos: [
      "Markdown syntax highlighting for 100+ programming languages",
      "Instant save captures thoughts without interrupting flow state",
      "API access enables automation and integration with dev tools",
      "Self-hosted ensures sensitive code and credentials stay private",
      "No titles required for quick snippets and notes",
    ],
    features: [
      { name: "Markdown Support", slug: "markdown-support" },
      { name: "Instant Save", slug: "instant-save" },
      { name: "API-First Design", slug: "api-first" },
    ],
    seo: {
      title: "Memos for Software Developers - Self-Hosted Code Snippet Manager & Technical Notes",
      description:
        "Discover how software developers use Memos for code snippets, bug tracking, architecture decisions, and technical documentation. Free, self-hosted with Markdown support and syntax highlighting.",
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
      "Writers and content creators use Memos to draft articles, collect research, brainstorm ideas, and keep an editorial trail. The interface stays light, and ownership stays clear.",
    icon: "PencilIcon",
    gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    iconBg: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
    workflows: [
      "Draft blog posts and articles in clean Markdown format",
      "Collect research links, quotes, and source materials",
      "Capture creative ideas and story concepts as they emerge",
      "Organize content calendars and publication schedules",
      "Store writing templates and style guidelines",
      "Maintain revision history of drafts and iterations",
    ],
    whyMemos: [
      "Distraction-free writing environment without cloud interruptions",
      "Draft ownership stays clear because the instance is yours to run",
      "Instant save prevents losing work during creative flow",
      "Markdown formatting for clean, portable content",
      "Chronological timeline helps track idea evolution",
    ],
    features: [
      { name: "Markdown Support", slug: "markdown-support" },
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "No Titles Required", slug: "no-titles" },
    ],
    seo: {
      title: "Memos for Writers & Content Creators - Distraction-Free Writing Tool",
      description:
        "Learn how writers and content creators use Memos for article drafts, research collection, and creative ideation. Self-hosted writing with Markdown support and clear data ownership.",
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
      "Professionals handling sensitive information use Memos for confidential notes, client records, and private research. Self-hosting and clear data ownership make it a strong fit when privacy matters.",
    icon: "ShieldCheckIcon",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    iconBg: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
    workflows: [
      "Record confidential interviews and source communications",
      "Document patient notes and healthcare observations in self-managed environments",
      "Maintain client case notes and legal research",
      "Store investigative research and sensitive findings",
      "Keep personal journals and private reflections secure",
      "Archive confidential business intelligence and strategy notes",
    ],
    whyMemos: [
      "Zero telemetry keeps the data path simple",
      "Can run in isolated environments you control",
      "Self-hosting supports privacy-sensitive workflows",
      "Self-hosted architecture puts you in full control",
      "No third-party services or cloud provider access",
    ],
    features: [
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "No External Dependencies", slug: "no-dependencies" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Secure Note-Taking for Privacy-Focused Professionals",
      description:
        "Discover how journalists, healthcare workers, and legal professionals use Memos for confidential notes, private research, and self-hosted documentation.",
      keywords: [
        "private note-taking tool",
        "confidential note app",
        "journalist notes tool",
        "legal case management",
        "healthcare note-taking tool",
        "secure patient notes",
        "privacy-first notes",
        "zero telemetry note taking",
      ],
    },
  },
  "students-researchers": {
    title: "Students & Researchers",
    subtitle: "Academic notes, research compilation, and study materials",
    description:
      "Students and researchers use Memos for lecture notes, reading trails, thesis work, and study groups. It works especially well for fast capture and lightweight organization.",
    icon: "GraduationCapIcon",
    gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
    iconBg: "from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30",
    workflows: [
      "Take lecture notes with rich Markdown formatting",
      "Organize research papers, citations, and literature reviews",
      "Compile thesis notes and dissertation research",
      "Create study guides and exam preparation materials",
      "Collaborate with study groups on shared instances",
      "Archive academic projects and coursework portfolios",
    ],
    whyMemos: [
      "No subscription fees",
      "Unlimited storage for extensive research materials",
      "Markdown formatting for academic writing and citations",
      "Media integration for diagrams, charts, and screenshots",
      "Full-text search across thousands of notes and papers",
    ],
    features: [
      { name: "Zero Subscription Fees", slug: "no-fees" },
      { name: "Markdown Support", slug: "markdown-support" },
      { name: "Media Integration", slug: "media-integration" },
    ],
    seo: {
      title: "Memos for Students & Researchers - Free Academic Note-Taking Software",
      description:
        "Learn how students and researchers use Memos for lecture notes, thesis research, and academic writing with Markdown support and no subscription fees.",
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
      "People use Memos for daily journals, reading notes, idea trails, and lightweight personal archives. The timeline and fast capture flow make it easy to keep coming back.",
    icon: "BookOpenIcon",
    gradient: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
    iconBg: "from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30",
    workflows: [
      "Write daily journal entries and personal reflections",
      "Keep a personal archive of ideas and references",
      "Maintain reading notes and book summaries",
      "Track personal goals, habits, and life milestones",
      "Collect interesting quotes, insights, and inspiration",
      "Let ideas build up over time in a simple timeline",
    ],
    whyMemos: [
      "Lightweight and fast - no bloated features or complexity",
      "Chronological timeline for natural journal flow",
      "Tag system for flexible organization and connections",
      "Long-term control over notes you want to keep",
      "No vendor lock-in - export your life's work anytime",
    ],
    features: [
      { name: "No Titles Required", slug: "no-titles" },
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Performance", slug: "performance" },
    ],
    seo: {
      title: "Memos for Personal Journaling & Notes",
      description:
        "Learn how people use Memos for personal notes, daily journaling, and lightweight idea trails with clear data ownership.",
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
      "Makers, DIY enthusiasts, and hobbyists use Memos to document projects, collect inspiration, track materials, and keep build logs. Media support and quick capture help keep ideas close.",
    icon: "WrenchIcon",
    gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
    iconBg: "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
    workflows: [
      "Document DIY projects with photos, notes, and progress logs",
      "Collect inspiration and ideas for future creative projects",
      "Track materials, tools, and equipment for various hobbies",
      "Maintain build logs for electronics, woodworking, or crafts",
      "Store recipes, techniques, and tutorials for quick reference",
      "Create project plans and step-by-step documentation",
    ],
    whyMemos: [
      "Media integration for photos and videos of your work",
      "Quick capture for ideas that strike during creative flow",
      "Chronological logs help track project progress over time",
      "Self-hosted keeps your creative IP and ideas private",
      "Tag system for organizing projects by type, status, or material",
    ],
    features: [
      { name: "Media Integration", slug: "media-integration" },
      { name: "Instant Save", slug: "instant-save" },
      { name: "Data Ownership", slug: "data-ownership" },
    ],
    seo: {
      title: "Memos for Makers & Hobbyists - DIY Project Logging & Creative Documentation",
      description:
        "Discover how makers, DIY enthusiasts, and hobbyists use Memos for project documentation, build logs, and creative idea collection. Self-hosted with media support and quick capture.",
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
      "Self-hosting enthusiasts and homelab operators use Memos to document server configurations, troubleshooting procedures, and infrastructure changes. Its lightweight deployment makes it easy to keep close to the rest of the stack.",
    icon: "ServerIcon",
    gradient: "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
    iconBg: "from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30",
    workflows: [
      "Document server configurations and network topology",
      "Record troubleshooting steps and solution databases",
      "Track infrastructure changes and upgrade history",
      "Store backup procedures and disaster recovery plans",
      "Maintain hardware inventory and equipment notes",
      "Create runbooks for common maintenance tasks",
    ],
    whyMemos: [
      "Deploy on Raspberry Pi or low-power hardware",
      "Minimal memory and CPU footprint",
      "Docker containerization for easy deployment",
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
        "Discover how self-hosting enthusiasts use Memos for homelab documentation, server configurations, and infrastructure logs. Lightweight, private, and easy to run on your own hardware.",
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
    subtitle: "A private social feed for your closest people",
    description:
      "Families and friend groups can use Memos as a lightweight social app for sharing updates, photos, memories, and everyday notes in a space that stays personal and under your control.",
    icon: "UsersIcon",
    gradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    iconBg: "from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30",
    workflows: [
      "Share daily updates with family members and close friends",
      "Post milestone photos, travel notes, and personal memories",
      "Keep household plans, reminders, and event notes in one place",
      "Collect recipes, traditions, and family reference notes",
      "Create a private timeline of moments you want to revisit later",
      "Use comments and reactions to stay connected without public social media",
    ],
    whyMemos: [
      "Private by default, without feeding personal updates into public platforms",
      "Simple posting flow makes it easy for non-technical family members to use",
      "Self-hosted setup keeps your shared memories under your control",
      "Markdown and attachments work well for notes, photos, and links",
      "Chronological history turns everyday updates into a lasting archive",
    ],
    features: [
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Instant Save", slug: "instant-save" },
      { name: "Cross-Platform Support", slug: "cross-platform" },
    ],
    seo: {
      title: "Memos for Families - Private Social Feed & Shared Family Notes",
      description:
        "See how families and friend groups use Memos as a private social feed for updates, memories, photos, and shared notes without relying on public platforms.",
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
      "Teams use Memos for shared notes, meeting records, internal updates, and lightweight documentation. It works best for teams that want a simple self-hosted writing space.",
    icon: "UsersIcon",
    gradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
    iconBg: "from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30",
    workflows: [
      "Share meeting agendas, notes, and action items",
      "Build internal documentation and process guides",
      "Create team onboarding materials and training resources",
      "Maintain project status updates and sprint notes",
      "Document decisions, discussions, and team retrospectives",
      "Share technical specifications and design documents",
    ],
    whyMemos: [
      "No per-user licensing",
      "PostgreSQL/MySQL support for multi-user setups",
      "Custom branding for team identity and consistency",
      "API enables integration with team tools and workflows",
      "Self-hosting keeps team notes inside infrastructure you manage",
    ],
    features: [
      { name: "Database Support", slug: "database-support" },
      { name: "Zero Subscription Fees", slug: "no-fees" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Memos for Teams - Collaborative Wiki & Team Knowledge Base Software",
      description:
        "Learn how teams use Memos for shared notes, meeting records, and internal documentation. Self-hosted, simple to run, and easy to keep under your control.",
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

/**
 * Get use case definition by slug
 */
export function getUseCase(slug: string): UseCaseDefinition | null {
  return USE_CASES[slug as UseCaseSlug] || null;
}

/**
 * Get all use case slugs for static generation
 */
export function getAllUseCaseSlugs(): readonly string[] {
  return USE_CASE_SLUGS;
}
