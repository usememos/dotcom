import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Banner = ({ text, url }: { text: string; url: string }) => {
  return (
    <div className="relative w-full bg-blue-600 text-white">
      <Link className="mx-auto flex w-full items-center justify-center px-4 py-2 hover:opacity-80" href={url}>
        <p className="text-center text-sm font-medium leading-tight line-clamp-1 md:text-base">{text}</p>
        <ArrowRight className="ml-2 h-4 w-auto shrink-0" />
      </Link>
    </div>
  );
};

export default Banner;
