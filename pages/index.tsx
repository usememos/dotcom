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
        <link rel="icon" href="/logo.webp" />
        <meta name="description" content="An open-source, self-hosted memo hub with knowledge management and collaboration." />
        <meta property="og:url" content="https://usememos.com/" />
        <meta name="og:title" content="Memos" />
        <meta name="og:description" content="An open-source, self-hosted memo hub with knowledge management and collaboration." />
        <meta property="og:type" content="website" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <img className={styles.logo} src="/logo-full.webp" alt="logo-full" />
          <a
            className="flex flex-row justify-start items-center border px-3 py-1 rounded-full hover:shadow"
            href="https://github.com/usememos/memos"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.GitHub className="w-4 sm:w-5 h-auto text-gray-600" />
            <span className="text-sm sm:text-lg ml-1">Source Code</span>
          </a>
        </div>
        <div className={styles["shields-container"]}>
          <a target="_blank" href="https://github.com/usememos/memos" rel="noreferrer">
            <img alt="GitHub stars" src="https://img.shields.io/github/stars/usememos/memos?style=social&logo=github" />
          </a>
          <a target="_blank" href="https://github.com/usememos/memos" rel="noreferrer">
            <img alt="GitHub stars" src="https://img.shields.io/docker/pulls/neosmemo/memos.svg?style=social&logo=docker" />
          </a>
        </div>
        <div className={styles["links-container"]}>
          <a href="https://demo.usememos.com" className={styles.link}>
            Live Demo
          </a>
          <span className={styles["split-point"]}>•</span>
          <a href="https://t.me/+-_tNF1k70UU4ZTc9" className={styles.link}>
            Discuss in Telegram 👾
          </a>
        </div>
        <p className={styles.description}>An open-source, self-hosted memo hub with knowledge management and collaboration.</p>
        <img className={styles["demo-img"]} src="/demo.png" alt="logo-full" />
        <ThirdParty />
      </main>
    </div>
  );
};

export default Home;
