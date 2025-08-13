import type React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/global.css";
import { getMetadata } from "@/utils/metadata";
import { fontLoader } from "./fonts";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={fontLoader()}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4774626535817335"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-4774626535817335" />
        <meta name="theme-color" content="#0f766e" />
        <link rel="icon" href="/logo-rounded.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Memos",
              description:
                "A privacy-first, lightweight note-taking solution that allows you to effortlessly capture and share your ideas.",
              url: "https://www.usememos.com",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web, Docker, Linux, macOS, Windows",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "Memos",
                url: "https://www.usememos.com",
              },
              sameAs: ["https://github.com/usememos/memos"],
            }),
          }}
        />
      </head>
      <body>
        <div className="relative w-full min-h-[100svh] flex flex-col bg-white">
          <Header />
          <main className="shrink-0 grow basis-auto mx-auto pt-6 pb-16 w-full flex flex-col justify-start items-center">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export const metadata = getMetadata({});

export default RootLayout;
