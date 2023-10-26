import fs from "fs";
import { Metadata } from "next";
import path from "path";
import React from "react";
import ContentRender from "@/components/ContentRender";
import { getChangelogSlugList } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string[] };
}

const Page = ({ params }: Props) => {
  const content = readChangelogContent(params.slug);
  const { frontmatter, transformedContent } = markdoc(content);

  return (
    <div className="w-full max-w-4xl sm:px-6">
      <h2 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold mt-4 mb-4">{frontmatter.title}</h2>
      <ContentRender markdocNode={transformedContent} />
    </div>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const content = readChangelogContent(params.slug);
  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title + " - memos",
    pathname: params.slug?.length > 0 ? `/changelog/${params.slug.join("/")}` : "/changelog",
  });
};

export const generateStaticParams = () => {
  return [
    { slug: [] },
    ...[...getChangelogSlugList()].map((contentSlug) => {
      return { slug: contentSlug };
    }),
  ];
};

const readChangelogContent = (contentSlug: string[]) => {
  let filePath = path.resolve("./content/changelog/index.md");
  if (Array.isArray(contentSlug) && contentSlug.length !== 0) {
    const indexFilePath = path.resolve(`./content/changelog/${contentSlug.join("/")}/index.md`);
    if (fs.existsSync(indexFilePath)) {
      filePath = indexFilePath;
    } else {
      filePath = path.resolve(`./content/changelog/${contentSlug.join("/")}.md`);
    }
  }
  const content = fs.readFileSync(filePath, "utf8");
  return content;
};

export default Page;
