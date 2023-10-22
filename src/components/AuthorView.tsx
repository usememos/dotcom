import Link from "next/link";
import { Author } from "../consts/author";
import Icon from "./Icon";

interface Props {
  author: Author;
}

const AuthorView = ({ author }: Props) => {
  return (
    author && (
      <p className="w-full flex flex-row justify-start items-center gap-2 text-sm">
        <span className="text-gray-400 font-mono">Author:</span>
        <span>{author.name}</span>
        {author.email && (
          <Link className="text-gray-400 hover:text-gray-500" href={`mailto:${author.email}`} target="_blank">
            <Icon.Mail className="w-4 h-auto" />
          </Link>
        )}
        {author.url && (
          <Link className="text-gray-400 hover:text-gray-500" href={author.url} target="_blank">
            <Icon.Link className="w-4 h-auto" />
          </Link>
        )}
        {author.github && (
          <Link className="text-gray-400 hover:text-gray-500" href={`https://github.com/${author.github}`} target="_blank">
            <Icon.Github className="w-4 h-auto" />
          </Link>
        )}
        {author.twitter && (
          <Link className="text-gray-400 hover:text-gray-500" href={`https://twitter.com/${author.twitter}`} target="_blank">
            <Icon.Twitter className="w-4 h-auto" />
          </Link>
        )}
        {author.funding && (
          <Link className="text-gray-400 hover:text-gray-500" href={author.funding} target="_blank">
            <Icon.Coffee className="w-4 h-auto" />
          </Link>
        )}
      </p>
    )
  );
};

export default AuthorView;
