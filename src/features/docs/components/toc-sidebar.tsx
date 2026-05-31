"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  title: React.ReactNode;
  url: string;
  depth: number;
}

interface TOCSidebarProps {
  toc: TOCItem[];
}

export function TOCSidebar({ toc }: TOCSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Track which heading is currently visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" },
    );

    // Observe all headings
    const headings = toc
      .map((item) => {
        const id = item.url.slice(1); // Remove # from url
        return document.getElementById(id);
      })
      .filter(Boolean);

    headings.forEach((heading) => {
      if (heading) observer.observe(heading);
    });

    return () => {
      headings.forEach((heading) => {
        if (heading) observer.unobserve(heading);
      });
    };
  }, [toc]);

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
      <nav>
        <ul className="space-y-2 text-sm">
          {toc.map((item) => {
            const id = item.url.slice(1);
            const isActive = activeId === id;

            return (
              <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
                <a
                  href={item.url}
                  className={`block py-1 transition-colors ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
