import { SpeedInsights } from "@vercel/speed-insights/next";
import type React from "react";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PostHogPageview } from "@/components/PosthogProvider";
import "@/styles/global.css";
import { getMetadata } from "@/utils/metadata";
import { fontLoader } from "./fonts";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={fontLoader()}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <link rel="icon" href="/logo-rounded.png" type="image/png" />
      </head>
      <body>
        <div className="relative w-full min-h-[100svh] flex flex-col bg-white">
          <Header />
          <main className="shrink-0 grow basis-auto mx-auto pt-6 pb-16 px-6 w-full max-w-7xl flex flex-col justify-start items-center">
            {children}
          </main>
          <Footer />
        </div>
        <SpeedInsights />
        <Suspense>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  );
};

export const metadata = getMetadata({});

export default RootLayout;
