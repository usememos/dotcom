import type { Metadata } from "next";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footerz";

export const metadata: Metadata = {
  title: "Brand - Memos",
  description: "Official Memos brand assets, logos, and usage guidelines for the open-source note-taking platform.",
};

export default function BrandPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Brand</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Download official Memos brand assets and learn about proper usage guidelines for our open-source note-taking platform.
            </p>
          </div>

          {/* Logo Assets */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Logo Assets</h2>

            {/* Primary Logos */}
            <div className="mb-12">
              <h3 className="text-lg font-medium mb-6 text-gray-700 dark:text-gray-300">Primary Logos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center items-center h-24 mb-4">
                    <img src="/logo.png" alt="Memos Logo" className="max-h-full max-w-full" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium dark:text-gray-100">Standard Logo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center items-center h-24 mb-4">
                    <img src="/logo-rounded.png" alt="Memos Rounded Logo" className="max-h-full max-w-full" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium dark:text-gray-100">Rounded Logo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Logos */}
            <div className="mb-12">
              <h3 className="text-lg font-medium mb-6 text-gray-700 dark:text-gray-300">Full Logos with Text</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center items-center h-24 mb-4">
                    <img src="/full-logo-landscape.png" alt="Memos Landscape Logo" className="max-h-full max-w-full" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium dark:text-gray-100">Landscape Logo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center items-center h-24 mb-4">
                    <img src="/full-logo.png" alt="Memos Vertical Logo" className="max-h-full max-w-full" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium dark:text-gray-100">Vertical Logo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG format</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Guidelines */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Brand Guidelines</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-700">✅ Do</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Use the logo with proper spacing and clear backgrounds</li>
                    <li>• Maintain the logo&apos;s aspect ratio when resizing</li>
                    <li>• Use high-resolution versions for print materials</li>
                    <li>• Follow the color guidelines when using branded elements</li>
                    <li>• Use the logo to link back to Memos website</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-red-700">❌ Don&apos;t</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
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

          {/* Colors */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Brand Colors</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-full h-24 bg-teal-600 rounded-lg mb-4 border border-gray-200"></div>
                <p className="font-medium">Primary Teal</p>
                <p className="text-sm text-gray-500 font-mono">#0D9488</p>
              </div>

              <div className="text-center">
                <div className="w-full h-24 bg-gray-900 rounded-lg mb-4 border border-gray-200"></div>
                <p className="font-medium">Dark Gray</p>
                <p className="text-sm text-gray-500 font-mono">#111827</p>
              </div>

              <div className="text-center">
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-4 border border-gray-200"></div>
                <p className="font-medium">Light Gray</p>
                <p className="text-sm text-gray-500 font-mono">#F3F4F6</p>
              </div>
            </div>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-2xl font-semibold mb-8">Usage & Attribution</h2>

            <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Open Source Usage</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Memos is an open-source project, and you&apos;re welcome to use our brand assets in accordance with our guidelines. When
                featuring Memos:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Attribution is appreciated but not required</li>
                <li>
                  • Link back to <span className="font-mono text-teal-700">usememos.com</span> when possible
                </li>
                <li>• Ensure usage aligns with our open-source values</li>
                <li>• Contact us for special usage requests or questions</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-16 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <h3 className="text-lg font-medium mb-4">Questions about brand usage?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you have questions about using our brand assets or need special permissions, we&apos;d love to hear from you.
              </p>
              <a
                href="https://github.com/usememos/memos/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </HomeLayout>
  );
}
