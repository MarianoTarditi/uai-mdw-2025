import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface PremiumTableShellProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PremiumTableShell({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  actions,
  children,
}: PremiumTableShellProps) {
  return (
    <section className="rounded-xl border bg-card/60 p-3 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
          />
        </div>

        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>

      {children}
    </section>
  );
}
