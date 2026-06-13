import type { ReactNode } from "react";
import { type NameSource, resolveUserDisplayName } from "../lib/display-name";

type UserIdentityProps = {
  user: (NameSource & { imageUrl?: string | null }) | null;
  /** Secondary line: email (menu) or instance label (dashboard). */
  secondary?: ReactNode;
  size?: "sm" | "md";
};

const SIZES = {
  sm: { avatar: "h-8 w-8", name: "text-sm font-semibold", initial: "text-xs" },
  md: { avatar: "h-11 w-11", name: "text-base font-semibold", initial: "text-sm" },
} as const;

export function UserIdentity({ user, secondary, size = "sm" }: UserIdentityProps) {
  const name = resolveUserDisplayName(user);
  const dimensions = SIZES[size];
  const imageUrl = user?.imageUrl ?? null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      {imageUrl ? (
        <img src={imageUrl} alt="" className={`${dimensions.avatar} shrink-0 rounded-full bg-stone-100 object-cover dark:bg-stone-800`} />
      ) : (
        <div
          aria-hidden="true"
          className={`${dimensions.avatar} ${dimensions.initial} flex shrink-0 items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-600 dark:bg-stone-700 dark:text-stone-300`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`truncate ${dimensions.name} text-stone-800 dark:text-stone-100`}>{name}</div>
        {secondary ? <div className="truncate text-xs text-stone-400 dark:text-stone-500">{secondary}</div> : null}
      </div>
    </div>
  );
}
