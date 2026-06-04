export default function SpaceLoader() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5 bg-[#05050a]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-[#fdb813] shadow-[0_0_30px_#ff8a1e] animate-pulse" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50">Initializing orrery…</span>
    </div>
  );
}
