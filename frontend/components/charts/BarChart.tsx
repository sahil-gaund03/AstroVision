import { cn } from "@/lib/utils";

export default function BarChart({
  data,
  className,
  accent = "bg-cyan-500",
}: {
  data: { label: string; value: number }[];
  className?: string;
  accent?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-white/50 truncate" title={d.label}>
            {d.label}
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", accent)}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-mono text-white/70">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
