import Markdoc from "@markdoc/markdoc";
import { Metadata } from "next";
import React from "react";
import { getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string };
}

const Page = ({ params }: Props) => {
  const filePath = getFilePathFromSlugs("legal", params.slug.split("/"));
  const content = readFileContenxt(filePath);
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
  const filePath = getFilePathFromSlugs("legal", params.slug.split("/"));
  const content = readFileContenxt(filePath);
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

export default Page;
