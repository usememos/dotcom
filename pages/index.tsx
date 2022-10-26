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
        <meta name="description" content="Open source knowledge base in 1 file." />
        <link rel="icon" href="/logo.webp" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <img className={styles.logo} src="/logo-full.webp" alt="logo-full" />
          <a className="flex flex-row justify-start items-center" target="_blank" href="https://github.com/usememos/memos" rel="noreferrer">
            <Icon.GitHub />
            <span className="hidden sm:block ml-1">Open Source</span>
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
        <p className={styles.description}>An open source, self-hosted knowledge base that works with a SQLite db file.</p>
        <img className={styles["demo-img"]} src="/demo.png" alt="logo-full" />
        <ThirdParty />
      </main>
    </div>
  );
};

export default Home;
