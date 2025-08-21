import type { Metadata } from "next";
import { ShieldIcon, EyeIcon, LockIcon, GithubIcon, ServerIcon, UsersIcon } from "lucide-react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Memos",
  description: "Memos privacy policy - We never collect your personal data. Open source and privacy-first note-taking platform.",
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
                Memos is designed with privacy-first principles, ensuring your data stays completely under your control.
              </p>
            </div>

            {/* Privacy Guarantee */}
            <section className="mb-20">
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950 border border-teal-200 dark:border-teal-800 rounded-3xl p-12 shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-2xl flex-shrink-0">
                    <LockIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-teal-900 dark:text-teal-100 mb-6 tracking-tight">
                      Our Commitment to Your Privacy
                    </h2>
                    <p className="text-lg text-teal-800 dark:text-teal-200 leading-relaxed">
                      Memos is a <strong>free, open-source</strong> note-taking application that puts your privacy first. We believe that
                      your personal data belongs to you, and you alone. When you use Memos, your data never leaves your control.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Don't Collect */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
                  <EyeIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">What We DON&apos;T Collect</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Personal information or user profiles",
                  "Usage tracking or behavioral analytics",
                  "Your notes or any content data",
                  "Cookies or tracking scripts",
                  "Location or device information",
                  "Any data to monetize or sell",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">We do NOT collect {item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* How Memos Works */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <ServerIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">How Memos Works</h2>
              </div>

              <div className="text-center mb-8">
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Memos is designed to be <strong>self-hosted</strong>, meaning your data stays entirely under your control
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Your Data Stays With You",
                    description: "All your notes and data are stored on your own server or device, never on external servers.",
                  },
                  {
                    title: "Complete Control",
                    description: "You have full control over your data, who can access it, and how it's secured.",
                  },
                  {
                    title: "No External Dependencies",
                    description: "Your notes don't rely on our servers, services, or internet connectivity to function.",
                  },
                  {
                    title: "Open Source Transparency",
                    description: "Our code is publicly available for audit, review, and verification of our privacy claims.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 tracking-tight">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Open Source Guarantee */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Open Source Guarantee</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-12 shadow-lg">
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 text-center leading-relaxed">
                  Because Memos is <strong>open source</strong>, you get these additional privacy protections:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Review our code to verify all privacy claims",
                    "Community audit and improvement of privacy practices",
                    "No hidden data collection mechanisms",
                    "Modify the software to meet your specific privacy needs",
                    "Build from source for complete transparency",
                  ].map((guarantee, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{guarantee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Questions or Concerns?</h2>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 rounded-3xl p-12 shadow-lg">
                <p className="text-xl text-purple-800 dark:text-purple-200 mb-8 text-center leading-relaxed">
                  If you have any questions about this privacy policy or our privacy practices, we encourage you to:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <a
                    href="https://github.com/usememos/memos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 p-8 bg-white/80 dark:bg-gray-800/80 border border-purple-200 dark:border-purple-700 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                      <GithubIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-900 dark:text-purple-100">Open an issue on GitHub</div>
                      <div className="text-purple-700 dark:text-purple-300">Report privacy concerns or ask questions</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/usememos/memos/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 p-8 bg-white/80 dark:bg-gray-800/80 border border-purple-200 dark:border-purple-700 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-900 dark:text-purple-100">Join community discussions</div>
                      <div className="text-purple-700 dark:text-purple-300">Connect with other privacy-conscious users</div>
                    </div>
                  </a>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <section className="text-center">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <p className="text-lg font-medium mb-2">This privacy policy reflects our ongoing commitment to user privacy.</p>
                  <p>
                    For the most current version, visit our{" "}
                    <a
                      href="https://github.com/usememos/memos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline font-semibold"
                    >
                      GitHub repository
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
