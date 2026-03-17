import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  lenderName: string;
  isPendingFilter?: boolean;
}

export function EmptyState({ lenderName, isPendingFilter }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">
        {isPendingFilter ? "No pending questions" : "No questions yet"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {isPendingFilter
          ? `All questions with ${lenderName} have been resolved.`
          : `Start a conversation with ${lenderName} by posting a new question.`}
      </p>
    </div>
  );
}
