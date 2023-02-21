import Markdoc from "@markdoc/markdoc";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import React from "react";
import yaml from "js-yaml";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

interface Frontmatter {
  title: string;
}

const Docs = (props: { content: string }) => {
  const markDocAst = Markdoc.parse(props.content);
  const frontmatter = (markDocAst.attributes.frontmatter ? yaml.load(markDocAst.attributes.frontmatter) : {}) as Frontmatter;
  const transformedContent = Markdoc.transform(markDocAst);

  return (
    <div className="px-4 sm:px-0 bg-zinc-100">
      <Head>
        <title>{frontmatter.title} - memos</title>
        <link rel="icon" href="/logo.png" />
        <meta name="description" content="An open-source, self-hosted memo hub with knowledge management and social networking." />
        <meta property="og:url" content="https://usememos.com/" />
        <meta name="og:title" content="memos" />
        <meta name="og:description" content="An open-source, self-hosted memo hub with knowledge management and social networking." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Head>

      <Header />

      <main className="min-h-screen w-full max-w-4xl mx-auto flex flex-col justify-start items-start pt-4 pb-16">
        <div className="pt-12 w-full mx-auto prose prose-neutral">
          <h1>{frontmatter.title}</h1>
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
    const filePath = path.resolve("./content/docs/", subpath);
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const contentSlug = subpath === "" ? [] : subpath.split("/");
        contentSlugList.push([...contentSlug, file.substring(0, file.length - 3)]);
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
    paths: getContentSlugList().map((contentSlug) => {
      return { params: { contentSlug: contentSlug } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const contentSlug = params!.contentSlug as string[];
  const filePath = path.resolve(`./content/docs/${contentSlug.join("/")}.md`);
  const content = fs.readFileSync(filePath, "utf8");

  return {
    props: {
      content: content,
    },
  };
};

export default Docs;
