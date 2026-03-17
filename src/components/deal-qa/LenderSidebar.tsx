import { cn } from "@/lib/utils";
import type { Lender } from "@/types/deal-qa";

interface LenderSidebarProps {
  lenders: Lender[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function LenderSidebar({ lenders, selectedId, onSelect }: LenderSidebarProps) {
  return (
    <aside className="w-52 shrink-0 border-r border-border bg-card h-full" role="navigation" aria-label="Lender list">
      <div className="px-3 pt-4 pb-3">
        <ul className="space-y-0.5">
          {lenders.map((lender) => (
            <li key={lender.id}>
              <button
                onClick={() => onSelect(lender.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
                  selectedId === lender.id
                    ? "bg-selected text-action font-semibold"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <span className="truncate">{lender.name}</span>
                {lender.notificationCount > 0 && (
                  <span className={cn(
                    "ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-semibold",
                    selectedId === lender.id
                      ? "bg-action/10 text-action"
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
