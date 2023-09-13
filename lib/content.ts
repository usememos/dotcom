import fs from "fs";
import path from "path";

export const getDocsSlugList = (): string[][] => {
  const contentSlugList: string[][] = [];
  const travelContentSlugList = (subpath: string) => {
    const filePath = path.resolve("./content/docs/", subpath);
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const contentSlug = subpath === "" ? [] : subpath.split("/");
        if (file === "index.md") {
          contentSlugList.push(contentSlug);
        } else {
          contentSlugList.push([...contentSlug, file.substring(0, file.length - 3)]);
        }
      } else {
        travelContentSlugList(path.join(subpath, file));
      }
    }
  };
  travelContentSlugList("");
  return contentSlugList;
};

export const getBlogSlugList = (): string[][] => {
  const contentSlugList: string[][] = [];
  const travelContentSlugList = (subpath: string) => {
    const filePath = path.resolve("./content/blog/", subpath);
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const contentSlug = subpath === "" ? [] : subpath.split("/");
        if (file === "index.md") {
          contentSlugList.push(contentSlug);
        } else {
          contentSlugList.push([...contentSlug, file.substring(0, file.length - 3)]);
        }
      } else {
        travelContentSlugList(path.join(subpath, file));
      }
    }
  };
  travelContentSlugList("");
  return contentSlugList;
};
