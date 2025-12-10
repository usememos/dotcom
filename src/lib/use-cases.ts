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
      "Developers rely on Memos to capture code snippets, debug notes, architecture decisions, and learning resources. The Markdown-first approach and instant save feature make it perfect for fast-paced development workflows.",
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
      "No titles required - perfect for quick snippet captures",
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
        "developer notes app",
        "code snippet manager",
        "technical documentation tool",
        "programming notes",
        "developer knowledge base",
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
      "Writers and content creators use Memos to draft articles, collect research, brainstorm ideas, and organize editorial calendars. The distraction-free interface and complete data ownership provide the perfect writing environment.",
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
      "Complete ownership of drafts - no platform can lock you out",
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
        "Learn how writers and content creators use Memos for article drafts, research collection, and creative ideation. Self-hosted writing tool with Markdown support and complete data ownership.",
      keywords: [
        "writing app for authors",
        "content creation tool",
        "blogging notes app",
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
      "Professionals handling sensitive information trust Memos for confidential notes, client records, and private research. Zero telemetry and complete air-gap capability ensure absolute data security and compliance.",
    icon: "ShieldCheckIcon",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    iconBg: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
    workflows: [
      "Record confidential interviews and source communications",
      "Document patient notes and healthcare observations (HIPAA-compliant setup)",
      "Maintain client case notes and legal research",
      "Store investigative research and sensitive findings",
      "Keep personal journals and private reflections secure",
      "Archive confidential business intelligence and strategy notes",
    ],
    whyMemos: [
      "Zero telemetry means absolutely no data leaves your infrastructure",
      "Air-gapped deployment for maximum security isolation",
      "Complete GDPR and regulatory compliance by design",
      "Self-hosted architecture puts you in full control",
      "No third-party services or cloud provider access",
    ],
    features: [
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "No External Dependencies", slug: "no-dependencies" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Secure Note-Taking for Privacy Professionals - HIPAA & GDPR Compliant",
      description:
        "Discover how journalists, healthcare workers, and legal professionals use Memos for confidential notes. Zero telemetry, air-gapped deployment, HIPAA and GDPR compliant self-hosted solution.",
      keywords: [
        "HIPAA compliant notes",
        "GDPR compliant note taking",
        "confidential note app",
        "journalist notes tool",
        "legal case management",
        "healthcare notes app",
        "secure patient notes",
        "privacy-first notes",
        "air-gapped notes",
        "zero telemetry note taking",
      ],
    },
  },
  "students-researchers": {
    title: "Students & Researchers",
    subtitle: "Academic notes, research compilation, and study materials",
    description:
      "Students and researchers leverage Memos for lecture notes, research organization, thesis development, and collaborative study groups. No subscription fees and unlimited storage make it ideal for academic use.",
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
      "Free forever - no student budget constraints",
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
        "Learn how students and researchers use Memos for lecture notes, thesis research, and academic collaboration. Free forever with unlimited storage, Markdown support, and no subscription fees.",
      keywords: [
        "student note taking app",
        "academic research tool",
        "thesis writing software",
        "lecture notes app",
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
    title: "Personal Knowledge Management",
    subtitle: "Daily journaling, personal wikis, and life logging",
    description:
      "PKM enthusiasts and digital gardeners use Memos to build personal wikis, maintain daily journals, and cultivate idea gardens. The lightweight, fast interface and complete control make it ideal for long-term knowledge building.",
    icon: "BookOpenIcon",
    gradient: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
    iconBg: "from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30",
    workflows: [
      "Write daily journal entries and personal reflections",
      "Build a personal wiki of interconnected knowledge",
      "Maintain reading notes and book summaries",
      "Track personal goals, habits, and life milestones",
      "Collect interesting quotes, insights, and inspiration",
      "Create a digital garden of evolving ideas and thoughts",
    ],
    whyMemos: [
      "Lightweight and fast - no bloated features or complexity",
      "Chronological timeline for natural journal flow",
      "Tag system for flexible organization and connections",
      "Complete control - your knowledge base lasts forever",
      "No vendor lock-in - export your life's work anytime",
    ],
    features: [
      { name: "No Titles Required", slug: "no-titles" },
      { name: "Data Ownership", slug: "data-ownership" },
      { name: "Performance", slug: "performance" },
    ],
    seo: {
      title: "Memos for Personal Knowledge Management - Digital Garden & Second Brain",
      description:
        "Learn how PKM enthusiasts use Memos for personal wikis, daily journaling, and digital gardens. Lightweight, fast, and perfect for building your second brain with complete data ownership.",
      keywords: [
        "personal knowledge management",
        "PKM software",
        "digital garden tool",
        "second brain app",
        "personal wiki software",
        "daily journaling app",
        "zettelkasten method",
        "life logging tool",
        "knowledge base personal",
        "self-hosted journal",
      ],
    },
  },
  "hobbyists-makers": {
    title: "Hobbyists & Makers",
    subtitle: "Project logs, ideas collection, and creative documentation",
    description:
      "Makers, DIY enthusiasts, and hobbyists use Memos to document their projects, collect inspiration, track materials and tools, and maintain build logs. The flexible format and media support make it perfect for creative documentation.",
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
      "Chronological logs perfect for tracking project evolution",
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
        "maker notes app",
        "DIY knowledge base",
      ],
    },
  },
  "self-hosting": {
    title: "Homelab & Self-Hosting Community",
    subtitle: "Server documentation, configuration notes, and infrastructure logs",
    description:
      "Self-hosting enthusiasts and homelab operators use Memos to document server configurations, troubleshooting procedures, and infrastructure changes. Lightweight deployment on Raspberry Pi and minimal resource requirements make it perfect for home servers.",
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
      "No external dependencies - works completely offline",
    ],
    features: [
      { name: "Cross-Platform Support", slug: "cross-platform" },
      { name: "Performance", slug: "performance" },
      { name: "No External Dependencies", slug: "no-dependencies" },
    ],
    seo: {
      title: "Memos for Homelab & Self-Hosting - Server Documentation & Infrastructure Notes",
      description:
        "Discover how self-hosting enthusiasts use Memos for homelab documentation, server configurations, and infrastructure logs. Lightweight, runs on Raspberry Pi, perfect for home servers.",
      keywords: [
        "homelab documentation",
        "self-hosting notes",
        "server configuration tool",
        "infrastructure documentation",
        "raspberry pi notes app",
        "sysadmin notes",
        "network documentation",
        "IT runbook software",
        "homelab wiki",
        "self-hosted documentation",
      ],
    },
  },
  teams: {
    title: "Team Documentation & Collaboration",
    subtitle: "Internal wikis, meeting notes, and shared knowledge bases",
    description:
      "Teams use Memos to build internal wikis, share meeting notes, and create collaborative knowledge bases. Multi-user support with PostgreSQL/MySQL backends enables seamless team collaboration without per-user fees.",
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
      "No per-user licensing - invite unlimited team members",
      "PostgreSQL/MySQL for robust multi-user environments",
      "Custom branding for team identity and consistency",
      "API enables integration with team tools and workflows",
      "Self-hosted keeps all team knowledge internal and secure",
    ],
    features: [
      { name: "Database Support", slug: "database-support" },
      { name: "Zero Subscription Fees", slug: "no-fees" },
      { name: "Self-Hosted", slug: "self-hosted" },
    ],
    seo: {
      title: "Memos for Teams - Collaborative Wiki & Team Knowledge Base Software",
      description:
        "Learn how teams use Memos for internal wikis, meeting notes, and collaborative documentation. No per-user fees, unlimited team members, self-hosted team knowledge management solution.",
      keywords: [
        "team wiki software",
        "collaborative notes app",
        "internal documentation tool",
        "team knowledge base",
        "meeting notes software",
        "team collaboration tool",
        "shared knowledge base",
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
