import { Divider } from "@mui/joy";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import ContentRender from "@/components/ContentRender";
import Subscription from "@/components/Subscription";
import { getContentFilePaths, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string[] };
}

const Page = ({ params }: Props) => {
  const filePath = getFilePathFromSlugs("changelog", params.slug);
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter, transformedContent } = markdoc(content);

  return (
    <div className="w-full max-w-4xl sm:px-6">
      <h2 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold mt-4 mb-4">{frontmatter.title}</h2>
      <ContentRender markdocNode={transformedContent} />
      <Divider className="my-12" />
      <Subscription />
    </div>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const filePath = getFilePathFromSlugs("changelog", params.slug);
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title + " - Memos",
    pathname: params.slug?.length > 0 ? `/changelog/${params.slug.join("/")}` : "/changelog",
  });
};

export const generateStaticParams = () => {
  const filePaths = getContentFilePaths("changelog");
  return [
    { slug: [] },
    ...[...filePaths.map((filePath) => filePath.split("/"))].map((contentSlug) => {
      return { slug: contentSlug };
    }),
  ];
};

export default Page;
