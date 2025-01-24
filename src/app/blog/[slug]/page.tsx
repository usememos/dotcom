import { Tag } from "@markdoc/markdoc";
import { Divider } from "@mui/joy";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import AuthorView from "@/components/AuthorView";
import ContentRender from "@/components/ContentRender";
import Icon from "@/components/Icon";
import SectionContainer from "@/components/SectionContainer";
import Subscription from "@/components/Subscription";
import TableOfContent from "@/components/TableOfContent";
import authorList, { Author } from "@/consts/author";
import { getBlogSlugList, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async (props: Props) => {
  const params = await props.params;
  const filePath = getFilePathFromSlugs("blog", params.slug.split("/"));
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter, transformedContent } = markdoc(content);
  const author = authorList.find((author) => author.name === frontmatter.author) as Author;
  if (!transformedContent || !(transformedContent instanceof Tag)) {
    return null;
  }

  const children = transformedContent.children;
  const headings = JSON.parse(
    JSON.stringify(
      children.filter((child) => child instanceof Tag && child.name === "Heading" && [2, 3].includes(child.attributes["level"])),
    ),
  ) as Tag[];

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
            <ContentRender markdocNode={transformedContent} />
            <Divider className="my-12!" />
            <Subscription />
          </div>
          <div className="hidden md:block sticky top-24 h-[calc(100svh-6rem)] w-64 shrink-0">
            <div className="relative w-full h-full overflow-auto py-4 no-scrollbar">
              <TableOfContent headings={headings} />
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
  const filePath = getFilePathFromSlugs("blog", params.slug.split("/"));
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter } = markdoc(content);
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
