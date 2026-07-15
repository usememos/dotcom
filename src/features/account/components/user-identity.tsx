import type { ReactNode } from "react";
import { type NameSource, resolveUserDisplayName } from "../lib/display-name";

type UserIdentityProps = {
  user: (NameSource & { imageUrl?: string | null }) | null;
  /** Secondary line: email (menu) or instance label (dashboard). */
  secondary?: ReactNode;
  size?: "xs" | "sm" | "md";
};

const SIZES = {
  xs: { avatar: "size-6", name: "text-xs font-medium", initial: "text-[10px]", secondary: "text-[11px]", gap: "gap-2" },
  sm: { avatar: "size-8", name: "text-sm font-semibold", initial: "text-xs", secondary: "text-xs", gap: "gap-3" },
  md: { avatar: "size-11", name: "text-base font-semibold", initial: "text-sm", secondary: "text-xs", gap: "gap-3" },
} as const;

export function UserIdentity({ user, secondary, size = "sm" }: UserIdentityProps) {
  const name = resolveUserDisplayName(user);
  const dimensions = SIZES[size];
  const imageUrl = user?.imageUrl ?? null;

  return (
    <div className={`flex min-w-0 items-center ${dimensions.gap}`}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className={`${dimensions.avatar} shrink-0 rounded-full bg-muted object-cover`} />
      ) : (
        <div
          aria-hidden="true"
          className={`${dimensions.avatar} ${dimensions.initial} flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`truncate ${dimensions.name} text-foreground`}>{name}</div>
        {secondary ? <div className={`truncate ${dimensions.secondary} text-muted-foreground`}>{secondary}</div> : null}
      </div>
    </div>
  );
}
