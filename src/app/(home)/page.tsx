import Link from "next/link";
import { Github, Download } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { StatsCard } from "@/components/stats-card";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Open Source, <span className="block sm:inline">Self-hosted</span>
            <span className="block text-teal-600">Your Notes, Your Way</span>
          </>
        }
        subtitle="Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution"
        primaryCta={{ text: "Get Started", href: "/docs" }}
        secondaryCta={{ text: "Live Demo", href: "https://demo.usememos.com/", external: true }}
        demoImage={{ src: "/demo.png", alt: "Memos Dashboard Screenshot" }}
      />

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              The pain-less way to create meaningful notes
            </h2>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {[
              {
                icon: "🏠",
                title: "Privacy First",
                description: "Take control of your data. All runtime data is securely stored in your local database.",
              },
              {
                icon: "✍️",
                title: "Create at Speed",
                description: "Save content as plain text for quick access, with Markdown support for fast formatting and easy sharing.",
              },
              {
                icon: "🤲",
                title: "Lightweight but Powerful",
                description:
                  "Built with Go, React.js, and a compact architecture, our service delivers powerful performance in a lightweight package.",
              },
              {
                icon: "🧩",
                title: "Customizable",
                description:
                  "Easily customize your server name, icon, description, system style, and execution scripts to make it uniquely yours.",
              },
              {
                icon: "🦦",
                title: "Open Source",
                description:
                  "Memos embraces the future of open source, with all code available on GitHub for transparency and collaboration.",
              },
              {
                icon: "💸",
                title: "Free to Use",
                description: "Enjoy all features completely free, with no charges ever for any content.",
              },
            ].map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: "🌟", value: "39K+", label: "GitHub Stars" },
                { icon: "👥", value: "300+", label: "Contributors" },
                { icon: "📈", value: "5.3M+", label: "Docker Pulls" },
                { icon: "📦", value: "70+", label: "Releases" },
              ].map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-6">
            Ready to take control of your notes?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who have chosen privacy, simplicity, and control over their data.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs/installation"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-teal-600 border border-transparent rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
            >
              <Download className="w-5 h-5" />
              Install Now
            </Link>
            <Link
              href="https://github.com/usememos/memos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
