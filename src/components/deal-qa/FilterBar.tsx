import { cn } from "@/lib/utils";
import type { FilterStatus } from "@/types/deal-qa";

interface FilterBarProps {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  threadCount: number;
  pendingCount: number;
}

export function FilterBar({ activeFilter, onFilterChange, threadCount, pendingCount }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Filter threads">
      <button
        role="radio"
        aria-checked={activeFilter === "all"}
        onClick={() => onFilterChange("all")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
          activeFilter === "all"
            ? "bg-action text-action-foreground"
            : "border border-border bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        All ({threadCount})
      </button>
      <button
        role="radio"
        aria-checked={activeFilter === "pending"}
        onClick={() => onFilterChange("pending")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
          activeFilter === "pending"
            ? "bg-pending text-pending-foreground"
            : "border border-border bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        Pending ({pendingCount})
      </button>
    </div>
  );
}
