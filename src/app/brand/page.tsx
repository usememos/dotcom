import { HomeLayout } from "fumadocs-ui/layouts/home";
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

export default function BrandPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 leading-tight">Brand</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 text-balance mx-auto leading-relaxed">
                Download official Memos brand assets and learn about proper usage guidelines for our open-source note-taking platform.
              </p>
            </div>

            {/* Logo Assets */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Logo Assets</h2>

              {/* Primary Logos */}
              <div className="mb-16">
                <h3 className="text-xl font-bold mb-8 text-center">Primary Logos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    <div className="flex justify-center items-center h-24 mb-4">
                      <Image src="/logo.png" alt="Memos Logo" width={96} height={96} className="max-h-full max-w-full" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg dark:text-gray-100">Standard Logo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    <div className="flex justify-center items-center h-24 mb-4">
                      <Image src="/logo-rounded.png" alt="Memos Rounded Logo" width={96} height={96} className="max-h-full max-w-full" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg dark:text-gray-100">Rounded Logo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Logos */}
              <div className="mb-16">
                <h3 className="text-xl font-bold mb-8 text-center">Full Logos with Text</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    <div className="flex justify-center items-center h-24 mb-4">
                      <Image
                        src="/full-logo-landscape.png"
                        alt="Memos Landscape Logo"
                        width={300}
                        height={96}
                        className="max-h-full max-w-full"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg dark:text-gray-100">Landscape Logo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    <div className="flex justify-center items-center h-24 mb-4">
                      <Image src="/full-logo.png" alt="Memos Vertical Logo" width={89} height={96} className="max-h-full max-w-full" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg dark:text-gray-100">Vertical Logo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Brand Guidelines */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Brand Guidelines</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">✅ Do</h3>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                      <li>• Use the logo with proper spacing and clear backgrounds</li>
                      <li>• Maintain the logo&apos;s aspect ratio when resizing</li>
                      <li>• Use high-resolution versions for print materials</li>
                      <li>• Follow the color guidelines when using branded elements</li>
                      <li>• Use the logo to link back to Memos website</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-red-700 dark:text-red-400">❌ Don&apos;t</h3>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                      <li>• Stretch, skew, or distort the logo</li>
                      <li>• Change the logo colors or add effects</li>
                      <li>• Place the logo on busy or low-contrast backgrounds</li>
                      <li>• Use outdated or low-resolution logo versions</li>
                      <li>• Recreate or modify the logo design</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Usage */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Usage & Attribution</h2>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border border-teal-200 dark:border-teal-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-6">Open Source Usage</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Memos is an open-source project, and you&apos;re welcome to use our brand assets in accordance with our guidelines. When
                  featuring Memos:
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li>• Attribution is appreciated but not required</li>
                  <li>
                    • Link back to{" "}
                    <span className="font-mono text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900 px-2 py-1 rounded">
                      usememos.com
                    </span>{" "}
                    when possible
                  </li>
                  <li>• Ensure usage aligns with our open-source values</li>
                  <li>• Contact us for special usage requests or questions</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="text-center">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-12 shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Questions about brand usage?</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-balance mx-auto leading-relaxed">
                  If you have questions about using our brand assets or need special permissions, we&apos;d love to hear from you.
                </p>
                <a
                  href="https://github.com/usememos/memos/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
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
