import type { NextPage } from "next";
import Head from "next/head";
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
        <img className={styles.logo} src="/logo-full.webp" alt="logo-full" />
        <div className={styles["links-container"]}>
          <a href="https://demo.usememos.com" className={styles.link}>
            Live Demo
          </a>
          <span className={styles["split-point"]}>•</span>
          <a href="https://github.com/usememos/memos" className={styles.link}>
            Source Code
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
