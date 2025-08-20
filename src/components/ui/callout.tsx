import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "warning" | "error" | "success" | "tip";
  title?: string;
  children: ReactNode;
}

const calloutStyles = {
  info: {
    container: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
    icon: "💡",
    iconBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
  },
  warning: {
    container: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
    icon: "⚠️",
    iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
  },
  error: {
    container: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
    icon: "🚨",
    iconBg: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300",
  },
  success: {
    container: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
    icon: "✅",
    iconBg: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300",
  },
  tip: {
    container: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100",
    icon: "💡",
    iconBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = calloutStyles[type];

  return (
    <div className={cn("rounded-lg border p-4 my-6 not-prose", styles.container)}>
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm", styles.iconBg)}>
          <span className="text-lg">{styles.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold mb-2 text-sm !my-0">{title}</h4>}
          <div className="text-sm leading-relaxed [&>p]:!my-0 [&>p]:!mt-0 [&>p]:!mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
