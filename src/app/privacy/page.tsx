import type { Metadata } from "next";
import { ShieldIcon, EyeOffIcon, LockIcon, GithubIcon, ServerIcon, UsersIcon } from "lucide-react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Memos",
  description: "Memos privacy policy - We collect nothing. Zero tracking, zero analytics. Your data stays on your server.",
  alternates: {
    canonical: "https://usememos.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-2xl">
                  <ShieldIcon className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 leading-tight">Privacy Policy</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your privacy isn't a feature—it's our foundation. Memos is built to keep your data completely private and under your
                control.
              </p>
            </div>

            {/* Simple Statement */}
            <section className="mb-20">
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950 border border-teal-200 dark:border-teal-800 rounded-3xl p-12 shadow-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-teal-900 dark:text-teal-100 mb-6 tracking-tight">The Simple Truth</h2>
                  <p className="text-2xl text-teal-800 dark:text-teal-200 leading-relaxed mb-4">
                    We don't collect <strong>anything</strong> from you.
                  </p>
                  <p className="text-lg text-teal-700 dark:text-teal-300 leading-relaxed">
                    No tracking. No analytics. No telemetry. No cookies. Nothing. Your data is yours, and yours alone.
                  </p>
                </div>
              </div>
            </section>

            {/* What We Don't Collect */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
                  <EyeOffIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Zero Data Collection</h2>
              </div>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-lg">We never collect, store, or have access to:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { item: "Personal Information", detail: "Names, emails, phone numbers—nothing" },
                  { item: "Usage Data", detail: "No tracking of how you use Memos" },
                  { item: "Your Content", detail: "Your notes never touch our servers" },
                  { item: "Technical Data", detail: "No IP addresses, device info, or fingerprints" },
                  { item: "Cookies & Trackers", detail: "No tracking scripts or third-party analytics" },
                  { item: "Behavioral Analytics", detail: "No profiling or usage patterns" },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-gray-900 dark:text-gray-100 font-bold mb-1">{entry.item}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{entry.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <ServerIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Self-Hosted by Design</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-12 shadow-lg mb-8">
                <p className="text-xl text-gray-700 dark:text-gray-300 text-center leading-relaxed mb-8">
                  Memos is designed to run on <strong>your own server</strong>. This means your data never leaves your infrastructure.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Your Server",
                      description: "Install Memos on your own infrastructure—cloud or local.",
                    },
                    {
                      title: "Your Data",
                      description: "All notes and files stay on your server, under your control.",
                    },
                    {
                      title: "Your Rules",
                      description: "You decide who can access it and how it's secured.",
                    },
                  ].map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-4 text-xl font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "No External Dependencies",
                    description: "Memos doesn't phone home or connect to our servers. Once installed, it works completely offline.",
                  },
                  {
                    title: "Complete Ownership",
                    description:
                      "You own your data in every sense—physically, legally, and practically. We can't access it even if we wanted to.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Open Source */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Open Source Transparency</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-12 shadow-lg">
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed">
                  Don't just take our word for it—<strong>verify it yourself</strong>. Our code is publicly available for anyone to inspect.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    "Audit our entire codebase on GitHub",
                    "Verify no telemetry or tracking code exists",
                    "Build from source for complete transparency",
                    "Community-reviewed and maintained",
                    "Modify the code to suit your needs",
                    "No proprietary black boxes",
                  ].map((guarantee, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{guarantee}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <a
                    href="https://github.com/usememos/memos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white font-semibold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                  >
                    <GithubIcon className="w-5 h-5" />
                    <span>View Source Code on GitHub</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Questions?</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-12 shadow-lg">
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed">
                  Have questions about our privacy practices? We're here to help.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a
                    href="https://github.com/usememos/memos/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 p-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl group-hover:scale-110 transition-transform">
                      <GithubIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Report on GitHub</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Open an issue for privacy concerns</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/usememos/memos/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 p-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl group-hover:scale-110 transition-transform">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Join Discussions</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Talk with the community</div>
                    </div>
                  </a>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <section className="text-center">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Last Updated:</strong> October 2024
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  This policy reflects our commitment to your privacy. View the latest version on{" "}
                  <a
                    href="https://github.com/usememos/memos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
