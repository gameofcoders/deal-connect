import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Send, Upload, Plus, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface NewQuestionFormProps {
  onSubmit: (title: string, content: string) => void;
  /** When true, renders only the trigger button styled as a large/centered CTA. */
  variant?: "compact" | "centered";
}

export interface NewQuestionFormHandle {
  open: () => void;
}

export const NewQuestionForm = forwardRef<NewQuestionFormHandle, NewQuestionFormProps>(
  function NewQuestionForm({ onSubmit, variant = "compact" }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
    }));

    const handleSubmit = () => {
      if (title.trim() && content.trim()) {
        onSubmit(title.trim(), content.trim());
        setTitle("");
        setContent("");
        setFiles([]);
        setIsOpen(false);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      }
      e.target.value = "";
    };

    if (!isOpen) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-action font-medium text-action-foreground shadow-sm transition-all hover:bg-action/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2",
            variant === "centered"
              ? "px-6 py-3 text-base"
              : "px-4 py-2 text-sm"
          )}
        >
          <Plus className={cn(variant === "centered" ? "h-5 w-5" : "h-4 w-4")} />
          New question
        </button>
      );
    }

    return (
      <div className="rounded-lg border border-action/30 bg-card p-4 animate-fade-in shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">New Question</h3>
          <button
            onClick={() => { setIsOpen(false); setTitle(""); setContent(""); setFiles([]); }}
            className="rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thread title..."
          className="mb-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
          autoFocus
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
          rows={3}
        />

        {/* Selected files preview */}
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md border border-action/30 bg-action/5 px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                <Paperclip className="h-3 w-3 text-action" />
                {file.name}
                <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="ml-0.5 rounded p-0.5 text-muted-foreground hover:text-destructive focus-visible:outline-none"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
              aria-label="Upload documents"
            >
              <Upload className="h-3.5 w-3.5" />
              Attach file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-action px-4 py-1.5 text-sm font-medium text-action-foreground hover:bg-action/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <Send className="h-3.5 w-3.5" />
            Post question
          </button>
        </div>
      </div>
    );
  }
);
