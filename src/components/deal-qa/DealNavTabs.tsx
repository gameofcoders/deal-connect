import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "data-room", label: "Data room" },
  { id: "sponsors-team", label: "Sponsor's team" },
  { id: "lenders-list", label: "Lender's list" },
  { id: "qa", label: "Q&A" },
  { id: "indicative-terms", label: "Indicative terms" },
];

interface DealNavTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  qaBadgeCount?: number;
}

export function DealNavTabs({ activeTab, onTabChange, qaBadgeCount }: DealNavTabsProps) {
  return (
    <nav className="flex items-center gap-1 rounded-lg bg-navy p-1" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-1",
            activeTab === tab.id
              ? "bg-action text-action-foreground"
              : "text-navy-foreground/70 hover:text-navy-foreground hover:bg-sidebar-hover"
          )}
        >
          {tab.label}
          {tab.id === "qa" && qaBadgeCount && qaBadgeCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-notification text-[11px] font-semibold text-action-foreground">
              {qaBadgeCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
