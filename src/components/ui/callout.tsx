import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { InfoIcon, AlertTriangleIcon, AlertCircleIcon, CheckCircleIcon, LightbulbIcon } from "lucide-react";

interface CalloutProps {
  type?: "info" | "warning" | "error" | "success" | "tip";
  title?: string;
  children: ReactNode;
}

const calloutStyles = {
  info: {
    container: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
    icon: InfoIcon,
    iconBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
  },
  warning: {
    container: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
    icon: AlertTriangleIcon,
    iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
  },
  error: {
    container: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
    icon: AlertCircleIcon,
    iconBg: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300",
  },
  success: {
    container: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
    icon: CheckCircleIcon,
    iconBg: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300",
  },
  tip: {
    container: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100",
    icon: LightbulbIcon,
    iconBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = calloutStyles[type];
  const IconComponent = styles.icon;

  return (
    <div className={cn("rounded-2xl border p-6 my-8 not-prose shadow-sm", styles.container)}>
      <div className="flex items-start space-x-4">
        <div className={cn("flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center", styles.iconBg)}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-bold mb-3 text-lg !my-0 tracking-tight">
              {title}
            </h4>
          )}
          <div className="leading-relaxed [&>p]:!my-0 [&>p]:!mt-0 [&>p]:!mb-2 [&>p:last-child]:!mb-0 [&>ul]:!my-2 [&>ol]:!my-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}