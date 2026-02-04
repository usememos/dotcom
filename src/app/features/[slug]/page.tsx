import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CheckCircleIcon, StarIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { getAllFeatureSlugs, getFeature } from "@/lib/features";

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = 86400;

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    notFound();
  }

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
          <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
          <div className="relative max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1] text-balance text-gray-900 dark:text-gray-50">
              {feature.hero.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 lg:mb-12 text-balance px-4">
              {feature.hero.subtitle}
            </p>

            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center max-w-sm sm:max-w-none mx-auto">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-500/25 hover:-translate-y-0.5 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                href="https://demo.usememos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 lg:mb-12 text-center">
              Key Benefits
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {feature.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:border-teal-200 dark:hover:border-teal-700 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full flex-shrink-0 mt-0.5 sm:mt-1 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 lg:mb-12 text-center">
              Perfect For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {feature.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-600 dark:text-teal-400 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <StarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 tracking-tight">
                    {useCase.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Details Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 lg:mb-12 text-center">
              Technical Details
            </h2>
            <div className="relative bg-gradient-to-br from-teal-50/80 via-cyan-50/50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-teal-100 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 dark:from-teal-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"></div>
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {feature.techDetails.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
          <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight text-balance">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed text-balance px-4">
              Experience {feature.title.toLowerCase()} and all other Memos features in your own self-hosted instance.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center max-w-sm sm:max-w-none mx-auto">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-500/25 hover:-translate-y-0.5 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Install Memos Now
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return getAllFeatureSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    return {
      title: "Feature Not Found - Memos",
    };
  }

  const pageUrl = `https://usememos.com/features/${slug}`;

  return {
    title: `${feature.title} - Memos Features`,
    description: feature.description,
    keywords: [`memos ${feature.title.toLowerCase()}`, "self-hosted", "privacy", "note taking", "open source"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${feature.title} - Memos`,
      description: feature.description,
      url: pageUrl,
      siteName: "Memos",
      images: [
        {
          url: "https://usememos.com/og-image.png",
          width: 1200,
          height: 630,
          alt: `Memos ${feature.title}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${feature.title} - Memos`,
      description: feature.description,
      images: ["https://usememos.com/og-image.png"],
    },
  };
}
