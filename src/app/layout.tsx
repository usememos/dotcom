import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/global.css";
import { getMetadata } from "@/utils/metadata";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        <div className="relative w-full flex flex-col">
          <Header />

          <main className="relative shrink-0 grow basis-auto mx-auto pt-6 pb-16 px-6 w-full max-w-6xl flex flex-col justify-start items-center">
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

export const metadata: Metadata = getMetadata({});

export default RootLayout;
