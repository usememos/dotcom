import type { NextPage } from "next";
import Head from "next/head";
import Icon from "../components/Icon";
import ThirdParty from "../components/ThirdParty";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles["page-wrapper"]}>
      <Head>
        <title>Memos</title>
        <link rel="icon" href="/logo.png" />
        <meta name="description" content="An open-source, self-hosted memo hub with knowledge management and socialization." />
        <meta property="og:url" content="https://usememos.com/" />
        <meta name="og:title" content="Memos" />
        <meta name="og:description" content="An open-source, self-hosted memo hub with knowledge management and socialization." />
        <meta property="og:type" content="website" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <img className={styles.logo} src="/logo-full.png" alt="logo-full" />
          <a
            className="flex flex-row justify-start items-center border px-3 py-1 rounded-full hover:shadow"
            href="https://github.com/usememos/memos"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.GitHub className="w-4 h-auto text-gray-600" />
            <span className="text-sm sm:text-base ml-1">Source Code</span>
          </a>
        </div>
        <div className={styles["shields-container"]}>
          <a target="_blank" href="https://github.com/usememos/memos" rel="noreferrer">
            <img alt="GitHub stars" src="https://img.shields.io/github/stars/usememos/memos?style=social&logo=github" />
          </a>
          <a target="_blank" href="https://hub.docker.com/r/neosmemo/memos" rel="noreferrer">
            <img alt="Docker" src="https://img.shields.io/docker/pulls/neosmemo/memos.svg?style=social&logo=docker" />
          </a>
          <a target="_blank" href="https://discord.gg/tfPJa4UmAv" rel="noreferrer">
            <img alt="Discord" src="https://img.shields.io/badge/discord-chat-5865f2?logo=discord&style=social" />
          </a>
        </div>
        <div className={styles["links-container"]}>
          <a href="https://demo.usememos.com" className={styles.link}>
            Live Demo
          </a>
          <span className={styles["split-point"]}>•</span>
          <a href="https://discord.gg/tfPJa4UmAv" className={styles.link}>
            Discuss in Discord 🏂
          </a>
        </div>
        <p className={styles.description}>An open-source, self-hosted memo hub with knowledge management and socialization.</p>
        <img className={styles["demo-img"]} src="/demo.png" alt="logo-full" />
        <ThirdParty />
      </main>
    </div>
  );
};

export default Home;
