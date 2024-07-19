import clsx from "clsx";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const SectionContainer = ({ children, className }: Props) => {
  return <div className={clsx("px-6 w-full max-w-7xl", className)}>{children}</div>;
};

export default SectionContainer;
