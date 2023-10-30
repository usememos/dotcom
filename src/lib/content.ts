import fs from "fs";
import path from "path";

export const getBlogSlugList = (): string[] => {
  const contentSlugList: string[] = [];
  const filePath = path.resolve("./content/blog/");
  const files = fs.readdirSync(filePath);
  for (const file of files) {
    if (file.endsWith(".md")) {
      contentSlugList.push(file.substring(0, file.length - 3));
    }
  }
  return contentSlugList;
};

export const getContentFilePaths = (base: "docs" | "blog" | "changelog" | "legal"): string[] => {
  const filePaths: string[] = [];
  const travelContentSlugList = (subpath: string) => {
    const filePath = path.resolve(`./content/${base}/`, subpath);
    const files = fs.readdirSync(filePath);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const contentSlug = subpath === "" ? [] : subpath.split("/");
        if (file === "index.md") {
          filePaths.push(contentSlug.join("/"));
        } else {
          filePaths.push([...contentSlug, file.substring(0, file.length - 3)].join("/"));
        }
      } else {
        travelContentSlugList(path.join(subpath, file));
      }
    }
  };
  travelContentSlugList("");
  return filePaths;
};

export const getFilePathFromSlugs = (base: "docs" | "blog" | "changelog" | "legal", slugs: string[]) => {
  let filePath = `content/${base}/index.md`;
  if (Array.isArray(slugs) && slugs.length !== 0) {
    const indexFilePath = `content/${base}/${slugs.join("/")}/index.md`;
    if (fs.existsSync(path.resolve("./", indexFilePath))) {
      filePath = indexFilePath;
    } else {
      filePath = `content/${base}/${slugs.join("/")}.md`;
    }
  }
  return filePath;
};

export const readFileContenxt = (filePath: string) => {
  try {
    const content = fs.readFileSync(path.resolve("./", filePath), "utf8");
    return content;
  } catch (error) {
    return null;
  }
};
