import { blogSource } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = 3600; // Regenerate once per hour

const BASE_URL = "https://usememos.com";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.published_at).getTime();
    const dateB = new Date(b.data.published_at).getTime();
    return dateB - dateA; // Sort by newest first
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Memos Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Insights, updates, and stories from our journey building the best open-source note-taking platform.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const postUrl = `${BASE_URL}${post.url}`;
        const pubDate = new Date(post.data.published_at).toUTCString();

        return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.data.description || "")}</description>
      ${post.data.tags ? post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ") : ""}
    </item>`;
      })
      .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
