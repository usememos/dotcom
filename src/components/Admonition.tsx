import classnames from "classnames";
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

export interface AdmonitionProps {
  title: string;
  icon?: keyof typeof icons;
  children: React.ReactNode;
}

export function Admonition({ title, icon = "note", children }: AdmonitionProps) {
  const Icon = icons[icon] || icons.note;

  const borderColor = {
    "border-sky-500": icon === "note",
    "border-green-500": icon === "tip",
    "border-violet-500": icon === "important",
    "border-amber-400": icon === "warning",
    "border-red-600": icon === "caution",
  };

  const iconColor = {
    "text-sky-500": icon === "note",
    "text-green-500": icon === "tip",
    "text-violet-500": icon === "important",
    "text-amber-400": icon === "warning",
    "text-red-600": icon === "caution",
  };

  const iconMargin = title ? "mt-0.5" : "mt-2";
  return (
    <div className={classnames("border-l-[.8vh] border-r-[.3vh] pl-4 pt-2  m-1", borderColor)}>
      <div className="flex">
        <div className={classnames("flex-shrink-0", iconMargin)}>
          <Icon className={classnames("w-5 h-5", iconColor)} />
        </div>
        <div className="ml-3">
          <span className={classnames("font-semibold", iconColor)}>{title}</span>
          <div className="mt-[1vh] text-sm text-slate-700">
            <span className="flex flex-col space-y-2">{children}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
