import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import SectionContainer from "@/components/SectionContainer";
import Subscription from "@/components/Subscription";
import { getContentFilePaths, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

const Page = () => {
  const frontmatters = getBlogFrontmatters();

  return (
    <SectionContainer>
      <div className="w-full mx-auto py-2 sm:px-4 flex flex-col justify-start items-start">
        <h2 className="w-full text-start text-5xl sm:text-6xl font-medium sm:font-bold mt-4">Blogs</h2>
        <h3 className="text-xl mt-4 leading-normal text-gray-500">Get the latest articles from Memos</h3>
        <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {frontmatters.map((frontmatter) => {
            return (
              <React.Fragment key={frontmatter.slug}>
                <div className="w-full bg-white p-4 border rounded-2xl flex flex-row justify-start items-start gap-x-4 hover:shadow-sm">
                  <div className="flex flex-1 flex-col sm:p-2 justify-start items-start">
                    {frontmatter.feature_image && (
                      <Link
                        className="w-full sm:hidden mb-4 shrink-0 rounded-lg overflow-clip hover:opacity-80 hover:shadow-sm"
                        href={`/blog/${frontmatter.slug}`}
                      >
                        <img src={frontmatter.feature_image} alt="" />
                      </Link>
                    )}
                    <Link className="text-lg leading-tight! sm:text-xl line-clamp-2 hover:text-teal-600" href={`/blog/${frontmatter.slug}`}>
                      {frontmatter.title}
                    </Link>
                    {frontmatter.description && <p className="mt-2 text-gray-400 line-clamp-3 leading-snug">{frontmatter.description}</p>}
                  </div>
                  {frontmatter.feature_image && (
                    <Link
                      className="hidden sm:block shrink-0 rounded-lg overflow-clip hover:opacity-80 hover:shadow-sm"
                      href={`/blog/${frontmatter.slug}`}
                    >
                      <img className="w-60" src={frontmatter.feature_image} alt="" />
                    </Link>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <Subscription className="mt-6" />
      </div>
    </SectionContainer>
  );
};

export const metadata = getMetadata({ title: "Blog - Memos", pathname: "/blog" });

const getBlogFrontmatters = () => {
  const filePaths = getContentFilePaths("blog");
  const frontmatters = filePaths
    .map((filePath) => {
      const content = readFileContenxt(getFilePathFromSlugs("blog", filePath.split("/")));
      if (!content) {
        return notFound();
      }

      const { frontmatter } = markdoc(content);
      return {
        ...frontmatter,
        slug: filePath,
      };
    })
    .sort((a, b) => {
      return new Date(a.published_at) > new Date(b.published_at) ? -1 : 1;
    });
  return frontmatters;
};

export default Page;
