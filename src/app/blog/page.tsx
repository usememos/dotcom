import { Divider } from "@mui/joy";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import authorList, { Author } from "@/consts/author";
import { getContentFilePaths, getFilePathFromSlugs, readFileContenxt } from "@/lib/content";
import { markdoc } from "@/markdoc/markdoc";
import { getMetadata } from "@/utils/metadata";

const Page = () => {
  const frontmatters = getBlogFrontmatters();

  return (
    <>
      <div className="w-full max-w-3xl flex flex-col justify-center items-center sm:px-16">
        <h2 className="w-full text-2xl text-center sm:text-4xl font-medium sm:font-bold mt-4">Blogs</h2>
        <h3 className="text-lg mt-4">Get the latest news about memos</h3>
        <div className="mt-12 w-full flex flex-col justify-start items-start gap-8">
          {frontmatters.map((frontmatter, index) => {
            const author = authorList.find((author) => author.name === frontmatter.author) as Author;

            return (
              <>
                <div key={frontmatter.slug} className="w-full flex flex-col justify-start items-start">
                  {frontmatter.feature_image && (
                    <Link className="mb-4 rounded-lg overflow-clip hover:opacity-80 hover:shadow" href={`/blog/${frontmatter.slug}`}>
                      <img src={frontmatter.feature_image} alt="" />
                    </Link>
                  )}
                  <Link className="text-lg !leading-tight sm:text-xl line-clamp-2 hover:text-blue-600" href={`/blog/${frontmatter.slug}`}>
                    {frontmatter.title}
                  </Link>
                  {frontmatter.description && <p className="mt-2 text-gray-400 line-clamp-2">{frontmatter.description}</p>}
                  <div className="mt-2 w-full flex flex-row justify-start items-center text-gray-500">
                    <span>{author.name}</span>
                    <Icon.Dot />
                    <span>{frontmatter.published_at}</span>
                  </div>
                </div>
                {index !== frontmatters.length - 1 && <Divider />}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const metadata = getMetadata({ title: "Blogs - memos", pathname: "/blog" });

const getBlogFrontmatters = () => {
  const filePaths = getContentFilePaths("blog");
  const frontmatters = filePaths
    .map((filePath) => {
      const content = readFileContenxt(getFilePathFromSlugs("blog", filePath.split("/")));
      if (!content) {
        return notFound();
      }

      const { frontmatter } = markdoc(content);
      return {
        ...frontmatter,
        slug: filePath,
      };
    })
    .sort((a, b) => {
      return new Date(a.published_at) > new Date(b.published_at) ? -1 : 1;
    });
  return frontmatters;
};

export default Page;
