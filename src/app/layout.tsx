import { Analytics } from "@vercel/analytics/react";
import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/global.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="w-full h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <title>memos - Easily capture and share your great thoughts</title>
        <link rel="icon" href="/logo.ico" />
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
      </head>
      <body className="flex flex-col w-full h-full">
        <div className="relative w-full flex flex-col">
          <Header />

          <main className="relative shrink-0 grow basis-auto mx-auto pt-6 pb-16 px-4 w-full max-w-6xl flex flex-col justify-start items-center">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <script async src="https://analytics.eu.umami.is/script.js" data-website-id="b6e36293-961b-43eb-af79-d7da00f27707"></script>
      </body>
    </html>
  );
};

export default RootLayout;
