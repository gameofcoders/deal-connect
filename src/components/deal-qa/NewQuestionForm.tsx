import { useState } from "react";
import { Send, Upload, Plus, X } from "lucide-react";

interface NewQuestionFormProps {
  onSubmit: (title: string, content: string) => void;
}

export function NewQuestionForm({ onSubmit }: NewQuestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
      setTitle("");
      setContent("");
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-action hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
      >
        <Plus className="h-4 w-4" />
        New question
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-action/30 bg-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">New Question</h3>
        <button
          onClick={() => { setIsOpen(false); setTitle(""); setContent(""); }}
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
      <div className="mt-3 flex items-center justify-between">
        <button
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          aria-label="Upload documents"
        >
          <Upload className="h-3.5 w-3.5" />
          Attach file
        </button>
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
