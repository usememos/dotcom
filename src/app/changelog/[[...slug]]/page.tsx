import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import MdxRenderer from "@/components/MdxRenderer";
import SectionContainer from "@/components/SectionContainer";
import { getContentFilePaths, getMdxFilePathFromSlugs, readMdxFileContent } from "@/lib/mdx-content";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: Promise<{ slug: string[] }>;
}

const Page = async (props: Props) => {
  const params = await props.params;
  const filePath = getMdxFilePathFromSlugs("changelog", params.slug);
  const contentItem = readMdxFileContent(filePath);

  if (!contentItem) {
    return notFound();
  }

  const { frontmatter, content } = contentItem;

  return (
    <SectionContainer>
      <div className="w-full mx-auto sm:px-4">
        <h1 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold my-6">{frontmatter.title}</h1>
        <MdxRenderer content={content} />
      </div>
    </SectionContainer>
  );
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const filePath = getMdxFilePathFromSlugs("changelog", params.slug);
  const contentItem = readMdxFileContent(filePath);

  if (!contentItem) {
    return notFound();
  }

  const { frontmatter } = contentItem;
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
