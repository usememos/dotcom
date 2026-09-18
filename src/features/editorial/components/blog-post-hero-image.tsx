import { BLOG_COLUMN_CLASS } from "@/features/editorial/lib/blog";

interface BlogPostHeroImageProps {
  alt: string;
  src: string;
}

export function BlogPostHeroImage({ alt, src }: BlogPostHeroImageProps) {
  return (
    <div className={`${BLOG_COLUMN_CLASS} mt-10 sm:mt-12`}>
      {/* The largest element on the post, so it is the LCP candidate: request it
          ahead of other images. The box height is fixed by CSS, so the missing
          intrinsic dimensions cause no layout shift. */}
      <img src={src} alt={alt} fetchPriority="high" className="h-56 w-full rounded-lg object-cover sm:h-72 lg:h-[30rem]" />
    </div>
  );
}
