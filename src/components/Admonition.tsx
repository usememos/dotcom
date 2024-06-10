import classnames from "classnames";
import { startCase } from "lodash-es";
import type React from "react";
import Icon from "./Icon";

const icons = {
  note: Icon.InfoIcon,
  tip: Icon.Lightbulb,
  important: Icon.MessageSquareWarning,
  warning: Icon.TriangleAlert,
  caution: Icon.AlertOctagon,
};

export const admonitionTones = Object.keys(icons);

interface AdmonitionProps {
  title: string;
  icon?: keyof typeof icons;
  children: React.ReactNode;
}

const Admonition = ({ title, icon = "note", children }: AdmonitionProps) => {
  const Icon = icons[icon] || icons.note;

  const borderColor = {
    "border-sky-500": icon === "note",
    "border-green-500": icon === "tip",
    "border-blue-500": icon === "important",
    "border-amber-400": icon === "warning",
    "border-red-600": icon === "caution",
  };

  const iconColor = {
    "text-sky-500": icon === "note",
    "text-green-500": icon === "tip",
    "text-blue-500": icon === "important",
    "text-amber-400": icon === "warning",
    "text-red-600": icon === "caution",
  };

  return (
    <div className={classnames("w-full flex flex-col bg-zinc-50 rounded-lg", "border-l-[6px] pl-4 pr-2 pt-3", borderColor)}>
      <div className={classnames("flex flex-row items-center gap-2")}>
        <Icon className={classnames("w-5 h-5", iconColor)} />
        <span className={classnames("font-semibold", iconColor)}>{title || startCase(icon)}</span>
      </div>
      <div className="mt-3 text-slate-700">{children}</div>
    </div>
  );
};

export default Admonition;
