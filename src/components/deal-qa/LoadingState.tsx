export function LoadingState() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-5 animate-pulse">
          <div className="h-4 w-48 rounded bg-secondary mb-4" />
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-secondary" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-secondary" />
              <div className="h-2.5 w-20 rounded bg-secondary" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-secondary" />
            <div className="h-3 w-3/4 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}
