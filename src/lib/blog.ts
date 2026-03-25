export const BLOG_COLUMN_CLASS = "mx-auto max-w-[48rem]";
export const BLOG_ARTICLE_COLUMN_CLASS = "mx-auto min-w-0 max-w-[46rem] sm:max-w-[48rem]";

export function formatBlogDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAbsoluteBlogImageUrl(url: string | undefined) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `https://usememos.com${url.startsWith("/") ? url : `/${url}`}`;
}
