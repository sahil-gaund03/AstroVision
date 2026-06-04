import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl shadow-2xl",
        glow && "ring-1 ring-cyan-500/10",
        className
      )}
    >
      {children}
    </div>
  );
}
