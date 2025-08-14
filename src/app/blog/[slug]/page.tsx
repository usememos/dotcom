import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import AuthorView from "@/components/AuthorView";
import Icon from "@/components/Icon";
import MdxRenderer from "@/components/MdxRenderer";
import SectionContainer from "@/components/SectionContainer";
import authorList, { Author } from "@/consts/author";
import { getBlogSlugList, getMdxFilePathFromSlugs, readMdxFileContent } from "@/lib/mdx-content";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async (props: Props) => {
  const params = await props.params;
  const filePath = getMdxFilePathFromSlugs("blog", params.slug.split("/"));
  const contentItem = readMdxFileContent(filePath);

  if (!contentItem) {
    return notFound();
  }

  const { frontmatter, content } = contentItem;
  const author = authorList.find((author) => author.name === frontmatter.author) as Author;

  return (
    <SectionContainer>
      <div className="w-full">
        <div className="w-full sm:px-6">
          <h1 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold mt-4 sm:mt-8">{frontmatter.title}</h1>
          <div className="mt-4 w-full flex flex-row justify-start items-center">
            <span className="text-gray-500">{frontmatter.published_at}</span>
            <Icon.Dot className="w-4 h-auto mx-1 text-gray-400" />
            <AuthorView author={author} />
          </div>
        </div>
        <div className="w-full flex flex-row justify-start items-start sm:px-6 md:gap-8 mt-4 sm:mt-8">
          <div className="w-full md:max-w-[calc(100%-16rem)]">
            <MdxRenderer content={content} />
          </div>
          <div className="hidden md:block sticky top-24 h-[calc(100svh-6rem)] w-64 shrink-0">
            <div className="relative w-full h-full overflow-auto py-4 no-scrollbar">
              {/* TODO: Extract headings from MDX content for table of contents */}
            </div>
            <div className="absolute top-0 left-0 w-full h-8 bg-linear-to-t from-transparent to-white"></div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-linear-to-b from-transparent to-white"></div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const filePath = getMdxFilePathFromSlugs("blog", params.slug.split("/"));
  const contentItem = readMdxFileContent(filePath);

  if (!contentItem) {
    return notFound();
  }

  const { frontmatter } = contentItem;
  return getMetadata({
    title: frontmatter.title + " - Memos",
    pathname: `/blog/${params.slug}`,
    description: frontmatter.description,
    imagePath: frontmatter.feature_image,
  });
};

export const generateStaticParams = () => {
  return getBlogSlugList().map((contentSlug) => {
    return { slug: contentSlug };
  });
};

export default Page;
