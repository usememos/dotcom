import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  PencilIcon,
  ServerIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { getAllUseCaseSlugs, getUseCase } from "@/lib/use-cases";

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

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) {
    return {
      title: "Use Case Not Found",
    };
  }

  return {
    title: useCase.seo.title,
    description: useCase.seo.description,
    keywords: useCase.seo.keywords,
    alternates: {
      canonical: `https://usememos.com/use-cases/${slug}`,
    },
    openGraph: {
      title: useCase.seo.title,
      description: useCase.seo.description,
      url: `https://usememos.com/use-cases/${slug}`,
      siteName: "Memos",
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: useCase.seo.title,
      description: useCase.seo.description,
    },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) {
    notFound();
  }

  const IconComponent = iconMap[useCase.icon as IconName];

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-32 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${useCase.iconBg} text-gray-900 dark:text-gray-100 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8`}
              >
                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                {useCase.title}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                {useCase.subtitle}
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {useCase.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div
              className={`bg-gradient-to-br ${useCase.gradient} border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg mb-12 sm:mb-16`}
            >
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Common Workflows */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl">
                      <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    Common Workflows
                  </h2>
                  <ul className="space-y-4">
                    {useCase.workflows.map((workflow, index) => (
                      <li key={index} className="flex items-start gap-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 mt-3"></span>
                        <span>{workflow}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why Memos */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl">
                      <HeartPulseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    Why Memos Fits
                  </h2>
                  <ul className="space-y-4">
                    {useCase.whyMemos.map((reason, index) => (
                      <li key={index} className="flex items-start gap-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-3"></span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Related Features */}
            <div className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 text-center">
                Key Features for This Use Case
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {useCase.features.map((feature) => (
                  <Link
                    key={feature.slug}
                    href={`/features/${feature.slug}`}
                    className="group p-6 sm:p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {feature.name}
                    </h3>
                    <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">Learn more →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50/50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-teal-100 dark:border-gray-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                Ready to get started?
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Join a community of people who use Memos for their {useCase.title.toLowerCase()} needs.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center max-w-sm sm:max-w-none mx-auto">
                <Link
                  href="/docs/getting-started"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 border border-transparent rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Get Started Now
                  <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                    →
                  </span>
                </Link>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                >
                  View All Use Cases
                </Link>
              </div>
            </div>

            {/* Breadcrumb Link */}
            <div className="mt-12 sm:mt-16 text-center">
              <Link
                href="/use-cases"
                className="inline-flex items-center gap-2 text-sm sm:text-base text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:underline transition-colors"
              >
                ← Back to all use cases
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </HomeLayout>
  );
}
