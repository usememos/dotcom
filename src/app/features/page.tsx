import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldIcon, 
  ZapIcon, 
  PaletteIcon, 
  DollarSignIcon,
  PenToolIcon,
  ServerIcon,
  ArrowRightIcon
} from "lucide-react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Features - Memos",
  description: "Discover all the powerful features that make Memos the perfect privacy-first, self-hosted note-taking platform for individuals and teams.",
  keywords: ["note taking features", "self-hosted", "privacy", "markdown", "knowledge management"],
  openGraph: {
    title: "Memos Features - Privacy-First Note Taking",
    description: "Explore the comprehensive feature set of Memos - from advanced privacy controls to powerful customization options.",
    url: "https://usememos.com/features",
    siteName: "Memos",
    images: [
      {
        url: "/demo-light.png",
        width: 1200,
        height: 630,
        alt: "Memos Features Overview",
      },
    ],
    type: "website",
  },
};

const featureCategories = [
  {
    title: "Privacy & Security",
    description: "Complete control over your data with enterprise-grade privacy features",
    icon: ShieldIcon,
    color: "teal",
    features: [
      {
        title: "Complete Data Ownership",
        slug: "data-ownership",
        description: "All your notes and data are stored locally in your chosen database with zero external dependencies.",
        highlight: "100% Private"
      },
      {
        title: "Self-Hosted Architecture", 
        slug: "self-hosted",
        description: "Deploy on your own infrastructure with full control over access policies and security measures.",
        highlight: "Your Server"
      },
      {
        title: "No External Dependencies",
        slug: "no-dependencies", 
        description: "Zero third-party services, cloud connections, or external API calls required.",
        highlight: "Offline Ready"
      }
    ]
  },
  {
    title: "Content Creation",
    description: "Powerful tools for capturing and organizing your thoughts",
    icon: PenToolIcon,
    color: "blue",
    features: [
      {
        title: "Instant Save",
        slug: "instant-save",
        description: "Streamlined plain text input with automatic persistence - never lose a thought again.",
        highlight: "Auto-Save"
      },
      {
        title: "Rich Markdown Support",
        slug: "markdown-support",
        description: "Full Markdown rendering with syntax highlighting, tables, and advanced formatting.",
        highlight: "GitHub Flavored"
      },
      {
        title: "Media Integration",
        slug: "media-integration", 
        description: "Native support for images, links, file attachments, and embedded content.",
        highlight: "Drag & Drop"
      }
    ]
  },
  {
    title: "Performance & Technology",
    description: "Built for speed, efficiency, and reliability",
    icon: ZapIcon,
    color: "green",
    features: [
      {
        title: "High-Performance Backend",
        slug: "performance",
        description: "Built with Go for optimal resource utilization and lightning-fast response times.",
        highlight: "Go Powered"
      },
      {
        title: "Modern React Frontend",
        slug: "react-frontend",
        description: "Responsive, intuitive user interface built with modern React and TypeScript.",
        highlight: "TypeScript"
      },
      {
        title: "Cross-Platform Support",
        slug: "cross-platform",
        description: "Linux, macOS, Windows, Docker, and Kubernetes deployment options.",
        highlight: "Universal"
      }
    ]
  },
  {
    title: "Customization",
    description: "Tailor Memos to fit your exact needs and preferences",
    icon: PaletteIcon,
    color: "purple",
    features: [
      {
        title: "Configurable Interface",
        slug: "customizable-ui",
        description: "Custom branding, themes, server names, and UI elements to match your style.",
        highlight: "Your Brand"
      },
      {
        title: "API-First Design", 
        slug: "api-first",
        description: "RESTful API for seamless third-party integrations and custom applications.",
        highlight: "REST API"
      },
      {
        title: "Multi-Database Support",
        slug: "database-support",
        description: "Compatible with SQLite, PostgreSQL, and MySQL databases.",
        highlight: "3 Databases"
      }
    ]
  },
  {
    title: "Cost-Effective",
    description: "Open source with no hidden costs or subscription fees",
    icon: DollarSignIcon,
    color: "emerald",
    features: [
      {
        title: "Open Source License",
        slug: "open-source",
        description: "MIT licensed with full source code availability and permissive usage terms.",
        highlight: "MIT License"
      },
      {
        title: "Zero Subscription Fees",
        slug: "no-fees",
        description: "No usage limits, premium tiers, or hidden costs - use all features forever.",
        highlight: "Free Forever"
      },
      {
        title: "Community-Driven",
        slug: "community",
        description: "Transparent development with active community support and contributions.",
        highlight: "40K+ Stars"
      }
    ]
  }
];

const colorVariants = {
  teal: {
    bg: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950",
    border: "border-teal-200 dark:border-teal-800",
    icon: "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400",
    text: "text-teal-900 dark:text-teal-100",
    highlight: "bg-teal-600 text-white"
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950", 
    border: "border-blue-200 dark:border-blue-800",
    icon: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    text: "text-blue-900 dark:text-blue-100",
    highlight: "bg-blue-600 text-white"
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
    border: "border-green-200 dark:border-green-800", 
    icon: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    text: "text-green-900 dark:text-green-100",
    highlight: "bg-green-600 text-white"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
    border: "border-purple-200 dark:border-purple-800",
    icon: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400", 
    text: "text-purple-900 dark:text-purple-100",
    highlight: "bg-purple-600 text-white"
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-900 dark:text-emerald-100", 
    highlight: "bg-emerald-600 text-white"
  }
};

export default function FeaturesPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 leading-tight">
              Powerful Features for
              <span className="block text-teal-600 dark:text-teal-400">Modern Note-Taking</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Discover all the features that make Memos the perfect privacy-first, self-hosted note-taking platform
              for individuals, teams, and organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/docs/installation"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://demo.usememos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                Try Demo
                <ServerIcon className="w-5 h-5" />
              </Link>
            </div>

            {/* Feature stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Open Source</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">5M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Docker Pulls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">0$</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            {featureCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              const colors = colorVariants[category.color as keyof typeof colorVariants];
              
              return (
                <div key={category.title} className="mb-32 last:mb-0">
                  {/* Category Header */}
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.icon}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
                      {category.title}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.features.map((feature) => (
                      <Link
                        key={feature.slug}
                        href={`/features/${feature.slug}`}
                        className={`group block p-8 ${colors.bg} border ${colors.border} rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.highlight}`}>
                            {feature.highlight}
                          </span>
                          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-3 tracking-tight ${colors.text} group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors`}>
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-6 leading-tight">
              Ready to Experience All Features?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have chosen privacy, performance, and complete control over their notes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs/installation"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                Install Memos
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}