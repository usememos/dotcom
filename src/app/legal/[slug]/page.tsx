import Markdoc from "@markdoc/markdoc";
import fs from "fs";
import { Metadata } from "next";
import path from "path";
import React from "react";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string };
}

const Page = ({ params }: Props) => {
  const content = readLegalContent(params.slug);
  const { frontmatter, transformedContent } = markdoc(content);

  return (
    <>
      <div className="pt-12 w-full mx-auto sm:px-20 prose sm:prose-lg max-w-none prose-a:text-blue-600">
        <h1>{frontmatter.title}</h1>
        {Markdoc.renderers.react(transformedContent, React)}
      </div>
    </>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const content = readLegalContent(params.slug);
  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title + " - memos",
    pathname: `/legal/${params.slug}`,
  });
};

export const generateStaticParams = () => {
  return [
    {
      slug: "privacy-policy",
    },
  ];
};

const readLegalContent = (contentSlug: string) => {
  const filePath = path.resolve(`./content/legal/${contentSlug}.md`);
  const content = fs.readFileSync(filePath, "utf8");
  return content;
};

export default Page;
