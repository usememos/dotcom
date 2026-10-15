import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { GITHUB_REPO_URL } from "@/shared/lib/seo";
import { MemosLockup } from "@/shared/ui/memos-lockup";

/**
 * Chrome for the docs shell. No `links`: the docs layout renders its own sidebar
 * tabs and passes `links={[]}`, so anything set here would be discarded — and
 * still serialized into every prerendered docs page.
 */
export const docsLayoutOptions: BaseLayoutProps = {
  nav: {
    title: <MemosLockup />,
  },
  githubUrl: GITHUB_REPO_URL,
};
