import Markdoc from "@markdoc/markdoc";
import fs from "fs";
import path from "path";
import React from "react";
import AuthorView from "@/components/AuthorView";
import authorList from "@/consts/author";
import { getBlogSlugList } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";

const Page = ({ params }: { params: { slug: string[] } }) => {
  const content = readBlogContent(params.slug);
  const { frontmatter, transformedContent } = markdoc(content);
  const author = authorList.find((author) => author.name === frontmatter.author);

  return (
    <>
      <div className="pt-12 w-full mx-auto sm:px-20 prose prose-lg max-w-none prose-a:text-blue-600">
        <h1>{frontmatter.title}</h1>
        {author && <AuthorView author={author} />}
        {Markdoc.renderers.react(transformedContent, React)}
      </div>
    </>
  );
};

export const generateStaticParams = () => {
  return [
    { slug: [] },
    ...[...getBlogSlugList()].map((contentSlug) => {
      return { slug: contentSlug };
    }),
  ];
};

const readBlogContent = (contentSlug: string[]) => {
  let filePath = path.resolve("./content/blog/index.md");
  if (Array.isArray(contentSlug) && contentSlug.length !== 0) {
    const indexFilePath = path.resolve(`./content/blog/${contentSlug.join("/")}/index.md`);
    if (fs.existsSync(indexFilePath)) {
      filePath = indexFilePath;
    } else {
      filePath = path.resolve(`./content/blog/${contentSlug.join("/")}.md`);
    }
  }
  const content = fs.readFileSync(filePath, "utf8");
  return content;
};

export default Page;
