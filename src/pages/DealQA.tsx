import { useState, useMemo, useRef } from "react";
import { Home, Settings, BookOpen, Search, Users, Briefcase, X, Menu } from "lucide-react";
import { DealNavTabs } from "@/components/deal-qa/DealNavTabs";
import { LenderSidebar } from "@/components/deal-qa/LenderSidebar";
import { FilterBar } from "@/components/deal-qa/FilterBar";
import { ThreadCard } from "@/components/deal-qa/ThreadCard";
import { NewQuestionForm, type NewQuestionFormHandle } from "@/components/deal-qa/NewQuestionForm";
import { EmptyState } from "@/components/deal-qa/EmptyState";
import { LoadingState } from "@/components/deal-qa/LoadingState";
import { mockLenders, mockThreadsByLender, currentUser } from "@/data/mock-qa";
import type { FilterStatus, DealStatus, QAThread } from "@/types/deal-qa";
import { cn } from "@/lib/utils";

const sidebarNav = [
  { icon: Home, label: "Home" },
  { icon: Settings, label: "Management" },
  { icon: Briefcase, label: "Live deals" },
  { icon: Search, label: "Deal search" },
  { icon: Users, label: "Profile search" },
];

export default function DealQAPage() {
  const [activeTab, setActiveTab] = useState("qa");
  const [selectedLender, setSelectedLender] = useState(mockLenders[0].id);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [dealStatus] = useState<DealStatus>("active");
  const [threads, setThreads] = useState(mockThreadsByLender);
  const [isLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const newQuestionRef = useRef<NewQuestionFormHandle>(null);
  const centeredNewQuestionRef = useRef<NewQuestionFormHandle>(null);

  const isReadOnly = dealStatus === "closed";

  const currentThreads = useMemo(() => {
    const all = threads[selectedLender] || [];
    if (filter === "pending")
      return all.filter(
        (t) => t.question.isPending || t.replies.some((r) => r.isPending)
      );
    return all;
  }, [threads, selectedLender, filter]);

  const allThreads = threads[selectedLender] || [];
  const pendingCount = allThreads.filter((t) => t.question.isPending || t.replies.some((r) => r.isPending)).length;

  const totalNotifications = mockLenders.reduce((sum, l) => sum + l.notificationCount, 0);

  const selectedLenderName = mockLenders.find((l) => l.id === selectedLender)?.name || "";

  const handleNewQuestion = (title: string, content: string) => {
    const newThread: QAThread = {
      id: `t-${Date.now()}`,
      title,
      isPending: false,
      question: {
        id: `m-${Date.now()}`,
        author: currentUser,
        content,
        timestamp: new Date().toISOString(),
        isPending: false,
        attachments: [],
      },
      replies: [],
    };
    setThreads((prev) => ({
      ...prev,
      [selectedLender]: [newThread, ...(prev[selectedLender] || [])],
    }));
  };

  const handleReply = (threadId: string, content: string) => {
    setThreads((prev) => ({
      ...prev,
      [selectedLender]: (prev[selectedLender] || []).map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...t.replies,
                {
                  id: `m-${Date.now()}`,
                  author: currentUser,
                  content,
                  timestamp: new Date().toISOString(),
                  isPending: false,
                  attachments: [],
                },
              ],
            }
          : t
      ),
    }));
  };

  const handleTogglePending = (messageId: string) => {
    setThreads((prev) => ({
      ...prev,
      [selectedLender]: (prev[selectedLender] || []).map((t) => {
        if (t.question.id === messageId) {
          const newPending = !t.question.isPending;
          return { ...t, isPending: newPending, question: { ...t.question, isPending: newPending } };
        }
        const updatedReplies = t.replies.map((r) =>
          r.id === messageId ? { ...r, isPending: !r.isPending } : r
        );
        return { ...t, replies: updatedReplies };
      }),
    }));
  };

  const handleEdit = (messageId: string, newContent: string) => {
    setThreads((prev) => ({
      ...prev,
      [selectedLender]: (prev[selectedLender] || []).map((t) => {
        if (t.question.id === messageId) {
          return { ...t, question: { ...t.question, content: newContent, editedAt: new Date().toISOString() } };
        }
        return {
          ...t,
          replies: t.replies.map((r) => (r.id === messageId ? { ...r, content: newContent, editedAt: new Date().toISOString() } : r)),
        };
      }),
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* App sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-44 flex-col bg-navy text-navy-foreground transition-transform duration-200 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-4 py-5">
          <span className="text-lg font-bold tracking-tight text-navy-foreground">FUNDRE</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden rounded p-1 text-navy-foreground/70 hover:text-navy-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-3 mb-4 rounded-lg bg-action px-3 py-2.5 text-center">
          <p className="text-sm font-semibold text-action-foreground">Sponsor</p>
          <p className="text-xs text-action-foreground/70">Switch account</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-2">
          {sidebarNav.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "text-navy-foreground/70 hover:bg-sidebar-hover hover:text-navy-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
                item.label === "Live deals" && "bg-sidebar-hover text-navy-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="space-y-0.5 px-2 pb-5">
          <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/70 hover:bg-sidebar-hover hover:text-navy-foreground">
            <Settings className="h-4 w-4" /> Account settings
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/70 hover:bg-sidebar-hover hover:text-navy-foreground">
            <BookOpen className="h-4 w-4" /> User guide
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded p-1 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <DealNavTabs activeTab={activeTab} onTabChange={setActiveTab} qaBadgeCount={totalNotifications} />
          </div>
        </header>

        {/* Q&A content area — lender list + threads side by side, no gap */}
        <div className="flex flex-1 overflow-hidden">
          {/* Lender sidebar */}
          <div className="hidden md:block shrink-0">
            <LenderSidebar lenders={mockLenders} selectedId={selectedLender} onSelect={setSelectedLender} />
          </div>

          {/* Thread area — no max-width, fills remaining space */}
          <main className="flex-1 overflow-y-auto bg-surface" role="main">
            <div className="px-6 py-5">
              {/* Mobile lender selector */}
              <div className="mb-4 md:hidden">
                <label htmlFor="lender-select" className="sr-only">Select lender</label>
                <select
                  id="lender-select"
                  value={selectedLender}
                  onChange={(e) => setSelectedLender(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
                >
                  {mockLenders.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} {l.notificationCount > 0 ? `(${l.notificationCount})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filters + actions */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <FilterBar
                  activeFilter={filter}
                  onFilterChange={setFilter}
                  threadCount={allThreads.length}
                  pendingCount={pendingCount}
                />
                <div className="flex items-center gap-3">
                  {isReadOnly && (
                    <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Read-only (Deal closed)
                    </span>
                  )}
                  {!isReadOnly && allThreads.length > 0 && (
                    <NewQuestionForm ref={newQuestionRef} onSubmit={handleNewQuestion} variant="compact" />
                  )}
                </div>
              </div>

              {/* Threads */}
              {isLoading ? (
                <LoadingState />
              ) : currentThreads.length === 0 ? (
                <EmptyState
                  lenderName={selectedLenderName}
                  isPendingFilter={filter === "pending"}
                  action={
                    !isReadOnly && allThreads.length === 0 ? (
                      <NewQuestionForm
                        ref={centeredNewQuestionRef}
                        onSubmit={handleNewQuestion}
                        variant="centered"
                      />
                    ) : undefined
                  }
                />
              ) : (
                <div className="space-y-4">
                  {currentThreads.map((thread) => (
                    <ThreadCard
                      key={thread.id}
                      thread={thread}
                      currentUserId={currentUser.id}
                      isReadOnly={isReadOnly}
                      onTogglePending={handleTogglePending}
                      onEdit={handleEdit}
                      onReply={handleReply}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
