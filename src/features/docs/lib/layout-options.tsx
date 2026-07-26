import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { GITHUB_REPO_URL } from "@/shared/lib/seo";

/**
 * Chrome for the docs shell. No `links`: the docs layout renders its own sidebar
 * tabs and passes `links={[]}`, so anything set here would be discarded — and
 * still serialized into every prerendered docs page.
 */
export const docsLayoutOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image src="/logo.png" alt="" width={24} height={24} className="rounded" priority aria-hidden="true" />
        Memos
      </>
    ),
  },
  githubUrl: GITHUB_REPO_URL,
};
