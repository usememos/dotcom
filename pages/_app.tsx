import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
      <script defer data-domain="usememos.com" src="https://plausible.io/js/script.js"></script>
    </>
  );
}

export default MyApp;
