import { useState, useRef } from "react";
import { Clock, Download, Edit2, Paperclip, Check, X, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QAMessage, Attachment } from "@/types/deal-qa";
import { format, parseISO } from "date-fns";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface MessageBlockProps {
  message: QAMessage;
  isQuestion?: boolean;
  isOwnMessage?: boolean;
  isReadOnly?: boolean;
  onTogglePending?: (id: string) => void;
  onEdit?: (id: string, newContent: string, removedAttachmentIds?: string[], newAttachments?: Attachment[]) => void;
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
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveEdit = () => {
    const newAttachments: Attachment[] = newFiles.map((f, i) => ({
      id: `att-new-${Date.now()}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      size: formatFileSize(f.size),
    }));
    onEdit?.(message.id, editContent, removedAttachmentIds, newAttachments);
    setEditing(false);
    setRemovedAttachmentIds([]);
    setNewFiles([]);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setRemovedAttachmentIds([]);
    setNewFiles([]);
    setEditing(false);
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = "";
  };

  const remainingAttachments = message.attachments.filter(
    (att) => !removedAttachmentIds.includes(att.id)
  );

  const formattedDate = format(parseISO(message.timestamp), "d MMM yyyy, HH:mm");
  const formattedEditedDate = message.editedAt
    ? format(parseISO(message.editedAt), "d MMM yyyy, HH:mm")
    : null;

  return (
    <div className={cn("group animate-fade-in")}>
      <div className="flex items-start justify-between gap-4">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
              isOwnMessage
                ? "bg-action text-action-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {message.author.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{message.author.name}</span>
              {isOwnMessage && (
                <span className="rounded-sm bg-action/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-action">
                  You
                </span>
              )}
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-timestamp">{message.author.organization}</span>
            </div>
            <div className="flex items-center">
              <time className="text-xs text-timestamp">{formattedDate}</time>
              {formattedEditedDate && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs italic text-muted-foreground" title={`Edited on ${formattedEditedDate}`}>
                  <Edit2 className="h-2.5 w-2.5" />
                  edited
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Edit button */}
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

          {/* Existing attachments (removable) */}
          {remainingAttachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {remainingAttachments.map((att) => (
                <span
                  key={att.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground"
                >
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  {att.name}
                  <span className="text-muted-foreground">({att.size})</span>
                  <button
                    onClick={() => setRemovedAttachmentIds((prev) => [...prev, att.id])}
                    className="ml-0.5 rounded p-0.5 text-muted-foreground hover:text-destructive focus-visible:outline-none"
                    aria-label={`Remove ${att.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* New files to attach */}
          {newFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {newFiles.map((file, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-md border border-action/30 bg-action/5 px-2.5 py-1.5 text-xs font-medium text-foreground"
                >
                  <Paperclip className="h-3 w-3 text-action" />
                  {file.name}
                  <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="ml-0.5 rounded p-0.5 text-muted-foreground hover:text-destructive focus-visible:outline-none"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
            >
              <Upload className="h-3.5 w-3.5" />
              Add file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />
            <div className="flex gap-2">
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
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-foreground">{message.content}</p>
      )}

      {/* Footer: attachments (left) + pending action (right) — single coherent row */}
      {!editing && (message.attachments.length > 0 || (!isReadOnly && !isOwnMessage && onTogglePending)) && (
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          {/* Attachments — labeled group, left-aligned */}
          {message.attachments.length > 0 ? (
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {message.attachments.length === 1 ? "Attachment" : `${message.attachments.length} attachments`}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    className="group/att inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-action/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
                    download
                  >
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{att.name}</span>
                    <span className="text-muted-foreground">({att.size})</span>
                    <Download className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover/att:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Pending toggle — only for messages from the other side */}
          {!isReadOnly && !isOwnMessage && onTogglePending && (
            <button
              onClick={() => onTogglePending(message.id)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer self-end",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
                message.isPending
                  ? "border border-pending/30 bg-pending/10 text-pending hover:bg-pending/20"
                  : "border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {message.isPending ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark as Resolved
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  Mark as Pending
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
