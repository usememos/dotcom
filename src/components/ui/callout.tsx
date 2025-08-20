import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "warning" | "error" | "success" | "tip";
  title?: string;
  children: ReactNode;
}

const calloutStyles = {
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900",
    icon: "💡",
    iconBg: "bg-blue-100 text-blue-600",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900",
    icon: "⚠️",
    iconBg: "bg-amber-100 text-amber-600",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: "🚨",
    iconBg: "bg-red-100 text-red-600",
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-900",
    icon: "✅",
    iconBg: "bg-green-100 text-green-600",
  },
  tip: {
    container: "bg-purple-50 border-purple-200 text-purple-900",
    icon: "💡",
    iconBg: "bg-purple-100 text-purple-600",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = calloutStyles[type];

  return (
    <div className={cn("rounded-lg border p-4 my-6", styles.container)}>
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm", styles.iconBg)}>
          <span className="text-xs">{styles.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold mb-2 text-sm">{title}</h4>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
