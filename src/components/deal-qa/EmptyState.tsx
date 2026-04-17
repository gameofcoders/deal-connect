import { MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  lenderName: string;
  isPendingFilter?: boolean;
  action?: ReactNode;
}

export function EmptyState({ lenderName, isPendingFilter, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-action/10">
        <MessageSquare className="h-7 w-7 text-action" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">
        {isPendingFilter ? "No pending questions" : "Start the conversation"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {isPendingFilter
          ? `All questions with ${lenderName} have been resolved.`
          : `There are no messages with ${lenderName} yet. Post the first question to get the conversation going.`}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
