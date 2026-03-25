import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MetricTone = "default" | "positive" | "warning" | "danger";

interface MetricItem {
  label: string;
  value: ReactNode;
  helper?: string;
  icon?: LucideIcon;
  tone?: MetricTone;
}

interface MetricStripProps {
  items: MetricItem[];
}

const toneClassMap: Record<MetricTone, string> = {
  default: "text-primary",
  positive: "text-emerald-400",
  warning: "text-amber-400",
  danger: "text-red-400",
};

export function MetricStrip({ items }: MetricStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const toneClass = toneClassMap[item.tone ?? "default"];

        return (
          <Card key={item.label} className="gap-2 py-4">
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between gap-2">
                <CardDescription>{item.label}</CardDescription>
                {Icon && <Icon className={`h-4 w-4 ${toneClass}`} />}
              </div>
              <CardTitle className="text-2xl tabular-nums">{item.value}</CardTitle>
            </CardHeader>
            {item.helper && (
              <CardContent className="text-sm text-muted-foreground">{item.helper}</CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
