import { GetServerSideProps } from "next";
import { FEATURE_LIST } from "../components/FeatureMatrix";
import { getBlogSlugList, getDocsSlugList } from "../lib/content";

const DOMAIN_NAME = "https://usememos.com";

const generateSiteMapForFeatures = () => {
  return FEATURE_LIST.map((feature) => {
    return `
    <url>
      <loc>${DOMAIN_NAME}/feature/${feature.slug}</loc>
    </url>`;
  });
};

const generateSiteMapForDocs = () => {
  return getDocsSlugList().map((contentSlug) => {
    return `
    <url>
      <loc>${DOMAIN_NAME}/docs/${contentSlug.join("/")}</loc>
    </url>`;
  });
};

const generateSiteMapForBlog = () => {
  return getBlogSlugList().map((contentSlug) => {
    return `
    <url>
      <loc>${DOMAIN_NAME}/blog/${contentSlug.join("/")}</loc>
    </url>`;
  });
};

const generateSiteMap = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${DOMAIN_NAME}</loc>
      </url>
      ${generateSiteMapForFeatures().join("")}
      ${generateSiteMapForDocs().join("")}
      ${generateSiteMapForBlog().join("")}
   </urlset>
 `;
};

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sitemap = generateSiteMap();
  context.res.setHeader("Content-Type", "text/xml");
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
};

export default SiteMap;
