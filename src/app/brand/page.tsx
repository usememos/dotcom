import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DownloadIcon, PaletteIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Brand - Memos",
  description: "Official Memos brand assets, logos, and usage guidelines for the open-source note-taking platform.",
  alternates: {
    canonical: "https://usememos.com/brand",
  },
};

const LOGO_ASSETS = [
  {
    src: "/logo.png",
    alt: "Memos Logo",
    title: "Standard Logo",
    width: 96,
    height: 96,
  },
  {
    src: "/logo-rounded.png",
    alt: "Memos Rounded Logo",
    title: "Rounded Logo",
    width: 96,
    height: 96,
  },
] as const;

const FULL_LOGOS = [
  {
    src: "/full-logo-landscape.png",
    alt: "Memos Landscape Logo",
    title: "Landscape Logo",
    width: 300,
    height: 96,
    wide: true,
  },
  {
    src: "/full-logo.png",
    alt: "Memos Vertical Logo",
    title: "Vertical Logo",
    width: 89,
    height: 96,
    wide: false,
  },
] as const;

const GUIDELINES = [
  "Use the logo with proper spacing and clear backgrounds",
  "Maintain the logo's aspect ratio when resizing",
  "Use the logo to link back to the Memos website",
] as const;

export default function BrandPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 rounded-2xl">
                  <PaletteIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">Brand</h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Download official Memos brand assets and guidelines.
              </p>
            </div>

            {/* Primary Logos */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Primary Logos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {LOGO_ASSETS.map((logo) => (
                  <div
                    key={logo.src}
                    className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-center items-center h-24 mb-6">
                      <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="max-h-full max-w-full" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">{logo.title}</p>
                      <a
                        href={logo.src}
                        download
                        className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        Download PNG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Full Logos */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Full Logos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {FULL_LOGOS.map((logo) => (
                  <div
                    key={logo.src}
                    className={`group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${logo.wide ? "lg:col-span-2" : ""}`}
                  >
                    <div className="flex justify-center items-center h-24 mb-6">
                      <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="max-h-full max-w-full" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">{logo.title}</p>
                      <a
                        href={logo.src}
                        download
                        className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        Download PNG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Guidelines */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Guidelines</h2>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
                <ul className="space-y-4">
                  {GUIDELINES.map((guideline) => (
                    <li key={guideline} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Usage & Attribution */}
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">Usage</h2>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 sm:p-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Memos is open source—you&apos;re welcome to use our brand assets in accordance with these guidelines:
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>Attribution is appreciated but not required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>
                      Link back to{" "}
                      <span className="font-mono text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900 px-2 py-0.5 rounded">
                        usememos.com
                      </span>{" "}
                      when possible
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>Ensure usage aligns with open-source values</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="text-center">
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950 border border-teal-200 dark:border-teal-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-900 dark:text-teal-100 mb-3 sm:mb-4">Questions?</h2>
                <p className="text-base sm:text-lg text-teal-800 dark:text-teal-200 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
                  Need special permissions or have questions about brand usage?
                </p>
                <a
                  href="https://github.com/usememos/memos/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                >
                  Contact Us
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
