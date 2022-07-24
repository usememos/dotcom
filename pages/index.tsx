import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  console.log("styles", styles);
  return (
    <div className={styles["page-wrapper"]}>
      <Head>
        <title>Memos</title>
        <meta name="description" content="usememos/memos" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>memos</h1>

        <p className={styles.description}>
          An open source, self-hosted knowledge base <br /> that works with a SQLite db file.
        </p>

        <ul className={styles["links-container"]}>
          <li>
            <a href="https://demo.usememos.com" className={styles.link}>
              Live Demo
            </a>
          </li>
          <li>
            <a href="https://github.com/usememos/memos" className={styles.link}>
              Source Code
            </a>
          </li>
          <li>
            <a href="https://t.me/+-_tNF1k70UU4ZTc9" className={styles.link}>
              Discuss in Telegram 👾
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default Home;
