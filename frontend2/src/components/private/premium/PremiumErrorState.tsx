import type { LucideIcon } from "lucide-react";

import { AlertTriangle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorTone = "forbidden" | "default";

interface PremiumErrorStateProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  icon?: LucideIcon;
  tone?: ErrorTone;
  fullScreen?: boolean;
}

const toneClassMap: Record<ErrorTone, { iconWrap: string; icon: string }> = {
  forbidden: {
    iconWrap: "bg-destructive/15",
    icon: "text-destructive",
  },
  default: {
    iconWrap: "bg-muted/70",
    icon: "text-muted-foreground",
  },
};

export function PremiumErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  icon,
  tone = "default",
  fullScreen = false,
}: PremiumErrorStateProps) {
  const Icon = icon ?? (tone === "forbidden" ? Lock : AlertTriangle);
  const toneClasses = toneClassMap[tone];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        fullScreen ? "min-h-screen" : "min-h-[60vh]",
      )}
    >
      <div className="absolute inset-0 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card/95 p-8 text-center shadow-xl">
        <div className="mb-5 flex justify-center">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              toneClasses.iconWrap,
            )}
          >
            <Icon className={cn("h-8 w-8", toneClasses.icon)} />
          </div>
        </div>

        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>

        {retryLabel && onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-5">
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
