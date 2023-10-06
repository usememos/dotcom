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
import { getBlogSlugList } from "../../lib/content";

const Blog = (props: { content: string }) => {
  const { frontmatter, transformedContent } = markdoc<Frontmatter>(props.content);
  const author = authorList.find((author) => author.name === frontmatter.author);

  return (
    <div className="h-full flex flex-col justify-start items-start">
      <Head>
        <title>{`${frontmatter.title} | memos`}</title>
        <meta
          name="description"
          content="A privacy-first, lightweight note-taking service. Easily capture and share your great thoughts."
          key="desc"
        />
        <meta name="og:title" property="og:title" content="memos - Easily capture and share your great thoughts." />
        <meta
          name="og:description"
          content="A privacy-first, lightweight note-taking service. Easily capture and share your great thoughts."
        />
        <meta name="og:type" property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="og:url" property="og:url" content="https://usememos.com" />
      </Head>

      <Header />

      <h1 className="sr-only">memos - Easily capture and share your great thoughts.</h1>

      <main className="w-full max-w-6xl h-auto grow mx-auto flex flex-col justify-start items-start px-4 sm:px-24 pt-4 pb-24">
        <div className="pt-12 w-full mx-auto prose prose-neutral hover:prose-a:text-blue-500">
          <h1>{frontmatter.title}</h1>
          {author && <AuthorView author={author} />}
          {Markdoc.renderers.react(transformedContent, React)}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { contentSlug: [] } },
      ...getBlogSlugList().map((contentSlug) => {
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
