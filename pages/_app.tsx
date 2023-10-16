import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
      <script async src="https://analytics.eu.umami.is/script.js" data-website-id="b6e36293-961b-43eb-af79-d7da00f27707"></script>
    </>
  );
}

export default MyApp;
