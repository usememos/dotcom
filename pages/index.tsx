import type { NextPage } from "next";
import Head from "next/head";
import Contributors from "../components/Contributors";
import FeatureMatrix from "../components/FeatureMatrix";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LatestVersion from "../components/LatestVersion";
import SlashBanner from "../components/SlashBanner";
import DemoPlaceholder from "../components/DemoPlaceholder";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="h-full flex flex-col justify-start items-start">
      <Head>
        <title>memos - Easily capture and share your great thoughts</title>
        <link rel="icon" href="/logo.png" />
        <meta
          name="description"
          content="A privacy-first, lightweight note-taking service. Easily capture and share your great thoughts."
          key="desc"
        />
        <meta name="og:title" property="og:title" content="memos - lightweight, self-hosted memo hub. Open Source and Free forever" />
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

      <main className="w-full max-w-6xl h-auto mx-auto flex flex-col justify-start items-start pt-6 pb-16 px-4 sm:px-0">
        <div className="w-full flex flex-col justify-start items-center">
          <LatestVersion />
        </div>
        <div className="w-full flex flex-col justify-center items-center sm:px-16">
          <h2 className="w-full max-w-3xl text-center text-4xl sm:text-6xl font-medium sm:font-bold mt-4 mb-6">
            A privacy-first, lightweight note-taking service
          </h2>
          <h3 className="w-full text-base sm:text-lg text-gray-500 text-center mb-2">Easily capture and share your great thoughts.</h3>
        </div>
        <div className="w-full flex flex-row justify-center items-center space-x-2 py-4">
          <Link target="_blank" href="https://github.com/usememos/memos">
            <img alt="GitHub stars" src="https://img.shields.io/github/stars/usememos/memos?logo=github" />
          </Link>
          <Link target="_blank" href="https://hub.docker.com/r/neosmemo/memos">
            <img alt="Docker" src="https://img.shields.io/docker/pulls/neosmemo/memos.svg?logo=docker" />
          </Link>
          <Link target="_blank" href="https://discord.gg/tfPJa4UmAv">
            <img alt="Discord" src="https://img.shields.io/badge/discord-chat-5865f2?logo=discord" />
          </Link>
        </div>
        <DemoPlaceholder />
        <div className="w-full flex flex-row justify-center items-center">
          <SlashBanner />
        </div>
        <FeatureMatrix />
        <Contributors />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
