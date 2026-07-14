import type { ComponentProps } from "react";

/** Keeps wide semantic tables accessible while allowing horizontal scrolling. */
export function TypesetTable(props: ComponentProps<"table">) {
  return (
    <div className="typeset-scroll">
      <table {...props} />
    </div>
  );
}
