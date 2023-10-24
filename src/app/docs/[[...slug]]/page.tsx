import Markdoc from "@markdoc/markdoc";
import fs from "fs";
import { Metadata } from "next";
import path from "path";
import React from "react";
import AuthorView from "@/components/AuthorView";
import authorList from "@/consts/author";
import { getDocsSlugList } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string[] };
}

const Page = ({ params }: Props) => {
  const content = readDocsContent(params.slug);
  const { frontmatter, transformedContent } = markdoc(content);
  const author = authorList.find((author) => author.name === frontmatter.author);

  return (
    <>
      <div className="pt-12 w-full mx-auto sm:px-20 prose sm:prose-lg max-w-none prose-a:text-blue-600">
        <h1>{frontmatter.title}</h1>
        {author && <AuthorView author={author} />}
        {Markdoc.renderers.react(transformedContent, React)}
      </div>
    </>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const content = readDocsContent(params.slug);
  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title,
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
