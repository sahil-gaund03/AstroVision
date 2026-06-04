export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function riskColor(level: string): string {
  switch (level) {
    case "Critical":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    case "High":
      return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    case "Medium":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    default:
      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  }
}

export function habitabilityColor(category: string): string {
  switch (category) {
    case "Strong Candidate":
      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    case "Promising":
      return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    case "Possible":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    default:
      return "text-white/50 border-white/20 bg-white/5";
  }
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
