import fs from "fs";
import { Metadata } from "next";
import path from "path";
import React from "react";
import ContentRender from "@/components/ContentRender";
import { getDocsSlugList } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";
import Sidebar from "./navigation";

interface Props {
  params: { slug: string[] };
}

const Page = ({ params }: Props) => {
  const content = readDocsContent(params.slug);
  const { frontmatter, transformedContent } = markdoc(content);

  return (
    <div className="w-full max-w-5xl flex flex-row justify-start items-start sm:px-10">
      <div className="hidden sm:block w-[200px]">
        <Sidebar />
      </div>
      <div className="w-full sm:max-w-[calc(100%-200px)]">
        <h2 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold mt-4 mb-4">{frontmatter.title}</h2>
        <ContentRender className="lg:!prose-lg" markdocNode={transformedContent} />
      </div>
    </div>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const content = readDocsContent(params.slug);
  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title + " - memos",
    pathname: params.slug?.length > 0 ? `/docs/${params.slug.join("/")}` : "/docs",
  });
};

export const generateStaticParams = () => {
  return [
    { slug: [] },
    ...[...getDocsSlugList()].map((contentSlug) => {
      return { slug: contentSlug };
    }),
  ];
};

const readDocsContent = (contentSlug: string[]) => {
  let filePath = path.resolve("./content/docs/index.md");
  if (Array.isArray(contentSlug) && contentSlug.length !== 0) {
    const indexFilePath = path.resolve(`./content/docs/${contentSlug.join("/")}/index.md`);
    if (fs.existsSync(indexFilePath)) {
      filePath = indexFilePath;
    } else {
      filePath = path.resolve(`./content/docs/${contentSlug.join("/")}.md`);
    }
  }
  const content = fs.readFileSync(filePath, "utf8");
  return content;
};

export default Page;
