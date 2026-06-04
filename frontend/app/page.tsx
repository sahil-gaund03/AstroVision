import Navbar from "@/components/Navbar";
import MissionsGrid from "@/components/MissionsGrid";
import HeroBackground from "@/components/landing/HeroBackground";
import Link from "next/link";

const HERO_IMG =
  "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=90&w=3840&auto=format&fit=crop";
const NETWORK_IMG =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop";

function DividerNode() {
  return (
    <div className="w-full bg-neutral-950 py-12 flex items-center justify-center relative z-20 overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent w-3/4 mx-auto" />
      <div className="relative bg-neutral-950 p-3 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse" />
      </div>
    </div>
  );
}

function DividerSync({ label }: { label: string }) {
  return (
    <div className="w-full bg-neutral-950 py-12 flex items-center justify-center relative z-20 overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5" />
      <div className="relative bg-neutral-950 px-6 py-2 border border-white/5 rounded-full flex items-center gap-4">
        <div className="flex gap-1">
          <div className="w-0.5 h-3 bg-white/20" />
          <div className="w-0.5 h-3 bg-white/20" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">{label}</span>
        <div className="flex gap-1">
          <div className="w-0.5 h-3 bg-white/20" />
          <div className="w-0.5 h-3 bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}

const TIMELINE = [
  { step: "01", title: "Discover NASA Images", desc: "Pull NASA's Astronomy Picture of the Day and Mars rover frames with full metadata and HD downloads." },
  { step: "02", title: "Analyze Exoplanets", desc: "Query 5,500+ confirmed worlds, score habitability, and visualize orbital and atmospheric telemetry." },
  { step: "03", title: "Track Asteroid Risk", desc: "Monitor near-Earth objects in real time with miss-distance, velocity, and hazard classification." },
  { step: "04", title: "Ask AI Astronomy Assistant", desc: "Get grounded, source-cited explanations for any cosmic question through conversational AI." },
  { step: "05", title: "Explore 3D Solar System", desc: "Navigate an accurate real-time WebGL orrery with scale modes and orbital time travel." },
];

const SYSTEMS = [
  {
    color: "emerald",
    icon: "solar:cpu-bolt-linear",
    status: "Online",
    title: "Astronomy AI Core",
    desc: "Retrieval-grounded language model that explains NASA imagery and astrophysics in real time.",
  },
  {
    color: "blue",
    icon: "solar:planet-linear",
    status: "Synced 100%",
    title: "Exoplanet Engine",
    desc: "Habitability scoring and transit analysis across the full confirmed-planet catalog.",
  },
  {
    color: "purple",
    icon: "solar:asteroid-linear",
    status: "Stable",
    title: "Orbital Tracker",
    desc: "Continuous near-Earth object propagation with close-approach risk modeling.",
  },
];

const SPECS = [
  {
    icon: "solar:gallery-linear",
    title: "NASA Image Pipeline",
    sub: "Live APOD + Rovers",
    tier: "Tier S",
    fields: [
      { icon: "solar:database-linear", label: "Sources", value: "12 APIs" },
      { icon: "solar:gallery-wide-linear", label: "Archive", value: "1.2M+" },
      { icon: "solar:cloud-download-linear", label: "Export", value: "8K HDR" },
    ],
    bars: [40, 60, 80, 65, 50, 45, 60, 75, 90, 70, 55, 40],
  },
  {
    icon: "solar:planet-2-linear",
    title: "Exoplanet Analytics",
    sub: "Habitability 0–1",
    tier: "Tier A",
    fields: [
      { icon: "solar:stars-linear", label: "Worlds", value: "5,500+" },
      { icon: "solar:graph-up-linear", label: "Models", value: "Transit" },
      { icon: "solar:ruler-angular-linear", label: "Params", value: "40+" },
    ],
    bars: [50, 52, 55, 58, 60, 60, 60, 58, 55, 52, 50, 48],
  },
  {
    icon: "solar:shield-warning-linear",
    title: "Asteroid Risk Engine",
    sub: "Real-time NEO",
    tier: "Tier X",
    fields: [
      { icon: "solar:radar-linear", label: "Tracked", value: "32K+" },
      { icon: "solar:bolt-linear", label: "Refresh", value: "60s" },
      { icon: "solar:danger-triangle-linear", label: "Grade", value: "Torino" },
    ],
    bars: [90, 95, 92, 98, 100, 98, 96, 94, 92, 95, 98, 99],
  },
];

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* HERO */}
      <header className="relative w-full overflow-hidden min-h-screen flex items-center">
        {/* Background image (z-0) + overlays — mouse parallax + cosmic drift */}
        <HeroBackground src={HERO_IMG} />

        {/* Small live badge — top-right, below navbar */}
        <div className="absolute top-28 right-6 lg:right-10 z-20 hidden sm:block animate-slide-up [animation-delay:2.5s] opacity-0">
          <div className="px-3.5 py-2 rounded-full bg-black/35 backdrop-blur-xl border border-white/10 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-hud text-[10px] uppercase tracking-[0.22em] text-white/90">Live: NASA Deep Space Feed</span>
          </div>
        </div>

        {/* Main content — left-focused */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-28">
          <div className="max-w-[980px]">
            <div className="flex items-center gap-3 mb-6 animate-slide-up [animation-delay:1.2s] opacity-0">
              <span className="h-px w-10 bg-white/50" />
              <span className="font-hud text-[11px] uppercase tracking-[0.45em] text-white/[0.68]">AstroVision ExoLab AI</span>
            </div>

            <h1 className="hero-heading font-bricolage font-extrabold uppercase drop-shadow-2xl animate-slide-up [animation-delay:1.4s] opacity-0 text-[clamp(5rem,11vw,10.5rem)] leading-[0.84] tracking-[-0.075em]">
              <span className="hero-heading-gradient block">Explore</span>
              <span className="hero-heading-gradient block">The Unknown</span>
            </h1>

            <p className="mt-7 max-w-[640px] text-[clamp(1rem,1.3vw,1.25rem)] leading-[1.75] text-white/[0.78] font-normal tracking-[-0.01em] [text-shadow:0_10px_40px_rgba(0,0,0,0.7)] animate-slide-up [animation-delay:1.7s] opacity-0">
              Explore NASA imagery, Mars rover missions, near-Earth asteroids, and exoplanet worlds through an AI-powered astronomy research platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-slide-up [animation-delay:1.9s] opacity-0">
              <Link href="/dashboard" className="rounded-full bg-white px-6 py-3.5 text-sm font-medium tracking-[-0.01em] text-black transition hover:scale-[1.03] hover:brightness-95 inline-flex items-center gap-2">
                Launch Dashboard
                <iconify-icon icon="solar:arrow-right-linear" width="16" />
              </Link>
              <Link href="/exoplanets" className="rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium tracking-[-0.01em] text-white backdrop-blur-xl transition hover:bg-white/10 hover:scale-[1.03]">
                Explore Exoplanets
              </Link>
            </div>

            {/* Compact stats row */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl animate-slide-up [animation-delay:2.1s] opacity-0">
              {[
                { label: "NASA APIs", value: "04+" },
                { label: "Exoplanets", value: "5,500+" },
                { label: "Modules", value: "06" },
                { label: "AI Mode", value: "Active" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3">
                  <span className="block font-hud text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5">{s.label}</span>
                  <span className="text-xl font-bricolage font-semibold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-slide-up [animation-delay:2.2s] opacity-0">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </header>

      <DividerNode />

      {/* PROJECTS / MODULES */}
      <section id="projects" className="relative py-24 md:py-32 bg-neutral-950 text-white overflow-hidden selection:bg-emerald-500/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[60vw] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-30 mix-blend-screen" />
        <div className="md:px-12 z-10 w-full max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-8">
            <div className="max-w-3xl relative animate-on-scroll">
              <div className="absolute -left-4 md:-left-8 top-1 bottom-1 w-1 bg-gradient-to-b from-emerald-500 to-transparent opacity-50" />
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-[spin_8s_linear_infinite]">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400/80">Platform Modules</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-bricolage font-medium tracking-tighter text-white leading-[0.9]">
                Cosmic <span className="text-white/20 font-light">Toolkit.</span>
              </h2>
            </div>
          </div>
          <MissionsGrid />
        </div>
      </section>

      <DividerSync label="Sync" />

      {/* DATA NETWORK / INFRASTRUCTURE */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden" id="infrastructure">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-emerald-500" />
                <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest">Data Network</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bricolage font-medium mb-6 leading-tight animate-on-scroll">
                Unified Space
                <br />
                <span className="text-white/40">Data Backbone</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed font-light animate-on-scroll delay-100">
                Every module draws from a single live pipeline — NASA APOD, Mars rover archives, the Exoplanet Archive,
                and near-Earth object feeds — fused with AI to deliver research-grade context on demand.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 group cursor-default animate-on-scroll delay-200">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <iconify-icon icon="solar:satellite-linear" width="24" className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mb-1 font-bricolage">Live NASA Ingestion</h4>
                    <p className="text-sm text-white/50">Continuous sync of imagery, telemetry, and mission data streams.</p>
                  </div>
                </div>
                <div className="flex gap-4 group cursor-default animate-on-scroll delay-300">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <iconify-icon icon="solar:chat-square-code-linear" width="24" className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mb-1 font-bricolage">AI Explanation Layer</h4>
                    <p className="text-sm text-white/50">Grounded language models translate raw data into plain-language insight.</p>
                  </div>
                </div>
              </div>
              <Link href="/dashboard" className="mt-10 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 group animate-on-scroll delay-300">
                Open Data Console
                <iconify-icon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 group animate-on-scroll h-[300px] md:h-[500px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NETWORK_IMG} alt="Orbital data network" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/20" />
              <div className="absolute top-1/4 left-1/3 group/spot">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                <div className="w-4 h-4 bg-emerald-500 rounded-full relative z-10 cursor-pointer border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                <div className="absolute left-6 top-0 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 w-56 opacity-0 group-hover/spot:opacity-100 transition-all duration-300 translate-y-2 group-hover/spot:translate-y-0 pointer-events-none">
                  <span className="text-xs font-mono text-emerald-400 block mb-1 uppercase tracking-wider">APOD Node</span>
                  <span className="text-[11px] text-white/70 block">Daily HD imagery feed</span>
                  <span className="text-[10px] text-white/40 block mt-1">Status: Operational</span>
                </div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 group/spot">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute inset-0 [animation-delay:0.5s]" />
                <div className="w-4 h-4 bg-blue-500 rounded-full relative z-10 cursor-pointer border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                <div className="absolute right-6 top-0 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 w-56 opacity-0 group-hover/spot:opacity-100 transition-all duration-300 translate-y-2 group-hover/spot:translate-y-0 pointer-events-none text-right">
                  <span className="text-xs font-mono text-blue-400 block mb-1 uppercase tracking-wider">NEO Tracker</span>
                  <span className="text-[11px] text-white/70 block">32,000+ objects tracked</span>
                  <span className="text-[10px] text-white/40 block mt-1">Refresh: 60s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DividerNode />

      {/* TIMELINE */}
      <section id="timeline" className="py-32 bg-neutral-950 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24 animate-on-scroll">
            <span className="text-emerald-500 font-mono text-xs uppercase tracking-widest">How It Works</span>
            <h2 className="text-5xl md:text-7xl font-bricolage text-white mt-4 font-semibold tracking-tight">The Workflow</h2>
          </div>
          <div className="relative">
            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0;
              return (
                <div key={t.step} className="flex flex-col md:flex-row items-center justify-between mb-24 group">
                  <div
                    className={`w-full md:w-5/12 order-2 ${left ? "md:order-1 pr-0 md:pr-12 text-center md:text-right" : "md:order-1 text-right pr-0 md:pr-12"} animate-on-scroll`}
                    data-anim="slide-right"
                  >
                    {left ? (
                      <>
                        <h3 className="text-3xl text-white font-bricolage">{t.title}</h3>
                        <p className="text-white/40 mt-2 font-light">{t.desc}</p>
                      </>
                    ) : (
                      <span className="text-8xl font-bricolage text-white/5 font-bold absolute right-6 md:right-12 -translate-y-12 select-none pointer-events-none">
                        {t.step}
                      </span>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/20 z-10 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] order-1 md:order-2 mb-6 md:mb-0 relative">
                    <span className="font-mono text-xs">{t.step}</span>
                  </div>
                  <div
                    className={`w-full md:w-5/12 order-3 pl-0 md:pl-12 animate-on-scroll ${left ? "" : "text-center md:text-left"}`}
                    data-anim="slide-left"
                  >
                    {left ? (
                      <span className="text-8xl font-bricolage text-white/5 font-bold absolute -translate-y-12 select-none pointer-events-none">
                        {t.step}
                      </span>
                    ) : (
                      <>
                        <h3 className="text-3xl text-white font-bricolage">{t.title}</h3>
                        <p className="text-white/40 mt-2 font-light">{t.desc}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DividerSync label="Log" />

      {/* SPEC LIST */}
      <section className="bg-neutral-950 border-white/5 border-t pt-24 pb-24 px-6 relative" id="process">
        <div className="absolute top-12 right-6 md:right-12 z-0 opacity-10 font-bricolage font-bold text-[8rem] md:text-[10rem] leading-none text-white pointer-events-none select-none tracking-tighter">
          VOL. III
        </div>
        <div className="z-10 w-full max-w-5xl mx-auto relative">
          <div className="text-center mb-16 animate-on-scroll" style={{ animation: "fanSlideIn 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.1s both" }}>
            <h3 className="text-3xl md:text-5xl font-bricolage font-light text-white mb-4 tracking-tight">Data Capabilities</h3>
            <p className="text-white/50">Research-grade pipelines engineered for the cosmos.</p>
          </div>
          <div className="flex flex-col gap-4">
            {SPECS.map((s, idx) => (
              <div
                key={s.title}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 md:p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all duration-300 animate-on-scroll"
                style={{ animation: `fanSlideIn 0.9s cubic-bezier(0.2,0.8,0.2,1) ${0.25 + idx * 0.15}s both` }}
              >
                <div className="col-span-1 md:col-span-4 flex items-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-xl shrink-0 flex items-center justify-center">
                    <iconify-icon icon={s.icon} width="40" className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl text-white font-bricolage font-light">{s.title}</h4>
                    <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">{s.sub}</p>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-6 grid gap-y-4 gap-x-2 border-l border-white/10 pl-6 grid-cols-2 sm:grid-cols-3">
                  {s.fields.map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-white/50 text-xs uppercase tracking-wide">
                        <iconify-icon icon={f.icon} width="14" />
                        {f.label}
                      </div>
                      <span className="text-white text-sm">{f.value}</span>
                    </div>
                  ))}
                  <div className="col-span-2 sm:col-span-3 mt-2">
                    <div className="flex items-center justify-between text-xs text-white/30 mb-1">
                      <span>Throughput</span>
                      <span>Signal</span>
                    </div>
                    <div className="w-full h-8 flex items-end gap-0.5 opacity-50">
                      {s.bars.map((h, bi) => (
                        <div
                          key={bi}
                          className="w-1 bg-white rounded-t-sm bar-anim"
                          style={{ height: `${h}%`, animationDuration: `${1.6 + (bi % 5) * 0.2}s`, animationDelay: `-${(bi % 4) * 0.5}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-6">
                  <span className="text-xl font-serif italic text-white">{s.tier}</span>
                  <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors group-hover:border-white">
                    <iconify-icon icon="solar:arrow-right-linear" width="18" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DividerNode />

      {/* CORE SYSTEMS */}
      <section id="systems" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
        <div className="z-10 max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[1px] bg-white/20" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/50">System Architecture</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bricolage text-white mb-6 tracking-tighter leading-none">Core Systems</h2>
              <p className="text-lg text-white/50 font-light leading-relaxed max-w-lg">
                Proprietary intelligence engineered for the void — the infrastructure powering every AstroVision module.
              </p>
            </div>
            <Link href="/dashboard" className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-all mt-8 md:mt-0">
              <span>View Architecture</span>
              <iconify-icon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {SYSTEMS.map((s, i) => {
              const c = s.color;
              return (
                <div
                  key={s.title}
                  className={`group relative h-[500px] bg-neutral-900/40 border border-white/10 rounded-3xl p-8 overflow-hidden hover:bg-neutral-900/60 transition-all duration-500 hover:border-white/20 backdrop-blur-sm animate-on-scroll delay-${(i + 1) * 100}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b from-${c}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                  <div className={`relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-auto text-${c}-400 group-hover:scale-110 transition-all duration-500`}>
                    <iconify-icon icon={s.icon} className="text-2xl" />
                  </div>
                  {/* Animated visualization */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none perspective-distant">
                    <div className="relative w-[300px] h-[300px] group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-full border border-${c}-500/30 animate-[spin_10s_linear_infinite]`} />
                        <div className={`absolute w-40 h-40 rounded-full border border-dashed border-${c}-500/20 animate-[spin_15s_linear_infinite_reverse]`} />
                        <div className={`absolute w-56 h-56 rounded-full border border-${c}-500/10 border-t-${c}-500/40 animate-[spin_20s_linear_infinite]`} />
                        <div className={`absolute w-full h-[1px] bg-gradient-to-r from-transparent via-${c}-500/50 to-transparent animate-pulse top-1/2 -translate-y-1/2 rotate-45`} />
                        <div className={`absolute w-full h-[1px] bg-gradient-to-r from-transparent via-${c}-500/50 to-transparent animate-pulse top-1/2 -translate-y-1/2 -rotate-45`} />
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className={`w-2 h-2 bg-${c}-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-ping`} />
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 mt-auto pt-32">
                    <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className={`w-1.5 h-1.5 rounded-full bg-${c}-500 animate-pulse`} />
                      <span className={`text-[10px] font-mono uppercase tracking-widest text-${c}-400`}>{s.status}</span>
                    </div>
                    <h3 className="text-3xl text-white font-bricolage mb-3 tracking-tight">{s.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{s.desc}</p>
                    <div className="w-full bg-white/5 h-[2px] mt-6 relative overflow-hidden rounded-full">
                      <div className={`absolute inset-0 bg-${c}-500 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DividerNode />

      {/* LOGOS + STATS */}
      <section className="bg-neutral-950 border-white/5 border-t pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-white/30">Powered By Open Space Data</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 animate-on-scroll delay-200">
            {["NASA", "ESA", "JPL", "SpaceX", "ESO", "JAXA"].map((n) => (
              <div key={n} className="flex items-center justify-center h-12 text-white font-bricolage font-bold text-xl tracking-tighter">
                {n}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 mt-20 pt-12 gap-8">
            {[
              { v: "5,500", s: "%", label: "Exoplanets", suffix: "+" },
              { v: "1.2M", s: "", label: "NASA Images" },
              { v: "32K", s: "", label: "Tracked Asteroids" },
              { v: "24", s: "/7", label: "AI Assistant" },
            ].map((st) => (
              <div key={st.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bricolage text-white font-light mb-2">
                  <span>{st.v}</span>
                  {st.s && <span className="text-lg text-emerald-500">{st.s}</span>}
                </div>
                <div className="text-xs uppercase tracking-widest text-white/40">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DividerNode />

      {/* CTA */}
      <section className="bg-neutral-950 border-white/5 border-t pt-24 pb-24 px-6 relative" id="careers">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="z-10 w-full max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div className="max-w-3xl animate-on-scroll">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-emerald-500" />
                <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest">Get Started</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bricolage font-medium tracking-tighter text-white leading-[0.9]">
                Enter the <span className="text-white/30">Cosmos.</span>
              </h2>
            </div>
            <p className="text-neutral-400 text-lg max-w-md font-light leading-relaxed mb-2">
              Launch the dashboard and start exploring NASA data, exoplanets, and AI-powered astronomy in seconds.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {[
                { icon: "solar:planet-linear", title: "Open the Dashboard", meta: "Mission control", href: "/dashboard", tag: "Live" },
                { icon: "solar:chat-round-line-linear", title: "Ask the AI Assistant", meta: "Conversational astronomy", href: "/assistant", tag: "AI" },
              ].map((j, i) => (
                <Link
                  key={j.title}
                  href={j.href}
                  className={`group relative block p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-white/0 hover:from-white/20 hover:to-white/5 transition-all duration-500 animate-on-scroll delay-${(i + 1) * 100}`}
                >
                  <div className="relative h-full bg-neutral-900/80 backdrop-blur-xl rounded-[23px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center border border-white/5 group-hover:border-transparent transition-colors overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 z-10">
                      <iconify-icon icon={j.icon} width="28" />
                    </div>
                    <div className="flex-1 text-center md:text-left z-10">
                      <h3 className="text-xl font-bricolage font-medium text-white mb-2">{j.title}</h3>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-neutral-400">
                        <span className="flex items-center gap-1.5">
                          <iconify-icon icon="solar:bolt-linear" width="16" />
                          {j.meta}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 z-10">
                      <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/60 bg-white/5 uppercase tracking-wide group-hover:text-white transition-colors">
                        {j.tag}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <iconify-icon icon="solar:arrow-right-linear" width="20" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="lg:col-span-4 w-full rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-8 animate-on-scroll delay-300">
              <iconify-icon icon="solar:rocket-2-linear" width="32" className="text-emerald-400 mb-4" />
              <h3 className="text-2xl font-bricolage text-white mb-3">AstroVision ExoLab AI</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                One cinematic, research-grade platform for NASA imagery, exoplanets, asteroids, and AI astronomy.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors">
                Launch Now
                <iconify-icon icon="solar:arrow-right-linear" width="16" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center">
        <p className="text-xs text-white/30 font-mono uppercase tracking-widest">
          AstroVision ExoLab AI — AI-Powered NASA Astronomy Explorer
        </p>
      </footer>
    </main>
  );
}
