import { useState } from "react";
import { MessageSquare, Send, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QAThread } from "@/types/deal-qa";
import { MessageBlock } from "./MessageBlock";

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

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply?.(thread.id, replyContent.trim());
      setReplyContent("");
      setShowReplyBox(false);
    }
  };

  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-card animate-fade-in",
        thread.isPending && "border-l-[3px] border-l-pending"
      )}
    >
      {/* Thread title */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h3 className="text-base font-semibold text-foreground">{thread.title}</h3>
        <span className="text-xs text-muted-foreground">
          {thread.replies.length} {thread.replies.length === 1 ? "reply" : "replies"}
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* Question */}
        <MessageBlock
          message={thread.question}
          isQuestion
          isOwnMessage={thread.question.author.id === currentUserId}
          isReadOnly={isReadOnly}
          onTogglePending={onTogglePending}
          onEdit={onEdit}
        />

        {/* Replies */}
        {thread.replies.map((reply) => (
          <MessageBlock
            key={reply.id}
            message={reply}
            isOwnMessage={reply.author.id === currentUserId}
            isReadOnly={isReadOnly}
            onTogglePending={onTogglePending}
            onEdit={onEdit}
          />
        ))}

        {/* Reply input */}
        {!isReadOnly && (
          <div className="ml-6 border-l-2 border-thread-line pl-5">
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
    </article>
  );
}
