import type { Metadata } from "next";
import { Shield, Eye, Lock, Github, Server, Users } from "lucide-react";
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
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-teal-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your privacy is our priority. Memos is designed with privacy-first principles, ensuring your data stays completely under your
              control.
            </p>
          </div>

          {/* Privacy Guarantee */}
          <section className="mb-16">
            <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold text-teal-900 dark:text-teal-100 mb-4">Our Commitment to Your Privacy</h2>
                  <p className="text-teal-800 dark:text-teal-200 leading-relaxed">
                    Memos is a <strong>free, open-source</strong> note-taking application that puts your privacy first. We believe that your
                    personal data belongs to you, and you alone. When you use Memos, your data never leaves your control.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Don't Collect */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Eye className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-semibold">What We DON&apos;T Collect</h2>
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
                  className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-red-800 dark:text-red-200 font-medium">We do NOT collect {item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How Memos Works */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Server className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold">How Memos Works</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Memos is designed to be <strong>self-hosted</strong>, meaning your data stays entirely under your control:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div key={index} className="p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{feature.title}</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open Source Guarantee */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Github className="w-8 h-8 text-gray-700" />
              <h2 className="text-2xl font-semibold">Open Source Guarantee</h2>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Because Memos is <strong>open source</strong>, you get these additional privacy protections:
              </p>

              <div className="space-y-4">
                {[
                  "Review our code to verify all privacy claims",
                  "Community audit and improvement of privacy practices",
                  "No hidden data collection mechanisms",
                  "Modify the software to meet your specific privacy needs",
                  "Build from source for complete transparency",
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Lock className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-semibold">Data Security</h2>
            </div>

            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-8">
              <p className="text-green-800 dark:text-green-200 mb-6">
                Since your data never leaves your control when using Memos, data security is entirely in your hands. We recommend following
                these security best practices:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Use HTTPS for secure connections",
                  "Implement regular automated backups",
                  "Use strong authentication methods",
                  "Keep your Memos installation updated",
                  "Monitor access logs regularly",
                  "Follow server security best practices",
                ].map((practice, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-green-800 dark:text-green-200">{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-semibold">Questions or Concerns?</h2>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-8">
              <p className="text-purple-800 dark:text-purple-200 mb-6">
                If you have any questions about this privacy policy or our privacy practices, we encourage you to:
              </p>

              <div className="space-y-4">
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all"
                >
                  <Github className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">Open an issue on GitHub</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Report privacy concerns or ask questions</div>
                  </div>
                </a>

                <a
                  href="https://github.com/usememos/memos/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all"
                >
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">Join community discussions</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Connect with other privacy-conscious users</div>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <section className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>This privacy policy reflects our ongoing commitment to user privacy.</p>
              <p className="mt-2">
                For the most current version, visit our{" "}
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline"
                >
                  GitHub repository
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </HomeLayout>
  );
}
