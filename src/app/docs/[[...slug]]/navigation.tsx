"use client";

import { Button, DialogTitle, Drawer, ModalClose } from "@mui/joy";
import classNames from "classnames";
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
        text: "Self-Hosting",
        link: "/docs/install/self-hosting",
      },
    ],
  },
  {
    text: "Getting Started",
    children: [
      {
        text: "Tags",
        link: "/docs/getting-started/tags",
      },
    ],
  },
  {
    text: "Advanced Settings",
    children: [
      {
        text: "Custom Style and Script",
        link: "/docs/advanced-settings/custom-style-and-script",
      },
      {
        text: "Local storage",
        link: "/docs/advanced-settings/local-storage",
      },
      {
        text: "MySQL",
        link: "/docs/advanced-settings/mysql",
      },
      {
        text: "Cloudflare R2",
        link: "/docs/advanced-settings/cloudflare-r2",
      },
      {
        text: "Keycloak",
        link: "/docs/advanced-settings/keycloak",
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
        text: "Community",
        link: "/docs/contribution/community",
      },
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

const NavigationItem = ({ node, level }: { node: DocsNode; level: number }) => {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {node.link ? (
        <Link
          className={classNames(
            "text-gray-600 hover:text-blue-600",
            level === 0 && "font-medium",
            node.link === pathname && "!text-blue-600",
          )}
          href={node.link}
        >
          {node.text}
        </Link>
      ) : (
        <div className={classNames("text-gray-600", level === 0 && "font-medium")}>{node.text}</div>
      )}
      {node.children && (
        <div className="w-full pl-4 pt-4 flex flex-col justify-start items-start gap-3">
          {node.children.map((child) => {
            return <NavigationItem key={child.text} node={child} level={level + 1} />;
          })}
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-4">
      {DOCS_NODES.map((node) => {
        return <NavigationItem key={node.text} node={node} level={0} />;
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
      <Button color="neutral" variant="outlined" onClick={toggleDrawer(true)} startDecorator={<Icon.Menu className="w-5 h-auto" />}>
        Menu
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <DialogTitle>Documentations</DialogTitle>
        <ModalClose />
        <div className="w-full px-4 pt-4 pb-8">
          <Navigation />
        </div>
      </Drawer>
    </div>
  );
};

export default Navigation;
