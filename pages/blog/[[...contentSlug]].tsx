import Markdoc from "@markdoc/markdoc";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import React from "react";
import { markdoc } from "../../markdoc/markdoc";
import authorList from "../../consts/author";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import AuthorView from "../../components/AuthorView";
import { Frontmatter } from "../../types/content";

const Blog = (props: { content: string }) => {
  const { frontmatter, transformedContent } = markdoc<Frontmatter>(props.content);
  const author = authorList.find((author) => author.name === frontmatter.author);

  return (
    <div className="h-full flex flex-col justify-start items-start px-4 sm:px-0">
      <Head>
        <title>{frontmatter.title} - memos</title>
        <link rel="icon" href="/logo.webp" />
        <meta name="description" content="An open-source, self-hosted memo hub with knowledge management and social networking." />
        <meta property="og:url" content="https://usememos.com/" />
        <meta name="og:title" content="memos" />
        <meta name="og:description" content="An open-source, self-hosted memo hub with knowledge management and social networking." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Head>

      <Header />

      <main className="w-full max-w-4xl h-auto grow mx-auto flex flex-col justify-start items-start sm:px-24 pt-4 pb-24">
        <div className="pt-12 w-full mx-auto prose prose-neutral">
          <h1>{frontmatter.title}</h1>
          {author && <AuthorView author={author} />}
          {Markdoc.renderers.react(transformedContent, React)}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const getContentSlugList = (): string[][] => {
  const contentSlugList: string[][] = [];
  const travelContentSlugList = (subpath: string) => {
    const filePath = path.resolve("./content/blog/", subpath);
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const contentSlug = subpath === "" ? [] : subpath.split("/");
        if (file === "index.md") {
          contentSlugList.push(contentSlug);
        } else {
          contentSlugList.push([...contentSlug, file.substring(0, file.length - 3)]);
        }
      } else {
        travelContentSlugList(path.join(subpath, file));
      }
    }
  };
  travelContentSlugList("");
  return contentSlugList;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { contentSlug: [] } },
      ...getContentSlugList().map((contentSlug) => {
        return { params: { contentSlug: contentSlug } };
      }),
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const contentSlug = params!.contentSlug as string[];
  let filePath = path.resolve("./content/blog/index.md");
  if (Array.isArray(contentSlug) && contentSlug.length !== 0) {
    const indexFilePath = path.resolve(`./content/blog/${contentSlug.join("/")}/index.md`);
    if (fs.existsSync(indexFilePath)) {
      filePath = indexFilePath;
    } else {
      filePath = path.resolve(`./content/blog/${contentSlug.join("/")}.md`);
    }
  }
  const content = fs.readFileSync(filePath, "utf8");

  return {
    props: {
      content: content,
    },
  };
};

export default Blog;
