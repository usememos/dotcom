import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import AuthorView from "@/components/AuthorView";
import ContentRender from "@/components/ContentRender";
import Icon from "@/components/Icon";
import authorList, { Author } from "@/consts/author";
import { getBlogSlugList, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string };
}

const Page = ({ params }: Props) => {
  const filePath = getFilePathFromSlugs("blog", params.slug.split("/"));
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter, transformedContent } = markdoc(content);
  const author = authorList.find((author) => author.name === frontmatter.author) as Author;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto sm:px-6">
        {frontmatter.feature_image && (
          <div className="w-full mb-6 sm:mb-12">
            <img className="w-full h-auto rounded-lg" src={frontmatter.feature_image} alt="" />
          </div>
        )}
        <h2 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold mt-4 mb-4">{frontmatter.title}</h2>
        <div className="mt-8 w-full flex flex-row justify-start items-center">
          <span className="text-gray-500">{frontmatter.published_at}</span>
          <Icon.Dot className="w-4 h-auto mx-1 text-gray-400" />
          <AuthorView author={author} />
        </div>
        <ContentRender markdocNode={transformedContent} />
      </div>
    </>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const filePath = getFilePathFromSlugs("blog", params.slug.split("/"));
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title + " - memos",
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
