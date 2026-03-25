import { BLOG_COLUMN_CLASS } from "@/lib/blog";

interface BlogPostHeroImageProps {
  alt: string;
  src: string;
}

export function BlogPostHeroImage({ alt, src }: BlogPostHeroImageProps) {
  return (
    <div className={`${BLOG_COLUMN_CLASS} mt-10 sm:mt-12`}>
      <img src={src} alt={alt} className="h-56 w-full rounded-2xl object-cover sm:h-72 lg:h-[30rem]" />
    </div>
  );
}
