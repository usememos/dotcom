import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import type { ContentSocialPreview, SocialPreviewImageKind } from "@/lib/social-preview";
import { getAllContentSocialPreviews } from "@/lib/social-preview";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Social Preview Audit - Memos",
  description: "Internal social preview audit for Memos content pages.",
  robots: {
    index: false,
    follow: false,
  },
};

const imageKinds: SocialPreviewImageKind[] = ["default", "generated", "explicit"];

function getPath(url: string): string {
  return new URL(url).pathname;
}

function groupPreviews(previews: ContentSocialPreview[]) {
  return imageKinds.map((kind) => ({
    kind,
    previews: previews.filter((preview) => preview.imageSourceKind === kind),
  }));
}

export default function SocialPreviewsPage() {
  const previews = getAllContentSocialPreviews();
  const groups = groupPreviews(previews);

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Social previews</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">OG image coverage</h1>
              <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Content URLs grouped by whether their social preview image is explicit, generated, or still using the global default.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {groups.map((group) => (
                <div key={group.kind} className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
                  <p className="text-sm font-medium capitalize text-zinc-500 dark:text-zinc-400">{group.kind}</p>
                  <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">{group.previews.length}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-12">
              {groups.map((group) => (
                <section key={group.kind}>
                  <h2 className="text-2xl font-semibold capitalize text-zinc-950 dark:text-zinc-50">{group.kind}</h2>
                  <div className="mt-5 overflow-x-auto border-y border-zinc-200 dark:border-zinc-800">
                    <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                      <thead className="bg-zinc-50 text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
                        <tr>
                          <th className="px-4 py-3 font-medium">URL</th>
                          <th className="px-4 py-3 font-medium">Section</th>
                          <th className="px-4 py-3 font-medium">Title</th>
                          <th className="px-4 py-3 font-medium">Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.previews.map((preview) => (
                          <tr key={preview.url} className="border-t border-zinc-200 dark:border-zinc-800">
                            <td className="px-4 py-3">
                              <a className="font-medium text-emerald-700 hover:underline dark:text-emerald-400" href={getPath(preview.url)}>
                                {getPath(preview.url)}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{preview.section}</td>
                            <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{preview.title}</td>
                            <td className="px-4 py-3">
                              <a
                                className="text-zinc-600 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                                href={preview.imageUrl}
                              >
                                {getPath(preview.imageUrl)}
                              </a>
                            </td>
                          </tr>
                        ))}
                        {group.previews.length === 0 ? (
                          <tr>
                            <td className="px-4 py-5 text-zinc-500 dark:text-zinc-400" colSpan={4}>
                              No URLs in this group.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
