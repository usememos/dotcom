import type { NextPage } from "next";
import Head from "next/head";
import Contributors from "../components/Contributors";
import FeatureMatrix from "../components/FeatureMatrix";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LatestVersion from "../components/LatestVersion";
import ShortifyBanner from "../components/ShortifyBanner";

const Home: NextPage = () => {
  return (
    <div className="h-full flex flex-col justify-start items-start px-4 sm:px-0">
      <Head>
        <title>memos - lightweight, self-hosted memo hub. Open Source and Free forever</title>
        <link rel="icon" href="/logo.webp" />
        <meta name="description" content="A lightweight, self-hosted memo hub. Open Source and Free forever" key="desc" />
        <meta name="og:title" property="og:title" content="memos - lightweight, self-hosted memo hub. Open Source and Free forever" />
        <meta name="og:description" content="A lightweight, self-hosted memo hub. Open Source and Free forever" />
        <meta name="og:type" property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="og:url" property="og:url" content="https://usememos.com" />
      </Head>

      <Header />

      <h1 className="sr-only">memos - your personal memo hub</h1>

      <main className="w-full max-w-4xl h-auto mx-auto flex flex-col justify-start items-start pt-4 pb-16">
        <div className="w-full flex flex-col justify-start items-center">
          <LatestVersion />
          <img className="h-24 sm:h-32 w-auto rounded-lg" src="/logo.webp" alt="memos-logo" />
        </div>
        <div className="w-full flex flex-col justify-center items-center sm:px-16">
          <h2 className="w-full text-center text-4xl sm:text-6xl font-bold mt-4 mb-4">
            A lightweight, self-hosted memo hub. Open Source and Free forever.
          </h2>
          <h3 className="w-full text-base sm:text-lg text-gray-500 text-center mb-2">
            memos provides the privacy, security, and reliability that <br className="hidden sm:block" />
            innovators need in their moments of inspiration.
          </h3>
        </div>
        <div className="w-full flex flex-row justify-center items-center space-x-2 py-4">
          <a target="_blank" href="https://github.com/usememos/memos">
            <img alt="GitHub stars" src="https://img.shields.io/github/stars/usememos/memos?logo=github" />
          </a>
          <a target="_blank" href="https://hub.docker.com/r/neosmemo/memos">
            <img alt="Docker" src="https://img.shields.io/docker/pulls/neosmemo/memos.svg?logo=docker" />
          </a>
          <a target="_blank" href="https://discord.gg/tfPJa4UmAv">
            <img alt="Discord" src="https://img.shields.io/badge/discord-chat-5865f2?logo=discord" />
          </a>
        </div>
        <div className="w-full flex flex-row justify-center items-center space-x-2">
          <a href="https://demo.usememos.com" target="_blank" className="text-blue-600 leading-6 text-base hover:underline">
            Live Demo
          </a>
          <span className="block mx-2">•</span>
          <a href="https://discord.gg/tfPJa4UmAv" target="_blank" className="text-blue-600 leading-6 text-base hover:underline">
            Discuss in Discord 🙋
          </a>
        </div>
        <div className="w-full flex flex-row justify-center items-center">
          <ShortifyBanner />
        </div>
        <img className="w-full h-auto mt-2 mb-2" src="/demo.webp" alt="demo-screenshot" />
        <FeatureMatrix />
        <Contributors />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
