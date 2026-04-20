import { useState, useRef } from "react";
import { MessageSquare, Send, Upload, ChevronDown, Clock, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QAThread } from "@/types/deal-qa";
import { MessageBlock } from "./MessageBlock";
import { format, parseISO } from "date-fns";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReplyFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = "";
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply?.(thread.id, replyContent.trim());
      setReplyContent("");
      setReplyFiles([]);
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
          {(() => {
            const isOwn = thread.question.author.id === currentUserId;
            return (
              <div
                className={cn(
                  "relative px-5 py-4",
                  isOwn ? "bg-action/[0.06]" : "bg-card",
                  thread.question.isPending &&
                    "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-pending"
                )}
              >
                <MessageBlock
                  message={thread.question}
                  isQuestion
                  isOwnMessage={isOwn}
                  isReadOnly={isReadOnly}
                  onTogglePending={onTogglePending}
                  onEdit={onEdit}
                />
              </div>
            );
          })()}

          {/* Replies — chat-style: background tint distinguishes sides */}
          {thread.replies.length > 0 && (
            <div className="divide-y divide-border border-t border-border">
              {thread.replies.map((reply) => {
                const isOwn = reply.author.id === currentUserId;
              return (
                  <div
                    key={reply.id}
                    className={cn(
                      "relative px-5 py-4",
                      isOwn ? "bg-action/[0.06]" : "bg-card",
                      reply.isPending &&
                        "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-pending"
                    )}
                  >
                    <MessageBlock
                      message={reply}
                      isOwnMessage={isOwn}
                      isReadOnly={isReadOnly}
                      onTogglePending={onTogglePending}
                      onEdit={onEdit}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Reply input */}
          {!isReadOnly && (
            <div className="border-t border-border bg-muted/30 px-5 py-3">
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
                  {/* Selected files preview */}
                  {replyFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {replyFiles.map((file, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-md border border-action/30 bg-action/5 px-2.5 py-1.5 text-xs font-medium text-foreground"
                        >
                          <Paperclip className="h-3 w-3 text-action" />
                          {file.name}
                          <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                          <button
                            onClick={() => setReplyFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="ml-0.5 rounded p-0.5 text-muted-foreground hover:text-destructive focus-visible:outline-none"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <button
                        onClick={() => replyFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
                        aria-label="Upload documents"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Attach file
                      </button>
                      <input
                        ref={replyFileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleReplyFileChange}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowReplyBox(false); setReplyContent(""); setReplyFiles([]); }}
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
