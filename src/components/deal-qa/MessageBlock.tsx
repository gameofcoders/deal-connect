import { useState } from "react";
import { Clock, Download, Edit2, Paperclip, Check, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QAMessage } from "@/types/deal-qa";
import { format, parseISO } from "date-fns";

interface MessageBlockProps {
  message: QAMessage;
  isQuestion?: boolean;
  isOwnMessage?: boolean;
  isReadOnly?: boolean;
  onTogglePending?: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
}

export function MessageBlock({
  message,
  isQuestion = false,
  isOwnMessage = false,
  isReadOnly = false,
  onTogglePending,
  onEdit,
}: MessageBlockProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleSaveEdit = () => {
    onEdit?.(message.id, editContent);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setEditing(false);
  };

  const formattedDate = format(parseISO(message.timestamp), "d MMM yyyy, HH:mm");

  return (
    <div className={cn("group animate-fade-in")}>
      <div className="flex items-start justify-between gap-4">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
            {message.author.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{message.author.name}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-timestamp">{message.author.organization}</span>
            </div>
            <time className="text-xs text-timestamp">{formattedDate}</time>
          </div>
        </div>

        {/* Status badge (read-only) */}
        <div className="flex items-center gap-2">
          {isReadOnly && message.isPending && (
            <span className="inline-flex items-center gap-1 rounded-md bg-pending/10 px-2 py-0.5 text-xs font-medium text-pending">
              <Clock className="h-3 w-3" />
              Pending
            </span>
          )}
          {!isReadOnly && isOwnMessage && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
              aria-label="Edit message"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <div className="mt-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
            rows={3}
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1 rounded-md bg-action px-3 py-1.5 text-xs font-medium text-action-foreground hover:bg-action/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
            >
              <Check className="h-3 w-3" /> Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-foreground">{message.content}</p>
      )}

      {/* Attachments */}
      {message.attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.attachments.map((att) => (
            <a
              key={att.id}
              href={att.url}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
              download
            >
              <Paperclip className="h-3 w-3 text-muted-foreground" />
              {att.name}
              <span className="text-muted-foreground">({att.size})</span>
              <Download className="h-3 w-3 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
