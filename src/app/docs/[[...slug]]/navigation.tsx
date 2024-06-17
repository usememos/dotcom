"use client";

import { Button, DialogTitle, Drawer, ModalClose } from "@mui/joy";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

interface DocsNode {
  text: string;
  link?: string;
  children?: DocsNode[];
}

const DOCS_NODES: DocsNode[] = [
  {
    text: "What is Memos",
    link: "/docs",
  },
  {
    text: "Installation",
    link: "/docs/install",
    children: [
      {
        text: "Container Install",
        link: "/docs/install/container-install",
      },
      {
        text: "Database Drivers",
        link: "/docs/install/database",
      },
      {
        text: "Startup Options",
        link: "/docs/install/startup-options",
      },
      {
        text: "Updating Memos",
        link: "/docs/install/update",
      },
      {
        text: "Using HTTPS",
        link: "/docs/install/https",
      },
    ],
  },
  {
    text: "Getting Started",
    children: [
      {
        text: "Memo",
        link: "/docs/getting-started/memo",
      },
      {
        text: "Tags",
        link: "/docs/getting-started/tags",
      },
      {
        text: "Resources",
        link: "/docs/getting-started/resources",
      },
      {
        text: "Content Syntax",
        link: "/docs/getting-started/content-syntax",
      },
    ],
  },
  {
    text: "Advanced Settings",
    children: [
      {
        text: "Cloudflare R2",
        link: "/docs/advanced-settings/cloudflare-r2",
      },
      {
        text: "Custom Style and Script",
        link: "/docs/advanced-settings/custom-style-and-script",
      },
      {
        text: "Local storage",
        link: "/docs/advanced-settings/local-storage",
      },
      {
        text: "Single Sign-On",
        link: "/docs/advanced-settings/sso",
      },
      {
        text: "Webhook",
        link: "/docs/advanced-settings/webhook",
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
    text: "Troubleshooting",
    link: "/docs/troubleshooting",
  },
];

const NavigationItem = ({ node, level }: { node: DocsNode; level: number }) => {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {node.link ? (
        <Link
          className={classNames(
            "hover:opacity-80",
            level === 0 ? "text-gray-600 font-medium" : "text-gray-500 sm:text-sm",
            node.link === pathname && "!text-blue-600 font-medium",
          )}
          href={node.link}
        >
          {node.text}
        </Link>
      ) : (
        <div className={classNames("text-gray-600", level === 0 && "font-medium")}>{node.text}</div>
      )}
      {node.children && (
        <div className="w-full pt-2 flex flex-col justify-start items-start gap-2">
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

export const NavigationMobileMenu = () => {
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
      <Button
        color="neutral"
        size="sm"
        variant="outlined"
        onClick={toggleDrawer(true)}
        endDecorator={<Icon.ChevronRight className="w-5 h-auto" />}
      >
        Menu
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <DialogTitle className="px-1">Documentations</DialogTitle>
        <ModalClose />
        <div className="w-full px-4 pt-4 pb-8">
          <Navigation />
        </div>
      </Drawer>
    </div>
  );
};

export default Navigation;
