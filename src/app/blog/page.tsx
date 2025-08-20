import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { blogSource } from "@/lib/source";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footerz";

export const metadata: Metadata = {
  title: "Blog - Memos",
  description: "Read about the latest updates, insights, and stories from the Memos team about our open-source note-taking platform.",
};

export default function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.published_at).getTime();
    const dateB = new Date(b.data.published_at).getTime();
    return dateB - dateA; // Sort by newest first
  });

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Memos Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Insights, updates, and stories from our journey building the best open-source note-taking platform.
            </p>
          </div>

          {/* Blog Posts */}
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.url}
                className="group border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-600 transition-all"
              >
                <Link href={post.url} className="block">
                  {/* Feature Image */}
                  {post.data.feature_image && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <img
                        src={post.data.feature_image}
                        alt={post.data.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {post.data.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post.data.description}</p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.data.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.data.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {post.data.tags && post.data.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">•</span>
                          <div className="flex gap-2">
                            {post.data.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="mt-4 flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium group-hover:gap-3 transition-all">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 dark:text-gray-300">Check back soon for insights and updates from the Memos team.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </HomeLayout>
  );
}
