import { Metadata } from "next";

interface LocalMetadata {
  title: string;
  description: string;
  pathname: string;
  imagePath: string;
}

export const getMetadata = (metadata: Partial<LocalMetadata>): Metadata => {
  const title = metadata.title || "Memos - Open Source, Self-hosted, Your Notes, Your Way";
  const description =
    metadata.description ||
    "A privacy-first, lightweight note-taking application that allows you to effortlessly capture and share your ideas.";
  const url = metadata.pathname || "";
  const imagePath = metadata.imagePath || "/logo-rounded.png";
  const hasFeatureImage = !!metadata.imagePath;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: url,
      images: [
        {
          url: imagePath,
          alt: "Memos",
        },
      ],
    },
    twitter: {
      card: hasFeatureImage ? "summary_large_image" : "summary",
    },
    metadataBase: new URL("https://www.usememos.com"),
    icons: {
      icon: "/logo-rounded.png",
      apple: [
        { url: "/favicon/favicon.png" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon/favicon-128x128.png", sizes: "128x128", type: "image/png" },
        { url: "/favicon/favicon-256x256.png", sizes: "256x256", type: "image/png" },
        { url: "/favicon/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
  };
};
