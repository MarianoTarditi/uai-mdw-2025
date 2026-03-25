import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  chips?: string[];
  rightSlot?: ReactNode;
}

export function PageHero({
  icon: Icon,
  title,
  description,
  badge,
  chips,
  rightSlot,
}: PageHeroProps) {
  return (
    <section className="premium-page-intro">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="premium-page-title">
            <Icon className="h-6 w-6 text-primary" />
            {title}
          </h1>
          <p className="premium-page-copy">{description}</p>
          {chips && chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="premium-topbar-badge">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {badge && <Badge variant="secondary">{badge}</Badge>}
          {rightSlot}
        </div>
      </div>
    </section>
  );
}
