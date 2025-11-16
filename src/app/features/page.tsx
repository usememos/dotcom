import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
  ArrowRightIcon,
  CloudOffIcon,
  CodeIcon,
  DatabaseIcon,
  DollarSignIcon,
  DownloadIcon,
  FileTextIcon,
  GitBranchIcon,
  GlobeIcon,
  HeartIcon,
  ImageIcon,
  KeyboardIcon,
  LayersIcon,
  LockIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  PaletteIcon,
  RefreshCwIcon,
  SaveIcon,
  SearchIcon,
  ServerIcon,
  ShieldCheckIcon,
  TagIcon,
  UploadIcon,
  ZapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Features - Memos",
  description:
    "Discover all the powerful features that make Memos the perfect privacy-first, self-hosted note-taking platform. From instant save to multi-language support.",
  keywords: [
    "note taking features",
    "self-hosted",
    "privacy",
    "markdown",
    "knowledge management",
    "tags",
    "search",
    "export",
    "keyboard shortcuts",
  ],
  alternates: {
    canonical: "https://usememos.com/features",
  },
  openGraph: {
    title: "Memos Features - Privacy-First Note Taking",
    description:
      "Explore all the comprehensive features of Memos - from advanced privacy controls to powerful customization options and seamless offline support.",
    url: "https://usememos.com/features",
    siteName: "Memos",
    images: [
      {
        url: "https://usememos.com/demo.png",
        width: 1200,
        height: 630,
        alt: "Memos Features Overview",
      },
    ],
    type: "website",
  },
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
              Discover all the features that make Memos the perfect privacy-first, self-hosted note-taking platform for individuals, teams,
              and organizations.
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Open Source</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">7M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Docker Pulls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* All Features Grid */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Data Ownership */}
              <Link
                href="/features/data-ownership"
                className="group block p-8 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-100 dark:border-teal-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-xl mb-4">
                  <LockIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Data Ownership</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Complete control over your notes with zero telemetry. All data stored locally in your chosen database.
                </p>
              </Link>

              {/* Self-Hosted */}
              <Link
                href="/features/self-hosted"
                className="group block p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl mb-4">
                  <ServerIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Self-Hosted</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Deploy on your own infrastructure from Raspberry Pi to enterprise Kubernetes clusters.
                </p>
              </Link>

              {/* Offline First */}
              <Link
                href="/features/no-dependencies"
                className="group block p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl mb-4">
                  <CloudOffIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Seamless Offline</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Works completely offline with zero external dependencies or cloud connections required.
                </p>
              </Link>

              {/* Instant Save */}
              <Link
                href="/features/instant-save"
                className="group block p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl mb-4">
                  <SaveIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Instant Save</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Automatic persistence as you type - never lose a thought with streamlined plaintext input.
                </p>
              </Link>

              {/* Markdown Support */}
              <Link
                href="/features/markdown-support"
                className="group block p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-100 dark:border-orange-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-xl mb-4">
                  <FileTextIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Rich Markdown</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  GitHub Flavored Markdown with syntax highlighting, tables, and LaTeX math expressions.
                </p>
              </Link>

              {/* Media Integration */}
              <Link
                href="/features/media-integration"
                className="group block p-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-100 dark:border-pink-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 rounded-xl mb-4">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Media Support</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Drag-and-drop support for images, videos, audio files, and document attachments.
                </p>
              </Link>

              {/* Cross-Platform */}
              <Link
                href="/features/cross-platform"
                className="group block p-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-xl mb-4">
                  <MonitorSmartphoneIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">On All Your Devices</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Linux, macOS, Windows, Docker, and Kubernetes - deploy anywhere with universal compatibility.
                </p>
              </Link>

              {/* Performance */}
              <Link
                href="/features/performance"
                className="group block p-8 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-100 dark:border-yellow-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-xl mb-4">
                  <ZapIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Super-fast</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Go-powered backend with instant loading and minimal resource usage for peak performance.
                </p>
              </Link>

              {/* API First */}
              <Link
                href="/features/api-first"
                className="group block p-8 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100 dark:border-violet-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-xl mb-4">
                  <CodeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">API & Integrations</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Full REST and gRPC APIs with unrestricted access for custom integrations and automation.
                </p>
              </Link>

              {/* Multi-Database */}
              <Link
                href="/features/database-support"
                className="group block p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border border-slate-100 dark:border-slate-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl mb-4">
                  <DatabaseIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Multi-Database</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Choose between SQLite, PostgreSQL, or MySQL to match your infrastructure needs.
                </p>
              </Link>

              {/* Customizable */}
              <Link
                href="/features/customizable-ui"
                className="group block p-8 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30 border border-fuchsia-100 dark:border-fuchsia-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl mb-4">
                  <PaletteIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Customizable</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Custom branding, themes, colors, and UI elements to create your perfect note-taking environment.
                </p>
              </Link>

              {/* Open Source */}
              <Link
                href="/features/open-source"
                className="group block p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl mb-4">
                  <GitBranchIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Open Source</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  MIT licensed with full source code transparency - freedom to use, modify, and distribute.
                </p>
              </Link>

              {/* Free Forever */}
              <Link
                href="/features/no-fees"
                className="group block p-8 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30 border border-lime-100 dark:border-lime-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900 text-lime-600 dark:text-lime-400 rounded-xl mb-4">
                  <DollarSignIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Always Free</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  All features free forever - no premium tiers, usage limits, or hidden costs. Ever.
                </p>
              </Link>

              {/* React Frontend */}
              <Link
                href="/features/react-frontend"
                className="group block p-8 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border border-sky-100 dark:border-sky-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 rounded-xl mb-4">
                  <LayersIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Beautiful Design</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Modern React and TypeScript interface with dark mode and responsive design for all devices.
                </p>
              </Link>

              {/* Community */}
              <Link
                href="/features/community"
                className="group block p-8 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-100 dark:border-rose-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 rounded-xl mb-4">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Community-Driven</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Active development with 45,000+ GitHub stars, transparent roadmap, and engaged community.
                </p>
              </Link>

              {/* Universal Search */}
              <div className="group block p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-100 dark:border-cyan-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 rounded-xl mb-4">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Universal Search</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Find any note instantly with powerful full-text search across all your memos and content.
                </p>
              </div>

              {/* Tags */}
              <div className="group block p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-xl mb-4">
                  <TagIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Tags</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Organize your notes with flexible tagging system for quick categorization and filtering.
                </p>
              </div>

              {/* Import */}
              <div className="group block p-8 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 border border-teal-100 dark:border-teal-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-xl mb-4">
                  <UploadIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Import</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Migrate from other platforms with easy import from Markdown files and popular note apps.
                </p>
              </div>

              {/* Export */}
              <div className="group block p-8 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-100 dark:border-purple-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl mb-4">
                  <DownloadIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Print & Export</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Export your notes to Markdown, JSON, or CSV - your data is always portable and accessible.
                </p>
              </div>

              {/* Keyboard Controls */}
              <div className="group block p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl mb-4">
                  <KeyboardIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Keyboard Shortcuts</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Boost productivity with comprehensive keyboard shortcuts for power users and fast navigation.
                </p>
              </div>

              {/* Night Mode */}
              <div className="group block p-8 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-xl mb-4">
                  <MoonIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Night Mode</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Built-in dark theme for comfortable viewing in low-light conditions with automatic detection.
                </p>
              </div>

              {/* Private & Secure */}
              <div className="group block p-8 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-100 dark:border-red-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-xl mb-4">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Private & Secure</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  End-to-end encrypted storage ensures your personal notes remain private and secure always.
                </p>
              </div>

              {/* Always Up to Date */}
              <div className="group block p-8 bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/30 border border-green-100 dark:border-green-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl mb-4">
                  <RefreshCwIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Always Up to Date</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Regular updates with new features, improvements, and security patches from active development.
                </p>
              </div>

              {/* Internationalization */}
              <div className="group block p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-xl mb-4">
                  <GlobeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Multi-Language Support</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Available in multiple languages with community-contributed translations for global accessibility.
                </p>
              </div>
            </div>
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
                Read Docs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
