"use client";

import { TOCScrollArea, useTOCItems } from "fumadocs-ui/components/toc";
import { TOCItem, TOCItems } from "fumadocs-ui/components/toc/default";
import { I18nLabel } from "fumadocs-ui/contexts/i18n";
import { Text } from "lucide-react";
import { TocFooter } from "@/features/docs/components/toc-footer";

/**
 * Custom "On this page" panel, passed to <DocsPage> via `tableOfContent.component`.
 *
 * Mirrors fumadocs' default TOC layout, but when a page has no headings it drops
 * the "On this page" title and the empty "No Headings" placeholder while still
 * rendering the desktop sponsor/ads footer. This keeps the ad slot on the ~340
 * heading-less docs pages (mostly generated API reference operations) without
 * showing an empty table of contents.
 *
 * The container class list is copied verbatim from fumadocs' TOC slot so the
 * grid placement and sizing stay identical.
 */
export function DocsToc() {
  const items = useTOCItems();
  const hasItems = items.length > 0;

  return (
    <div
      id="nd-toc"
      className="sticky top-(--fd-docs-row-1) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] flex flex-col [grid-area:toc] w-(--fd-toc-width) pt-12 pe-4 pb-2 xl:layout:[--fd-toc-width:268px] max-xl:hidden"
    >
      {hasItems && (
        <>
          <h3 id="toc-title" className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
            <Text className="size-4" />
            <I18nLabel label="toc" />
          </h3>
          <TOCScrollArea>
            <TOCItems>
              {items.map((item) => (
                <TOCItem key={item.url} item={item} />
              ))}
            </TOCItems>
          </TOCScrollArea>
        </>
      )}
      <TocFooter />
    </div>
  );
}
