import { cn } from "@/lib/utils";
import type { Lender } from "@/types/deal-qa";

interface LenderSidebarProps {
  lenders: Lender[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function LenderSidebar({ lenders, selectedId, onSelect }: LenderSidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card" role="navigation" aria-label="Lender list">
      <div className="p-3">
        <h2 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Lenders
        </h2>
        <ul className="space-y-0.5">
          {lenders.map((lender) => (
            <li key={lender.id}>
              <button
                onClick={() => onSelect(lender.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
                  selectedId === lender.id
                    ? "bg-action text-action-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <span className="truncate">{lender.name}</span>
                {lender.notificationCount > 0 && (
                  <span className={cn(
                    "ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-semibold",
                    selectedId === lender.id
                      ? "bg-action-foreground/20 text-action-foreground"
                      : "bg-notification text-action-foreground"
                  )}>
                    {lender.notificationCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
