import { Divider } from "@mui/joy";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import ContentRender from "@/components/ContentRender";
import SectionContainer from "@/components/SectionContainer";
import Subscription from "@/components/Subscription";
import { getContentFilePaths, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: Promise<{ slug: string[] }>;
}

const Page = async (props: Props) => {
  const params = await props.params;
  const filePath = getFilePathFromSlugs("changelog", params.slug);
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter, transformedContent } = markdoc(content);

  return (
    <SectionContainer>
      <div className="w-full mx-auto sm:px-4">
        <h1 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold my-6">{frontmatter.title}</h1>
        <ContentRender className="markdown-body" markdocNode={transformedContent} />
        <Divider className="!my-12" />
        <Subscription />
      </div>
    </SectionContainer>
  );
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
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
