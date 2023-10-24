import fs from "fs";
import Link from "next/link";
import path from "path";
import { getBlogSlugList } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

const Page = () => {
  const frontmatters = getBlogFrontmatters();

  return (
    <>
      <div className="w-full max-w-3xl flex flex-col justify-center items-center sm:px-16">
        <h2 className="w-full text-center text-4xl sm:text-6xl font-medium sm:font-bold mt-4 mb-6">Blogs</h2>
        <div className="mt-6 w-full flex flex-col justify-start items-start gap-4">
          {frontmatters.map((frontmatter) => {
            return (
              <Link
                key={frontmatter.slug}
                className="border rounded-lg p-4 w-full flex flex-col justify-start items-start hover:shadow"
                href={`/blog/${frontmatter.slug}`}
              >
                <p className="text-lg leading-tight sm:text-xl">{frontmatter.title}</p>
                {frontmatter.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{frontmatter.description}</p>}
                <div>
                  <p className="mt-2 text-sm text-gray-400">{frontmatter.published_at}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const metadata = getMetadata({ title: "Blogs", pathname: "/blog" });

const getBlogFrontmatters = () => {
  const blogSlugs = getBlogSlugList();
  const frontmatters = blogSlugs
    .map((slug) => {
      const filePath = path.resolve(`./content/blog/${slug}.md`);
      const content = fs.readFileSync(filePath, "utf8");
      const { frontmatter } = markdoc(content);
      return {
        ...frontmatter,
        slug: slug,
      };
    })
    .sort((a, b) => {
      return new Date(a.published_at) > new Date(b.published_at) ? -1 : 1;
    });
  return frontmatters;
};

export default Page;
