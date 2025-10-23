/**
 * Feature definitions and metadata for Memos
 * This serves as the single source of truth for all feature-related data
 */

export interface FeatureDefinition {
  title: string;
  description: string;
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
  "data-ownership",
  "performance",
  "react-frontend",
  "cross-platform",
  "customizable-ui",
  "api-first",
  "database-support",
  "open-source",
  "no-fees",
  "community",
  "self-hosted",
  "no-dependencies",
  "instant-save",
  "markdown-support",
  "media-integration",
] as const;

/**
 * Complete feature definitions with all metadata
 */
export const FEATURES = {
  "data-ownership": {
    title: "Complete Data Ownership",
    description:
      "Take full control of your notes and data with Memos' privacy-first architecture that ensures your information never leaves your control.",
    hero: {
      title: "Your Data, Your Rules",
      subtitle: "Complete ownership and control over every note, file, and piece of information in your Memos instance.",
    },
    benefits: [
      "All data stored locally in your chosen database",
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
  performance: {
    title: "High-Performance Backend",
    description: "Built with Go for optimal resource utilization, lightning-fast response times, and minimal server requirements.",
    hero: {
      title: "Built for Speed",
      subtitle: "Go-powered backend delivers exceptional performance with minimal resource consumption.",
    },
    benefits: [
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
  "react-frontend": {
    title: "Modern React Frontend",
    description: "Responsive, intuitive user interface built with modern React, TypeScript, and cutting-edge web technologies with dark mode support.",
    hero: {
      title: "Beautiful & Responsive",
      subtitle: "Modern React interface with dark mode that works seamlessly across all devices and screen sizes.",
    },
    benefits: [
      "Responsive design optimized for mobile and desktop",
      "Dark mode support for comfortable viewing",
      "TypeScript for enhanced developer experience and reliability",
      "Fast page loads with optimized bundle splitting",
      "Real-time updates and synchronization without page refreshes",
      "Accessible design following WCAG guidelines",
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
  "cross-platform": {
    title: "Cross-Platform Support",
    description: "Deploy anywhere with native support for Linux, macOS, Windows, Docker, and Kubernetes environments.",
    hero: {
      title: "Deploy Anywhere",
      subtitle: "Universal compatibility across all major platforms and deployment methods.",
    },
    benefits: [
      "Native binaries for Linux, macOS, and Windows",
      "Docker images for containerized deployments",
      "Kubernetes manifests for orchestrated environments",
      "ARM and x86 architecture support",
      "Multiple installation methods to suit any workflow",
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
      "Go cross-compilation for all platforms",
      "Multi-architecture Docker images",
      "Systemd service files included",
      "Automated CI/CD builds",
    ],
  },
  "customizable-ui": {
    title: "Configurable Interface",
    description: "Customize your Memos instance with personalized branding, themes, and UI elements to match your style.",
    hero: {
      title: "Make It Yours",
      subtitle: "Customize server name, icon, description, and UI elements to create a personalized experience.",
    },
    benefits: [
      "Custom server name and description",
      "Personalized favicon and branding",
      "Configurable theme colors and styling",
      "Custom CSS injection for advanced styling",
      "Multi-language interface support",
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
      "Environment variable configuration",
      "CSS custom properties support",
      "Configurable metadata and titles",
      "Icon and logo replacement",
    ],
  },
  "api-first": {
    title: "API-First Design",
    description: "Comprehensive RESTful and gRPC APIs enable seamless integrations, custom applications, and automation workflows.",
    hero: {
      title: "Built for Integration",
      subtitle: "Comprehensive REST and gRPC APIs open unlimited possibilities for custom integrations and workflows.",
    },
    benefits: [
      "Complete RESTful API covering all functionality",
      "gRPC API for high-performance integrations",
      "OpenAPI specification for easy integration",
      "Authentication and authorization controls",
      "Webhook support for real-time notifications",
      "Bulk operations for efficient data management",
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
    techDetails: ["RESTful and gRPC API support", "OpenAPI 3.0 specification", "JWT-based authentication", "Rate limiting and throttling", "Comprehensive error handling"],
  },
  "database-support": {
    title: "Multi-Database Support",
    description: "Choose from SQLite, PostgreSQL, or MySQL databases to match your infrastructure and performance needs.",
    hero: {
      title: "Your Database, Your Choice",
      subtitle: "Flexible database support allows you to choose the best fit for your infrastructure and requirements.",
    },
    benefits: [
      "SQLite for simple single-user deployments",
      "PostgreSQL for enterprise-grade reliability",
      "MySQL for existing infrastructure integration",
      "Automatic database migrations and schema updates",
      "Connection pooling and optimization for each database type",
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
  "open-source": {
    title: "Open Source License",
    description: "MIT licensed with full source code transparency, permissive usage terms, and community-driven development.",
    hero: {
      title: "Truly Open Source",
      subtitle: "MIT license ensures complete freedom to use, modify, and distribute Memos for any purpose.",
    },
    benefits: [
      "MIT license with no usage restrictions",
      "Full source code availability on GitHub",
      "Community-driven development and contributions",
      "No vendor lock-in or licensing fees",
      "Freedom to modify and customize for your needs",
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
    title: "Zero Subscription Fees",
    description: "Use all features forever with no usage limits, premium tiers, or hidden costs - completely free and open.",
    hero: {
      title: "Free Forever",
      subtitle: "All features available at no cost with no usage limits or premium restrictions.",
    },
    benefits: [
      "All features included with no premium tiers",
      "No user limits or storage restrictions",
      "No time-limited trials or subscriptions",
      "No hidden costs or surprise fees",
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
  community: {
    title: "Community-Driven Development",
    description: "Transparent development process with active community contributions, feedback, and collaborative improvement.",
    hero: {
      title: "Built Together",
      subtitle: "Active community of developers and users collaborating to make Memos better for everyone.",
    },
    benefits: [
      "Transparent roadmap and development process",
      "Active GitHub community with 40,000+ stars",
      "Regular community feedback integration",
      "Multiple communication channels for support",
      "Collaborative feature development and testing",
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
  "self-hosted": {
    title: "Self-Hosted Architecture",
    description: "Deploy Memos on your own infrastructure with complete control over access, security, and performance.",
    hero: {
      title: "Your Server, Your Control",
      subtitle: "Deploy anywhere from a Raspberry Pi to enterprise Kubernetes clusters with full infrastructure control.",
    },
    benefits: [
      "Deploy on any server, VPS, or cloud provider of your choice",
      "Full control over user access and authentication policies",
      "Customize security measures to meet your exact requirements",
      "Scale resources based on your specific usage patterns",
      "Integrate with existing corporate infrastructure and SSO systems",
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
  "no-dependencies": {
    title: "No External Dependencies",
    description: "Work completely offline with zero external API calls, third-party services, or cloud dependencies.",
    hero: {
      title: "Truly Independent",
      subtitle: "No internet connection required after installation - your notes work anywhere, anytime.",
    },
    benefits: [
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
        description: "Take your notes anywhere without worrying about internet connectivity or speed.",
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
  "instant-save": {
    title: "Instant Save",
    description: "Never lose a thought with automatic persistence and streamlined input that saves as you type.",
    hero: {
      title: "Capture Every Thought",
      subtitle: "Lightning-fast input with automatic saving ensures you never lose important ideas or information.",
    },
    benefits: [
      "Automatic saving as you type with no manual save button needed",
      "Draft recovery in case of browser crashes or network issues",
      "Instant synchronization across multiple browser tabs",
      "Real-time preview of Markdown formatting",
      "Optimistic UI updates for immediate feedback",
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
      "WebSocket-based real-time synchronization",
      "Debounced auto-save with configurable intervals",
      "Client-side draft storage for offline resilience",
      "Optimistic concurrency control",
    ],
  },
  "markdown-support": {
    title: "Rich Markdown Support",
    description: "Full GitHub Flavored Markdown with syntax highlighting, tables, and advanced formatting options.",
    hero: {
      title: "Write with Power",
      subtitle: "Express your ideas with full Markdown support including syntax highlighting, tables, and rich formatting.",
    },
    benefits: [
      "Complete GitHub Flavored Markdown (GFM) compatibility",
      "Syntax highlighting for 100+ programming languages",
      "Tables, task lists, and advanced formatting options",
      "Live preview with side-by-side editing",
      "LaTeX math expression support",
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
      "KaTeX for mathematical expressions",
      "Custom plugins for enhanced functionality",
    ],
  },
  "media-integration": {
    title: "Media Integration",
    description: "Native support for images, files, and multimedia content with drag-and-drop functionality.",
    hero: {
      title: "Rich Media Support",
      subtitle: "Seamlessly integrate images, documents, and multimedia content into your notes with drag-and-drop simplicity.",
    },
    benefits: [
      "Drag-and-drop file uploads with progress indicators",
      "Image resizing and optimization for web display",
      "Support for documents, images, videos, and audio files",
      "Automatic link preview generation for URLs",
      "Embedded content from popular platforms",
    ],
    useCases: [
      {
        title: "Visual Documentation",
        description: "Create rich documentation with screenshots, diagrams, and visual explanations.",
      },
      {
        title: "Project Archives",
        description: "Store project files, assets, and related documents alongside your notes.",
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
