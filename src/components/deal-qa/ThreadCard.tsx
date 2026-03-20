import { useState } from "react";
import { MessageSquare, Send, Upload, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QAThread } from "@/types/deal-qa";
import { MessageBlock } from "./MessageBlock";
import { format, parseISO } from "date-fns";

interface ThreadCardProps {
  thread: QAThread;
  currentUserId: string;
  isReadOnly?: boolean;
  onTogglePending?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onReply?: (threadId: string, content: string) => void;
}

export function ThreadCard({
  thread,
  currentUserId,
  isReadOnly = false,
  onTogglePending,
  onEdit,
  onReply,
}: ThreadCardProps) {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply?.(thread.id, replyContent.trim());
      setReplyContent("");
      setShowReplyBox(false);
    }
  };

  const lastActivity = thread.replies.length > 0
    ? thread.replies[thread.replies.length - 1].timestamp
    : thread.question.timestamp;

  const lastAuthor = thread.replies.length > 0
    ? thread.replies[thread.replies.length - 1].author.name
    : thread.question.author.name;

  return (
    <article
      className="rounded-lg border border-border bg-card animate-fade-in overflow-hidden"
    >
      {/* Collapsed header — always visible, acts as toggle */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-action"
        )}
        aria-expanded={isExpanded}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
        <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {thread.title}
            </h3>
            {thread.isPending && (
              <span className="inline-flex items-center gap-1 shrink-0 rounded-md bg-pending/10 px-2 py-0.5 text-xs font-medium text-pending">
                <Clock className="h-3 w-3" />
                Pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              Last: {lastAuthor} · {format(parseISO(lastActivity), "d MMM, HH:mm")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {thread.replies.length}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Question block */}
          <div className={cn("bg-accent/30 px-5 py-4", thread.question.isPending && "border-l-[3px] border-l-pending")}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-action/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-action">
                Question
              </span>
            </div>
            <MessageBlock
              message={thread.question}
              isQuestion
              isOwnMessage={thread.question.author.id === currentUserId}
              isReadOnly={isReadOnly}
              onTogglePending={onTogglePending}
              onEdit={onEdit}
            />
          </div>

          {/* Replies */}
          {thread.replies.length > 0 && (
            <div className="ml-5 mr-5 mb-4 mt-1 space-y-3">
              {thread.replies.map((reply, index) => (
                <div
                  key={reply.id}
                  className={cn(
                    "relative rounded-md border border-border bg-background p-4 ml-6 before:absolute before:left-[-13px] before:top-4 before:w-3 before:h-px before:bg-border after:absolute after:left-[-13px] after:top-0 after:bottom-0 after:w-px after:bg-border",
                    reply.isPending && "border-l-[3px] border-l-pending"
                  )}
                  style={{
                    // Hide the vertical line extension below the last reply
                    ...(index === thread.replies.length - 1 ? { ['--after-bottom' as string]: '50%' } : {}),
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Reply
                    </span>
                  </div>
                  <MessageBlock
                    message={reply}
                    isOwnMessage={reply.author.id === currentUserId}
                    isReadOnly={isReadOnly}
                    onTogglePending={onTogglePending}
                    onEdit={onEdit}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Reply input */}
          {!isReadOnly && (
            <div className="border-t border-border bg-accent/20 px-5 py-3 pl-10">
              {showReplyBox ? (
                <div className="space-y-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <button
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
                      aria-label="Upload documents"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Attach file
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowReplyBox(false); setReplyContent(""); }}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReply}
                        disabled={!replyContent.trim()}
                        className="inline-flex items-center gap-1.5 rounded-md bg-action px-3 py-1.5 text-xs font-medium text-action-foreground hover:bg-action/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
                      >
                        <Send className="h-3 w-3" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowReplyBox(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action rounded-md px-2 py-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Reply to thread
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
