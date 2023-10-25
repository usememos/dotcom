"use client";

import { DialogTitle, Drawer, IconButton, ModalClose } from "@mui/joy";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Icon from "@/components/Icon";

interface DocsNode {
  text: string;
  link?: string;
  children?: DocsNode[];
}

const DOCS_NODES: DocsNode[] = [
  {
    text: "What is memos",
    link: "/docs",
  },
  {
    text: "Installation",
    link: "/docs/install",
    children: [
      {
        text: "Self-Hosted",
        link: "/docs/install/self-hosted",
      },
    ],
  },
  {
    text: "Getting Started",
    children: [
      {
        text: "Local storage",
        link: "/docs/get-started/local-storage",
      },
      {
        text: "MySQL",
        link: "/docs/get-started/mysql",
      },
      {
        text: "Cloudflare R2",
        link: "/docs/get-started/cloudflare-r2",
      },
      {
        text: "Keycloak",
        link: "/docs/get-started/keycloak",
      },
    ],
  },
  {
    text: "Security",
    children: [
      {
        text: "Access Tokens",
        link: "/docs/security/access-tokens",
      },
    ],
  },
  {
    text: "Integration",
    children: [
      {
        text: "Telegram Bot",
        link: "/docs/integration/telegram-bot",
      },
    ],
  },
  {
    text: "Contribution",
    children: [
      {
        text: "Development",
        link: "/docs/contribution/development",
      },
      {
        text: "Documentation",
        link: "/docs/contribution/documentation",
      },
    ],
  },
  {
    text: "FAQ",
    link: "/docs/faq",
  },
];

const NavigationItem = ({ node }: { node: DocsNode }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      {node.link ? (
        <Link className="text-gray-600 hover:text-blue-600" href={node.link}>
          {node.text}
        </Link>
      ) : (
        <div className="text-gray-600">{node.text}</div>
      )}
      {node.children && (
        <div className="w-full pl-4 pt-4 flex flex-col justify-start items-start gap-3">
          {node.children.map((child) => {
            return <NavigationItem key={child.text} node={child} />;
          })}
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  return (
    <div className="pt-6 w-full flex flex-col justify-start items-start gap-4">
      {DOCS_NODES.map((node) => {
        return <NavigationItem key={node.text} node={node} />;
      })}
    </div>
  );
};

export const DocsNavigationDrawer = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleDrawer = (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setOpen(inOpen);
  };

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <Icon.Menu />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <DialogTitle>Documentations</DialogTitle>
        <ModalClose />
        <div className="w-full px-4">
          <Navigation />
        </div>
      </Drawer>
    </div>
  );
};

export default Navigation;
