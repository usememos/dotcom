import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  LightbulbIcon,
  PencilIcon,
  ServerIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { getAllUseCaseSlugs, USE_CASES } from "@/lib/use-cases";

export const metadata: Metadata = {
  title: "Use Cases - How Teams & Individuals Use Memos for Note-Taking",
  description:
    "Discover how developers, writers, researchers, businesses, and privacy-conscious professionals use Memos for secure, self-hosted note-taking. From personal knowledge management to team documentation.",
  keywords: [
    "note taking use cases",
    "self-hosted notes",
    "developer notes",
    "team documentation",
    "personal knowledge management",
    "privacy-focused notes",
    "research notes",
    "business documentation",
    "code snippets manager",
    "markdown notes",
  ],
  alternates: {
    canonical: "https://usememos.com/use-cases",
  },
  openGraph: {
    title: "Use Cases - How Teams & Individuals Use Memos",
    description:
      "Explore real-world use cases for Memos - from software development and content creation to research, business documentation, and privacy-critical applications.",
    url: "https://usememos.com/use-cases",
    siteName: "Memos",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases - How People Use Memos",
    description:
      "Discover how developers, writers, researchers, and teams use Memos for secure, self-hosted note-taking and knowledge management.",
  },
};

// Icon mapping
const iconMap = {
  CodeIcon: CodeIcon,
  PencilIcon: PencilIcon,
  ShieldCheckIcon: ShieldCheckIcon,
  GraduationCapIcon: GraduationCapIcon,
  BookOpenIcon: BookOpenIcon,
  ServerIcon: ServerIcon,
  UsersIcon: UsersIcon,
  WrenchIcon: WrenchIcon,
} as const;

type IconName = keyof typeof iconMap;

// Use case card data for the quick overview grid
const useCaseCards = [
  {
    slug: "self-hosting",
    icon: ServerIcon,
    title: "Self-Hosters",
    description: "Server documentation",
    gradient: "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
  },
  {
    slug: "developers",
    icon: CodeIcon,
    title: "Developers",
    description: "Code snippets & technical notes",
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
  {
    slug: "writers",
    icon: PencilIcon,
    title: "Writers",
    description: "Article drafts & research",
    gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
  },
  {
    slug: "personal-knowledge",
    icon: BookOpenIcon,
    title: "PKM Users",
    description: "Personal wikis & journals",
    gradient: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
  },
  {
    slug: "hobbyists-makers",
    icon: WrenchIcon,
    title: "Makers",
    description: "Project logs & ideas",
    gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
  },
  {
    slug: "students-researchers",
    icon: GraduationCapIcon,
    title: "Students",
    description: "Lecture notes & research",
    gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
  },
  {
    slug: "privacy-professionals",
    icon: ShieldCheckIcon,
    title: "Privacy Pros",
    description: "Confidential information",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  },
  {
    slug: "teams",
    icon: UsersIcon,
    title: "Teams",
    description: "Shared knowledge bases",
    gradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
  },
];

export default function UseCasesPage() {
  const slugs = getAllUseCaseSlugs();

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-32 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8">
              <LightbulbIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              How People Use Memos
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              From software development to personal journaling, discover how people around the world use Memos for
              secure, self-hosted note-taking and knowledge management.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Self-Hosters",
                "Developers",
                "Writers",
                "PKM Users",
                "Makers",
                "Students",
                "Privacy Pros",
                "Teams",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Grid with Links to Individual Pages */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
            {slugs.map((slug) => {
              const useCase = USE_CASES[slug as keyof typeof USE_CASES];
              const IconComponent = iconMap[useCase.icon as IconName];

              return (
                <article key={slug} className="scroll-mt-20">
                  <Link
                    href={`/use-cases/${slug}`}
                    className={`block bg-gradient-to-br ${useCase.gradient} border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg hover:shadow-2xl hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1 transition-all duration-300`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 sm:gap-6 mb-6">
                      <div
                        className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${useCase.iconBg} text-gray-900 dark:text-gray-100 rounded-xl sm:rounded-2xl`}
                      >
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {useCase.title}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
                          {useCase.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {useCase.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold">
                      <span>Learn more about this use case</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick Navigation Grid */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
                Find Your Use Case
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore detailed guides for each use case
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {useCaseCards.map((card) => (
                <Link
                  key={card.slug}
                  href={`/use-cases/${card.slug}`}
                  className={`group p-4 sm:p-6 bg-gradient-to-br ${card.gradient} border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                    <card.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 rounded-2xl mb-6">
              <UserIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Ready to start your own use case?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join a global community of people who have chosen Memos for their note-taking and knowledge management
              needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center max-w-sm sm:max-w-none mx-auto">
              <Link
                href="/docs/installation"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 border border-transparent rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
              >
                Get Started Now
                <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </HomeLayout>
  );
}
