export function Loading({ label = "Loading cosmic data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-transparent animate-spin" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
        <iconify-icon icon="solar:danger-triangle-linear" width="24" />
      </div>
      <p className="text-white/70 max-w-sm text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-full border border-white/15 text-sm text-white hover:bg-white/10 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  message = "Nothing to show yet.",
  icon = "solar:planet-linear",
}: {
  message?: string;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/40">
      <iconify-icon icon={icon} width="32" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
