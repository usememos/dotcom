import classnames from "classnames";
import type { ReactNode, JSX } from "react";
import Icon from "./Icon";

interface Props {
  id: string;
  level: number;
  children: ReactNode;
  className: string;
}

export function Heading({ id = "", level = 1, children, className }: Props) {
  const textSize = {
    "text-3xl": level === 1,
    "text-2xl": level === 2,
    "text-xl": level === 3,
    "text-lg": level === 4,
    "text-base": level === 5,
    "text-sm": level === 6,
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Component id={id} className={["not-prose group", className].filter(Boolean).join(" ")}>
      {children}
      <a href={`#${id}`}>
        <Icon.Hash className={classnames("w-4 h-4 ml-2 mb-1 inline opacity-0 group-hover:opacity-100 text-slate-400", textSize)} />
      </a>
    </Component>
  );
}
