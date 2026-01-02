/**
 * Feature definitions and metadata for Memos
 * This serves as the single source of truth for all feature-related data
 */

import type { LucideIcon } from "lucide-react";
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

export interface FeatureDefinition {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  border: string;
  wip?: boolean;
  hero: {
    title: string;
    subtitle: string;
  };
  benefits: string[];
  useCases: Array<{
    title: string;
    description: string;
  }>;
  techDetails: string[];
}

export type FeatureSlug = keyof typeof FEATURES;

/**
 * All available feature slugs - used for static generation and routing
 */
export const FEATURE_SLUGS = [
  "self-hosted",
  "data-ownership",
  "open-source",
  "no-fees",
  "no-dependencies",
  "instant-save",
  "quick-capture",
  "markdown-support",
  "media-integration",
  "universal-search",
  "tags",
  "timeline-view",
  "public-sharing",
  "microblog",
  "beautiful-design",
  "pwa-support",
  "customizable-ui",
  "cross-platform",
  "performance",
  "lightweight",
  "database-support",
  "api-first",
  "community",
  "multi-language",
  "keyboard-shortcuts",
  "import",
  "export",
] as const;

/**
 * Complete feature definitions with all metadata
 */
export const FEATURES = {
  // Self-hosted & Privacy First
  "self-hosted": {
    title: "Self-Hosted",
    description: "Deploy on your own infrastructure from Raspberry Pi to enterprise Kubernetes clusters.",
    icon: ServerIcon,
    gradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-900",
    hero: {
      title: "Your Server, Your Control",
      subtitle: "Deploy anywhere from Raspberry Pi to enterprise clusters - complete control without vendor lock-in.",
    },
    benefits: [
      "Complete data ownership - your data never leaves your infrastructure",
      "Deploy on any server, VPS, cloud provider, or on-premises hardware",
      "Full control over user access, authentication policies, and security measures",
      "Customize and scale resources based on your specific usage patterns",
      "Integrate seamlessly with existing corporate infrastructure and SSO systems",
      "No vendor lock-in or dependencies - deploy and manage on your terms",
    ],
    useCases: [
      {
        title: "Home Lab Setup",
        description: "Run Memos on your home server or NAS for personal and family use with complete privacy.",
      },
      {
        title: "Small Team Deployment",
        description: "Deploy on a small VPS or cloud instance for team collaboration without external dependencies.",
      },
      {
        title: "Enterprise Infrastructure",
        description: "Integrate with existing corporate networks, authentication systems, and compliance frameworks.",
      },
    ],
    techDetails: [
      "Docker and Docker Compose support",
      "Kubernetes deployment manifests included",
      "Binary releases for Linux, macOS, and Windows",
      "Reverse proxy and SSL termination compatible",
    ],
  },
  "data-ownership": {
    title: "Data Ownership",
    description: "Complete control over your memos with zero telemetry. All data stored locally in your chosen database.",
    icon: LockIcon,
    gradient: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
    iconBg: "bg-teal-100 dark:bg-teal-900",
    iconColor: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-900",
    hero: {
      title: "Your Data, Your Rules",
      subtitle: "Complete ownership and control with zero telemetry - your data never leaves your control.",
    },
    benefits: [
      "All data stored locally in your chosen database",
      "Zero telemetry - no tracking, ads, or analytics collection",
      "Zero external cloud dependencies or third-party services",
      "Full GDPR and privacy compliance by design",
      "Complete audit trail of all data access and modifications",
      "Export your data anytime in standard formats",
    ],
    useCases: [
      {
        title: "Personal Knowledge Management",
        description: "Keep sensitive thoughts, ideas, and personal information completely private and under your control.",
      },
      {
        title: "Corporate Documentation",
        description: "Store confidential business information without worrying about cloud provider access or data breaches.",
      },
      {
        title: "Compliance Requirements",
        description: "Meet strict regulatory requirements by ensuring data never leaves your infrastructure.",
      },
    ],
    techDetails: [
      "SQLite, PostgreSQL, or MySQL storage options",
      "Local file system for media attachments",
      "No telemetry or analytics collection",
      "Open-source codebase for full transparency",
    ],
  },
  // Open Source & Freedom
  "open-source": {
    title: "Open Source",
    description: "MIT licensed with full source code transparency - freedom to use, modify, and distribute.",
    icon: GitBranchIcon,
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900",
    hero: {
      title: "Truly Open Source",
      subtitle: "MIT license ensures complete freedom to use, modify, and distribute - transparency you can trust.",
    },
    benefits: [
      "MIT license with no usage restrictions or limitations",
      "Full source code availability and transparency on GitHub",
      "Community-driven development with active contributors",
      "No vendor lock-in, licensing fees, or hidden costs",
      "Freedom to fork, modify, and customize for your specific needs",
      "Complete audit trail with full version history and commit logs",
    ],
    useCases: [
      {
        title: "Commercial Use",
        description: "Deploy in commercial environments without licensing restrictions.",
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
      "Contribution guidelines and code of conduct",
    ],
  },
  "no-fees": {
    title: "Always Free",
    description: "All features free forever - no premium tiers, usage limits, or hidden costs. Ever.",
    icon: DollarSignIcon,
    gradient: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30",
    iconBg: "bg-lime-100 dark:bg-lime-900",
    iconColor: "text-lime-600 dark:text-lime-400",
    border: "border-lime-100 dark:border-lime-900",
    hero: {
      title: "Free Forever",
      subtitle: "No subscription fees, no tracking, no ads - all features available at no cost with unlimited usage.",
    },
    benefits: [
      "No subscription fees - completely free forever",
      "No tracking or ads - privacy-first approach",
      "All features included with no premium tiers",
      "No user limits or storage restrictions",
      "No time-limited trials or hidden costs",
      "Community support at no charge",
    ],
    useCases: [
      {
        title: "Personal Projects",
        description: "Use for personal note-taking and knowledge management without any costs.",
      },
      {
        title: "Small Businesses",
        description: "Deploy for teams without worrying about per-user licensing fees.",
      },
      {
        title: "Educational Institutions",
        description: "Provide to students and faculty without budget constraints.",
      },
    ],
    techDetails: [
      "No licensing server or activation required",
      "No feature flags or premium unlocks",
      "Open source ensures perpetual availability",
      "Community-driven support model",
    ],
  },
  "no-dependencies": {
    title: "No Dependencies",
    description: "Works with zero external dependencies or cloud connections required. Fully self-contained.",
    icon: CloudOffIcon,
    gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900",
    hero: {
      title: "Truly Independent",
      subtitle: "Zero telemetry and no internet connection required after installation - your memos work anywhere, anytime.",
    },
    benefits: [
      "Zero telemetry - no tracking, analytics, or data collection",
      "Zero external API calls or third-party service dependencies",
      "Works completely offline after initial installation",
      "No CDN dependencies for fonts, icons, or other assets",
      "Self-contained binary with all dependencies included",
      "No phone-home or update check mechanisms",
    ],
    useCases: [
      {
        title: "Air-Gapped Environments",
        description: "Perfect for secure environments where internet access is restricted or prohibited.",
      },
      {
        title: "Remote Work Locations",
        description: "Take your memos anywhere without worrying about internet connectivity or speed.",
      },
      {
        title: "Privacy-Critical Applications",
        description: "Ensure absolutely no data leakage to external services or analytics platforms.",
      },
    ],
    techDetails: [
      "Single binary deployment with no external dependencies",
      "Embedded web assets and fonts",
      "Local SQLite database by default",
      "Self-contained Docker image",
    ],
  },
  // Core Memo Features
  "instant-save": {
    title: "Instant Save",
    description: "Automatic persistence as you type - never lose a memo with streamlined plaintext input.",
    icon: SaveIcon,
    gradient: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-900",
    hero: {
      title: "Capture Every Thought",
      subtitle: "Automatic saving as you type ensures zero data loss - never worry about manual saves again.",
    },
    benefits: [
      "Automatic saving as you type with no manual save button required",
      "Draft recovery and persistence in case of browser crashes or network issues",
      "Instant synchronization across multiple browser tabs and windows",
      "Real-time preview of Markdown formatting as you write",
      "Optimistic UI updates for immediate visual feedback",
      "Conflict resolution for concurrent edits across devices",
    ],
    useCases: [
      {
        title: "Meeting Notes",
        description: "Capture meeting discussions and decisions in real-time without interruption.",
      },
      {
        title: "Brainstorming Sessions",
        description: "Record rapid-fire ideas and thoughts without worrying about manual saving.",
      },
      {
        title: "Research Documentation",
        description: "Document findings and insights as you discover them with automatic persistence.",
      },
    ],
    techDetails: [
      "Debounced auto-save mechanism to reduce server load",
      "Optimistic UI updates for immediate feedback",
      "HTTP-based persistence to backend database",
      "Client-side state management for draft handling",
    ],
  },
  "quick-capture": {
    title: "Quick Capture",
    description: "Fast memo creation from anywhere - capture thoughts instantly without interrupting your flow.",
    icon: PlusCircleIcon,
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900",
    hero: {
      title: "Capture Thoughts Instantly",
      subtitle: "Quick memo creation from anywhere - never let a great idea slip away.",
    },
    benefits: [
      "Create memos from anywhere with keyboard shortcut",
      "Minimal interface for distraction-free quick capture",
      "Auto-save ensures no thought is lost",
      "Browser bookmarklet for instant capture from any page",
      "Mobile-optimized quick add interface",
      "Timestamped entries for easy recall",
    ],
    useCases: [
      {
        title: "Fleeting Ideas",
        description: "Capture sudden inspirations and thoughts before they disappear.",
      },
      {
        title: "Quick Reminders",
        description: "Jot down tasks and reminders in seconds without switching apps.",
      },
      {
        title: "Web Clipping",
        description: "Save interesting content from the web with context and source.",
      },
    ],
    techDetails: [
      "Global keyboard shortcut support",
      "Bookmarklet for browser integration",
      "Mobile share sheet integration",
      "Minimal UI for fast interaction",
    ],
  },
  "markdown-support": {
    title: "Rich Markdown",
    description: "Full Markdown support with syntax highlighting, tables, and LaTeX math expressions for rich memo content.",
    icon: FileTextIcon,
    gradient: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900",
    hero: {
      title: "Write with Power",
      subtitle: "Full Markdown support with plain text storage ensures portability and future-proof content.",
    },
    benefits: [
      "Plain text storage for maximum portability and future-proofing",
      "Complete GitHub Flavored Markdown (GFM) compatibility",
      "Syntax highlighting for 100+ programming languages",
      "Tables, task lists, and advanced formatting options",
      "Mermaid diagrams for flowcharts, sequence diagrams, and visualizations",
      "LaTeX math expression support for equations and formulas",
    ],
    useCases: [
      {
        title: "Technical Documentation",
        description: "Create comprehensive technical docs with code blocks, diagrams, and structured content.",
      },
      {
        title: "Academic Writing",
        description: "Write research notes and papers with proper formatting, citations, and mathematical expressions.",
      },
      {
        title: "Project Planning",
        description: "Organize project requirements, tasks, and progress with structured Markdown formatting.",
      },
    ],
    techDetails: [
      "Based on unified/remark Markdown processor",
      "Prism.js for syntax highlighting",
      "Mermaid.js for diagram rendering",
      "KaTeX for mathematical expressions",
    ],
  },
  "media-integration": {
    title: "Media Support",
    description: "Drag-and-drop support for images, videos, audio files, and document attachments.",
    icon: ImageIcon,
    gradient: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
    iconBg: "bg-pink-100 dark:bg-pink-900",
    iconColor: "text-pink-600 dark:text-pink-400",
    border: "border-pink-100 dark:border-pink-900",
    hero: {
      title: "Rich Media Support",
      subtitle: "Seamlessly integrate images, videos, and documents with simple drag-and-drop functionality.",
    },
    benefits: [
      "Drag-and-drop file uploads with real-time progress indicators",
      "Automatic image resizing and optimization for fast web display",
      "Support for documents, images, videos, audio files, and PDFs",
      "Automatic link preview generation with thumbnails for URLs",
      "Embedded content support from popular platforms like YouTube and Twitter",
      "Inline media display with lightbox and gallery views",
    ],
    useCases: [
      {
        title: "Visual Documentation",
        description: "Create rich documentation with screenshots, diagrams, and visual explanations.",
      },
      {
        title: "Project Archives",
        description: "Store project files, assets, and related documents alongside your memos.",
      },
      {
        title: "Learning Resources",
        description: "Collect and organize educational content including videos, images, and reference materials.",
      },
    ],
    techDetails: [
      "Configurable file size limits and type restrictions",
      "Image processing and thumbnail generation",
      "Local file storage with organized directory structure",
      "MIME type validation and security scanning",
    ],
  },
  "universal-search": {
    title: "Universal Search",
    description: "Find any memo instantly with powerful full-text search across all your memos and content.",
    icon: SearchIcon,
    gradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30",
    iconBg: "bg-cyan-100 dark:bg-cyan-900",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900",
    hero: {
      title: "Find Anything Instantly",
      subtitle: "Powerful full-text search helps you find any note in milliseconds across your entire collection.",
    },
    benefits: [
      "Instant full-text search across all notes and content",
      "Search within tags, content, and metadata",
      "Fuzzy matching to find notes even with typos",
      "Advanced filters and search operators",
      "Real-time search results as you type",
      "Search history and saved searches",
    ],
    useCases: [
      {
        title: "Knowledge Retrieval",
        description: "Quickly find past notes and information when you need them.",
      },
      {
        title: "Research Organization",
        description: "Search across extensive research notes to find relevant information.",
      },
      {
        title: "Team Collaboration",
        description: "Help team members find shared knowledge and documentation.",
      },
    ],
    techDetails: [
      "Database full-text search capabilities",
      "Optimized indexing for fast queries",
      "Case-insensitive and accent-insensitive search",
      "Search result relevance ranking",
    ],
  },
  tags: {
    title: "Tags",
    description: "Organize your memos with flexible tagging system for quick categorization and filtering.",
    icon: TagIcon,
    gradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    iconBg: "bg-amber-100 dark:bg-amber-900",
    iconColor: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900",
    hero: {
      title: "Organize with Tags",
      subtitle: "Flexible tagging system makes it easy to categorize and filter your memos for quick access.",
    },
    benefits: [
      "Unlimited tags per memo for flexible organization",
      "Auto-complete suggestions based on existing tags",
      "Tag-based filtering and navigation",
      "Tag management and renaming capabilities",
      "Tag statistics and usage analytics",
      "Nested tags and hierarchical organization",
    ],
    useCases: [
      {
        title: "Project Organization",
        description: "Tag memos by project, priority, or status for easy tracking.",
      },
      {
        title: "Topic Categorization",
        description: "Organize memos by topics, themes, or categories.",
      },
      {
        title: "Workflow Management",
        description: "Use tags to manage memos through different stages or workflows.",
      },
    ],
    techDetails: [
      "Hashtag-style tagging (#tag)",
      "Database-backed tag index",
      "Tag autocomplete and suggestions",
      "Tag cloud visualization",
    ],
  },
  "timeline-view": {
    title: "Timeline View",
    description: "Chronological feed of all your memos - browse memories and thoughts in time order.",
    icon: ClockIcon,
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900",
    hero: {
      title: "Your Personal Timeline",
      subtitle: "Browse memos chronologically - see your thoughts and memories unfold over time.",
    },
    benefits: [
      "Chronological feed showing all memos in time order",
      "Daily, weekly, and monthly views for different perspectives",
      "See your activity patterns and memo-writing habits",
      "Infinite scroll for seamless browsing",
      "Jump to any date to find past memos",
      "Activity stream shows your knowledge evolution",
    ],
    useCases: [
      {
        title: "Personal Journal",
        description: "Browse your daily memos like a journal, see your thoughts over time.",
      },
      {
        title: "Activity Review",
        description: "Review what you were working on during any time period.",
      },
      {
        title: "Memory Lane",
        description: "Rediscover old ideas and memos from months or years ago.",
      },
    ],
    techDetails: [
      "Efficient pagination for large memo collections",
      "Date-based filtering and navigation",
      "Optimized queries for chronological display",
      "Responsive timeline UI",
    ],
  },
  "public-sharing": {
    title: "Public Sharing",
    description: "Share memos publicly with customizable links - make knowledge accessible to the world.",
    icon: Share2Icon,
    gradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    iconBg: "bg-violet-100 dark:bg-violet-900",
    iconColor: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900",
    hero: {
      title: "Share Your Knowledge",
      subtitle: "Generate shareable public links for any memo - control who sees what.",
    },
    benefits: [
      "Generate public links for any memo instantly",
      "Control visibility - keep some memos private, others public",
      "No login required for readers to view shared memos",
      "Shareable URLs that work anywhere",
      "Embed memos on external websites",
      "Share your knowledge base with the world",
    ],
    useCases: [
      {
        title: "Knowledge Sharing",
        description: "Share tutorials, guides, and documentation with colleagues or the public.",
      },
      {
        title: "Portfolio & Blog",
        description: "Use public notes as a simple blog or portfolio of your work.",
      },
      {
        title: "Team Collaboration",
        description: "Share meeting notes and decisions with team members via simple links.",
      },
    ],
    techDetails: [
      "Public/private visibility toggle per note",
      "Shareable URL generation",
      "SEO-friendly public note pages",
      "Embed support via iframes",
    ],
  },
  microblog: {
    title: "Microblog",
    description: "Turn your memos into a personal microblog - share thoughts, ideas, and updates with the world.",
    icon: MessageCircleIcon,
    gradient: "from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30",
    iconBg: "bg-rose-100 dark:bg-rose-900",
    iconColor: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900",
    hero: {
      title: "Your Personal Microblog",
      subtitle: "Share quick thoughts, updates, and ideas with the world - a self-hosted alternative to social media.",
    },
    benefits: [
      "Publish short-form content instantly with minimal friction",
      "Own your microblog completely - no algorithms, no ads, no tracking",
      "Chronological timeline perfect for status updates and daily thoughts",
      "Rich media support for images, links, and formatted content",
      "RSS feed generation for followers to subscribe",
      "Custom domain support for your personal brand",
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
        description: "Cultivate a public space for your ideas to grow and evolve over time.",
      },
    ],
    techDetails: [
      "Public memo visibility with granular privacy controls",
      "Built-in RSS feed generation for all public memos",
      "SEO-optimized public memo pages",
      "Social sharing metadata with OpenGraph support",
    ],
  },
  // User Experience
  "beautiful-design": {
    title: "Beautiful Design",
    description: "Modern React and TypeScript interface with dark mode and responsive design for all devices.",
    icon: LayersIcon,
    gradient: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30",
    iconBg: "bg-sky-100 dark:bg-sky-900",
    iconColor: "text-sky-600 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-900",
    hero: {
      title: "Beautiful & Responsive",
      subtitle: "Modern React interface with dark mode support - clean design that works seamlessly across all devices.",
    },
    benefits: [
      "Clean, minimal design focused on simplicity and usability",
      "Responsive design optimized for both mobile and desktop experiences",
      "Dark mode support with system preference detection for comfortable viewing",
      "TypeScript and React 18 for enhanced reliability and developer experience",
      "Fast page loads with optimized bundle splitting and lazy loading",
      "Real-time updates without page refreshes and accessible WCAG-compliant design",
    ],
    useCases: [
      {
        title: "Mobile Note-Taking",
        description: "Capture thoughts on the go with a mobile-optimized interface.",
      },
      {
        title: "Desktop Productivity",
        description: "Full-featured desktop experience with keyboard shortcuts and advanced features.",
      },
      {
        title: "Cross-Device Sync",
        description: "Real-time synchronization across phones, tablets, and computers.",
      },
    ],
    techDetails: [
      "React 18 with concurrent features",
      "TypeScript for type safety",
      "Tailwind CSS for consistent styling",
      "Dark mode with system preference detection",
      "PWA support for offline access",
    ],
  },
  "pwa-support": {
    title: "Progressive Web App",
    description: "Install as a native app on any device - works offline with full functionality.",
    icon: MonitorSmartphoneIcon,
    gradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30",
    iconBg: "bg-cyan-100 dark:bg-cyan-900",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900",
    hero: {
      title: "Install Like a Native App",
      subtitle: "Progressive Web App technology delivers native-like experience on any device.",
    },
    benefits: [
      "Install on desktop and mobile like a native app",
      "Works fully offline after initial load",
      "Native-like experience with app icon and standalone window",
      "Automatic updates without app store approval",
      "Push notifications for important updates",
      "Reduced data usage with intelligent caching",
    ],
    useCases: [
      {
        title: "Offline Note-Taking",
        description: "Take notes without internet connection - syncs when back online.",
      },
      {
        title: "App-Like Experience",
        description: "Use Memos like a native desktop or mobile app with full features.",
      },
      {
        title: "Low Bandwidth",
        description: "Work efficiently even on slow or unreliable connections.",
      },
    ],
    techDetails: [
      "Service Worker for offline functionality",
      "Web App Manifest for installability",
      "IndexedDB for local data storage",
      "Background sync for offline changes",
    ],
  },
  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    description: "Boost productivity with comprehensive keyboard shortcuts for power users and fast navigation.",
    icon: KeyboardIcon,
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900",
    wip: true,
    hero: {
      title: "Work at Speed",
      subtitle: "Comprehensive keyboard shortcuts let you navigate and take notes without reaching for the mouse.",
    },
    benefits: [
      "Extensive keyboard shortcuts for all common actions",
      "Quick note creation without mouse interaction",
      "Fast navigation between notes and sections",
      "Markdown formatting shortcuts",
      "Search activation with keyboard hotkey",
      "Customizable shortcut preferences",
    ],
    useCases: [
      {
        title: "Power User Workflow",
        description: "Navigate and create memos at lightning speed without using the mouse.",
      },
      {
        title: "Accessibility",
        description: "Keyboard-first navigation for users who prefer or require keyboard access.",
      },
      {
        title: "Efficiency Focus",
        description: "Maintain flow state by keeping hands on the keyboard.",
      },
    ],
    techDetails: [
      "Global keyboard event handlers",
      "Vim-style navigation support",
      "Customizable key bindings",
      "Shortcut reference panel",
    ],
  },
  "customizable-ui": {
    title: "Customizable",
    description: "Custom branding, themes, colors, and UI elements to create your perfect note-taking environment.",
    icon: PaletteIcon,
    gradient: "from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-100 dark:border-fuchsia-900",
    hero: {
      title: "Make It Yours",
      subtitle: "Personalize branding, themes, and UI elements to create a unique experience tailored to your identity.",
    },
    benefits: [
      "Custom server name, description, and branding elements",
      "Personalized favicon and logo for brand identity",
      "Configurable theme colors and styling options",
      "Custom CSS injection for advanced styling and tweaks",
      "Multi-language interface support for global teams",
      "Flexible layout options and visibility controls",
    ],
    useCases: [
      {
        title: "Corporate Branding",
        description: "Match your company's visual identity and branding guidelines.",
      },
      {
        title: "Personal Touch",
        description: "Create a unique, personalized note-taking environment.",
      },
      {
        title: "Team Identification",
        description: "Differentiate between multiple Memos instances with custom branding.",
      },
    ],
    techDetails: [
      "Environment variable configuration for all settings",
      "CSS custom properties and injection support",
      "Configurable metadata, titles, and OpenGraph tags",
      "Custom icon and logo replacement via assets folder",
      "i18n support with multiple language packs",
    ],
  },
  "cross-platform": {
    title: "Cross-Platform",
    description: "Linux, macOS, Windows, Docker, and Kubernetes - deploy anywhere with universal compatibility.",
    icon: ServerIcon,
    gradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30",
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900",
    hero: {
      title: "Deploy Anywhere",
      subtitle: "From Raspberry Pi to enterprise Kubernetes clusters - universal compatibility for any deployment scenario.",
    },
    benefits: [
      "Docker containerization with multi-architecture support (recommended deployment method)",
      "Pre-built native binaries for Linux, macOS, and Windows",
      "Kubernetes support with official Helm charts for orchestrated environments",
      "ARM64 and x86-64 architecture support for diverse hardware",
      "Multiple installation methods to suit any workflow or preference",
      "Single binary deployment with zero external dependencies",
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
      "Go 1.21+ cross-compilation for Linux, macOS, Windows",
      "Multi-architecture Docker images (linux/amd64, linux/arm64)",
      "Official Helm charts for Kubernetes deployments",
      "Systemd service files and installation scripts included",
      "GitHub Actions automated builds for all platforms",
    ],
  },
  // Technical Excellence
  performance: {
    title: "Super-fast",
    description: "Go-powered backend with instant loading and minimal resource usage for peak performance.",
    icon: ZapIcon,
    gradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30",
    iconBg: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-100 dark:border-yellow-900",
    hero: {
      title: "Built for Speed",
      subtitle: "Go-powered backend delivers instant loading and exceptional performance with no cloud latency dependency.",
    },
    benefits: [
      "Instant loading with no latency dependency on cloud services",
      "Lightning-fast response times under high load",
      "Minimal memory footprint and CPU usage",
      "Efficient concurrent request handling",
      "Optimized database queries and caching",
      "Sub-second search across thousands of notes",
    ],
    useCases: [
      {
        title: "Large Team Deployments",
        description: "Support hundreds of concurrent users with minimal server resources.",
      },
      {
        title: "Resource-Constrained Environments",
        description: "Run efficiently on VPS, Raspberry Pi, or low-power hardware.",
      },
      {
        title: "High-Traffic Scenarios",
        description: "Handle peak usage periods without performance degradation.",
      },
    ],
    techDetails: [
      "Go 1.21+ with optimized goroutines",
      "Connection pooling and query optimization",
      "In-memory caching layer",
      "Efficient JSON serialization",
    ],
  },
  lightweight: {
    title: "Lightweight & Efficient",
    description: "Minimal footprint - runs smoothly on low-powered devices with minimal resource usage.",
    icon: FeatherIcon,
    gradient: "from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30",
    iconBg: "bg-sky-100 dark:bg-sky-900",
    iconColor: "text-sky-600 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-900",
    hero: {
      title: "Light as a Feather",
      subtitle: "Minimal resource usage means Memos runs smoothly even on low-powered hardware.",
    },
    benefits: [
      "Small binary size - under 50MB total",
      "Low memory footprint - runs on 256MB RAM",
      "Minimal CPU usage even under load",
      "Fast startup time - ready in seconds",
      "Efficient database usage with minimal disk space",
      "Perfect for Raspberry Pi, old laptops, and budget VPS",
    ],
    useCases: [
      {
        title: "Raspberry Pi Hosting",
        description: "Run a full-featured note server on a Raspberry Pi with room to spare.",
      },
      {
        title: "Budget VPS",
        description: "Host Memos on the smallest, cheapest VPS tiers available.",
      },
      {
        title: "Old Hardware",
        description: "Breathe new life into old computers by hosting Memos locally.",
      },
    ],
    techDetails: [
      "Compiled Go binary with minimal dependencies",
      "Efficient memory management",
      "Optimized asset delivery",
      "Lazy loading and code splitting",
    ],
  },
  "database-support": {
    title: "Multi-Database",
    description: "Choose between SQLite, PostgreSQL, or MySQL to match your infrastructure needs.",
    icon: DatabaseIcon,
    gradient: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30",
    iconBg: "bg-slate-100 dark:bg-slate-900",
    iconColor: "text-slate-600 dark:text-slate-400",
    border: "border-slate-100 dark:border-slate-900",
    hero: {
      title: "Your Database, Your Choice",
      subtitle: "Flexible support for SQLite, PostgreSQL, and MySQL - choose the best fit for your infrastructure needs.",
    },
    benefits: [
      "SQLite for simple single-user deployments with zero configuration",
      "PostgreSQL for enterprise-grade reliability and advanced features",
      "MySQL for seamless integration with existing infrastructure",
      "Automatic database migrations and schema version management",
      "Connection pooling and query optimization for each database type",
      "Easy database switching without data loss or downtime",
    ],
    useCases: [
      {
        title: "Single-User Setup",
        description: "Use SQLite for personal instances with minimal configuration.",
      },
      {
        title: "Team Collaboration",
        description: "PostgreSQL or MySQL for multi-user environments with high concurrency.",
      },
      {
        title: "Enterprise Deployment",
        description: "Integrate with existing database infrastructure and backup systems.",
      },
    ],
    techDetails: [
      "GORM for database abstraction",
      "Automated migrations and versioning",
      "Connection pooling configuration",
      "Database-specific optimizations",
    ],
  },
  "api-first": {
    title: "API & Integrations",
    description: "Full REST and gRPC APIs with unrestricted access for custom integrations and automation.",
    icon: CodeIcon,
    gradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
    iconBg: "bg-violet-100 dark:bg-violet-900",
    iconColor: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900",
    hero: {
      title: "Built for Integration",
      subtitle: "Comprehensive REST and gRPC APIs unlock unlimited possibilities for custom integrations and automation.",
    },
    benefits: [
      "Complete RESTful API covering all functionality with unrestricted access",
      "High-performance gRPC API for advanced integrations and real-time operations",
      "OpenAPI 3.0 specification for automatic client generation and easy integration",
      "JWT-based authentication with flexible authorization controls",
      "Webhook support for real-time event notifications and automation",
      "Bulk operations and batch endpoints for efficient data management",
    ],
    useCases: [
      {
        title: "Custom Applications",
        description: "Build custom frontends or mobile apps using the comprehensive API.",
      },
      {
        title: "Automation Workflows",
        description: "Integrate with automation tools like Zapier, IFTTT, or custom scripts.",
      },
      {
        title: "Data Migration",
        description: "Import and export data from other systems using the API.",
      },
    ],
    techDetails: [
      "RESTful HTTP API with JSON responses",
      "gRPC API with Protocol Buffers for high performance",
      "OpenAPI 3.0 specification with interactive documentation",
      "JWT-based authentication with refresh token support",
      "Webhook system for event-driven integrations",
    ],
  },
  // Community & Ecosystem
  community: {
    title: "Community-Driven",
    description: "Active development with 45,000+ GitHub stars, transparent roadmap, and engaged community.",
    icon: HeartIcon,
    gradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
    iconBg: "bg-rose-100 dark:bg-rose-900",
    iconColor: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900",
    hero: {
      title: "Built Together",
      subtitle: "Active community with 45,000+ GitHub stars collaborating to make Memos better every day.",
    },
    benefits: [
      "Transparent roadmap and open development process",
      "Active GitHub community with 45,000+ stars and growing",
      "Regular community feedback integration into releases",
      "Multiple communication channels including Discord and GitHub Discussions",
      "Collaborative feature development and public testing",
      "Responsive maintainers and quick issue resolution",
    ],
    useCases: [
      {
        title: "Feature Requests",
        description: "Suggest and vote on new features through community discussions.",
      },
      {
        title: "Bug Reporting",
        description: "Report issues and collaborate on fixes with the development team.",
      },
      {
        title: "Knowledge Sharing",
        description: "Learn from and share solutions with other Memos users.",
      },
    ],
    techDetails: [
      "GitHub Discussions for community interaction",
      "Discord server for real-time chat",
      "Regular release cycles with community input",
      "Contributor recognition and acknowledgment",
    ],
  },
  "multi-language": {
    title: "Multi-Language Support",
    description: "Available in multiple languages with community-contributed translations for global accessibility.",
    icon: GlobeIcon,
    gradient: "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900",
    hero: {
      title: "Speak Your Language",
      subtitle: "Multiple language support with community translations makes Memos accessible worldwide.",
    },
    benefits: [
      "Interface available in multiple languages",
      "Community-contributed translations",
      "Easy language switching in settings",
      "RTL (right-to-left) language support",
      "Localized date and time formats",
      "Contribution process for new translations",
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
        description: "Use Memos in your preferred language for better comfort.",
      },
    ],
    techDetails: [
      "i18next internationalization framework",
      "JSON-based translation files",
      "Language detection from browser settings",
      "Contribution guidelines for translators",
    ],
  },
  // Work In Progress
  import: {
    title: "Import",
    description: "Migrate from other platforms with easy import from Markdown files and popular note apps.",
    icon: UploadIcon,
    gradient: "from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30",
    iconBg: "bg-teal-100 dark:bg-teal-900",
    iconColor: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-900",
    wip: true,
    hero: {
      title: "Easy Migration",
      subtitle: "Import your existing notes from popular platforms and Markdown files with ease.",
    },
    benefits: [
      "Import from Markdown files and directories",
      "Support for popular note-taking app formats",
      "Bulk import capability for large collections",
      "Automatic tag and metadata extraction",
      "Preview before finalizing import",
      "Duplicate detection and merging",
    ],
    useCases: [
      {
        title: "Platform Migration",
        description: "Move from other note-taking apps to Memos seamlessly.",
      },
      {
        title: "Data Consolidation",
        description: "Bring together notes from multiple sources.",
      },
      {
        title: "Backup Restoration",
        description: "Restore notes from exported backups.",
      },
    ],
    techDetails: ["Markdown file parser", "Format conversion utilities", "Batch import processing", "Error handling and validation"],
  },
  export: {
    title: "Print & Export",
    description: "Export your memos to Markdown, JSON, or CSV - your data is always portable and accessible.",
    icon: DownloadIcon,
    gradient: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-900",
    wip: true,
    hero: {
      title: "Your Data, Your Way",
      subtitle: "Export notes in multiple formats to ensure your data is always portable and accessible.",
    },
    benefits: [
      "Export to Markdown for universal compatibility",
      "JSON export for programmatic access",
      "CSV export for spreadsheet analysis",
      "Bulk export of all notes or filtered selections",
      "Preserve tags, timestamps, and metadata",
      "Print-friendly formatting options",
    ],
    useCases: [
      {
        title: "Data Backup",
        description: "Create regular backups of your memos in portable formats.",
      },
      {
        title: "Platform Independence",
        description: "Ensure your memos can be used with any tool or system.",
      },
      {
        title: "Archival Storage",
        description: "Archive completed projects in standard formats.",
      },
    ],
    techDetails: [
      "Multiple export format support",
      "Streaming export for large collections",
      "Metadata preservation",
      "Print CSS for clean printing",
    ],
  },
} as const satisfies Record<(typeof FEATURE_SLUGS)[number], FeatureDefinition>;

/**
 * Get feature definition by slug
 */
export function getFeature(slug: string): FeatureDefinition | null {
  return FEATURES[slug as FeatureSlug] || null;
}

/**
 * Get all feature slugs for static generation
 */
export function getAllFeatureSlugs(): readonly string[] {
  return FEATURE_SLUGS;
}
