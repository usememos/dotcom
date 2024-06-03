import { Tag } from "@markdoc/markdoc";
import { Button, Divider } from "@mui/joy";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ContentRender from "@/components/ContentRender";
import Icon from "@/components/Icon";
import TableOfContent from "@/components/TableOfContent";
import { GITHUB_REPO_LINK } from "@/consts/common";
import { getContentFilePaths, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";
import Navigation, { NavigationMobileMenu } from "./navigation";

const Subscription = dynamic(() => import("@/components/Subscription"), {
  ssr: false,
});

interface Props {
  params: { slug: string[] };
}

const Page = ({ params }: Props) => {
  const filePath = getFilePathFromSlugs("docs", params.slug);
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter, transformedContent } = markdoc(content);
  const remoteFilePath = `${GITHUB_REPO_LINK}/blob/main/${filePath}`;
  if (!transformedContent || !(transformedContent instanceof Tag)) {
    return null;
  }

  const children = transformedContent.children;
  const headings = JSON.parse(
    JSON.stringify(children.filter((child) => child instanceof Tag && (child.name === "h2" || child.name === "h3"))),
  ) as Tag[];

  return (
    <div className="w-full flex flex-row justify-start items-start sm:px-6 sm:gap-6">
      <div className="hidden sm:block sticky top-24 h-[calc(100svh-6rem)] w-40 shrink-0">
        <div className="relative w-full h-full overflow-auto py-4 no-scrollbar">
          <Navigation />
        </div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-t from-transparent to-white pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
      </div>
      <div className="w-full sm:max-w-[calc(100%-10rem)] lg:max-w-[calc(100%-20rem)] sm:px-4">
        <div className="block sm:hidden w-full">
          <NavigationMobileMenu />
        </div>
        <h1 className="w-full text-3xl sm:text-5xl font-medium sm:font-bold my-6">{frontmatter.title}</h1>
        <ContentRender className="markdown-body" markdocNode={transformedContent} />
        <div className="mt-12">
          <Button size="sm" variant="outlined" color="neutral" startDecorator={<Icon.Edit className="w-4 h-auto" />}>
            <Link href={remoteFilePath} target="_blank">
              Edit this page
            </Link>
          </Button>
        </div>
        <Divider className="!my-12" />
        <Subscription />
      </div>
      <div className="hidden lg:block sticky top-24 h-[calc(100svh-6rem)] w-40 shrink-0">
        <div className="relative w-full h-full overflow-auto py-4 no-scrollbar">
          <TableOfContent headings={headings} />
        </div>
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-t from-transparent to-white"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-white"></div>
      </div>
    </div>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const filePath = getFilePathFromSlugs("docs", params.slug);
  const content = readFileContenxt(filePath);
  if (!content) {
    return notFound();
  }

  const { frontmatter } = markdoc(content);
  return getMetadata({
    title: frontmatter.title + " - Memos",
    pathname: params.slug?.length > 0 ? `/docs/${params.slug.join("/")}` : "/docs",
  });
};

export const generateStaticParams = () => {
  const filePaths = getContentFilePaths("docs");
  return [
    { slug: [] },
    ...[...filePaths.map((filePath) => filePath.split("/"))].map((contentSlug) => {
      return { slug: contentSlug };
    }),
  ];
};

export default Page;
