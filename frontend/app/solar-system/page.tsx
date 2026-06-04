"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/ui/GlassCard";
import { LiveBadge } from "@/components/ui/Badges";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import AIExplain from "@/components/assistant/AIExplain";
import Orrery from "@/components/three/Orrery";
import SceneBoundary from "@/components/three/SceneBoundary";
import { api } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import type { Planet, SolarSystem } from "@/lib/types";

const SolarSystemScene = dynamic(() => import("@/components/three/SolarSystemScene"), {
  ssr: false,
  loading: () => <Loading label="Initializing 3D engine..." />,
});

function webglOK() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function SolarSystemPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<SolarSystem | null>(null);
  const [selected, setSelected] = useState<Planet | null>(null);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [focus, setFocus] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [webgl, setWebgl] = useState(true);

  function resetView() {
    setFocus(null);
    setResetSignal((n) => n + 1);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.getSolarSystemPlanets();
      setData(res);
      setSelected(res.planets[2] || res.planets[0] || null);
    } catch {
      setError("Could not load solar system data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setWebgl(webglOK());
    load();
  }, []);

  const tempByType: Record<string, string> = {
    Terrestrial: "approx. 150-450 K",
    "Gas Giant": "approx. 110-165 K",
    "Ice Giant": "approx. 60-75 K",
  };

  return (
    <DashboardShell
      title="3D Solar System"
      subtitle="Live orrery / AI mode active"
      actions={<LiveBadge label="Live Orrery" />}
    >
      {loading ? (
        <Loading label="Aligning the planets..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data || data.planets.length === 0 ? (
        <EmptyState message="No solar system planet data returned." icon="solar:sun-linear" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 overflow-hidden relative" glow>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Real-time simulation
            </div>
            <div className="h-[480px] md:h-[calc(100vh-15rem)] md:max-h-[760px] w-full bg-[#05060f] relative">
              {webgl ? (
                <SceneBoundary fallback={<div className="p-6"><Orrery data={data} selected={selected} onSelect={setSelected} speed={speed} /></div>}>
                  <SolarSystemScene
                    data={data}
                    selected={selected}
                    onSelect={setSelected}
                    speed={paused ? 0 : speed}
                    paused={paused}
                    showOrbits={showOrbits}
                    showLabels={showLabels}
                    autoRotate={autoRotate}
                    focus={focus}
                    resetSignal={resetSignal}
                  />
                </SceneBoundary>
              ) : (
                <div className="p-6">
                  <Orrery data={data} selected={selected} onSelect={setSelected} speed={speed} />
                </div>
              )}
              {paused && (
                <button
                  onClick={() => setPaused(false)}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group"
                >
                  <span className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/20 bg-black/60 text-sm text-white/90 group-hover:bg-black/70 transition-colors">
                    <iconify-icon icon="solar:play-circle-linear" width="18" />
                    Paused — Click to Resume
                  </span>
                </button>
              )}
            </div>

            <div className="border-t border-white/10 p-4 flex flex-wrap items-center gap-x-6 gap-y-3 bg-neutral-950/40">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Speed</span>
                <input type="range" min={0.25} max={4} step={0.25} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-cyan-400 w-28" />
                <span className="text-xs font-mono text-white/60 w-9">{speed}x</span>
              </div>
              <Toggle on={!paused} onClick={() => setPaused((p) => !p)} icon={paused ? "solar:play-linear" : "solar:pause-linear"} label={paused ? "Resume" : "Pause"} />
              <Toggle on={showOrbits} onClick={() => setShowOrbits((v) => !v)} icon="solar:share-circle-linear" label="Orbits" />
              <Toggle on={showLabels} onClick={() => setShowLabels((v) => !v)} icon="solar:tag-linear" label="Labels" />
              <Toggle on={autoRotate} onClick={() => setAutoRotate((v) => !v)} icon="solar:refresh-linear" label="Auto-rotate" />
              <button onClick={resetView} className="ml-auto inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
                <iconify-icon icon="solar:full-screen-square-linear" width="15" /> Reset view
              </button>
            </div>
          </GlassCard>

          {selected && (
            <GlassCard className="p-6 flex flex-col" glow>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 mb-3">Planet Intelligence</span>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-full shrink-0" style={{ background: selected.color, boxShadow: `0 0 22px ${selected.color}` }} />
                <h3 className="font-bricolage text-2xl text-white">{selected.name}</h3>
              </div>
              <span className="inline-flex w-fit items-center gap-2 px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] font-mono uppercase tracking-widest text-white/60 mb-4">
                {selected.type}
              </span>
              <p className="text-sm text-white/55 leading-relaxed mb-5">{selected.fact}</p>

              <div className="space-y-3 mb-5">
                <StatBar label="Distance" value={`${selected.distance_au} AU`} pct={Math.min(100, (selected.distance_au / 30) * 100)} />
                <StatBar label="Radius" value={`${formatNumber(selected.radius_km)} km`} pct={Math.min(100, (selected.radius_km / 70000) * 100)} />
                <StatBar label="Moons" value={formatNumber(selected.moons)} pct={Math.min(100, (selected.moons / 95) * 100)} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                <Field label="Orbital period" value={`${formatNumber(selected.orbital_period_days)} d`} />
                <Field label="Day length" value={`${formatNumber(selected.rotation_period_hours, 1)} h`} />
                <Field label="Avg temp" value={tempByType[selected.type] || "-"} />
                <Field label="Class" value={selected.type} />
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => setFocus(focus === selected.name ? null : selected.name)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                    focus === selected.name ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300" : "border-white/15 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <iconify-icon icon="solar:target-linear" width="16" />
                  {focus === selected.name ? "Focused" : "Focus Planet"}
                </button>
                <AIExplain
                  prompt={`Tell me about the planet ${selected.name} in a fun, beginner-friendly way.`}
                  contextType="planet"
                  contextData={{ name: selected.name }}
                  label="AI Planet Explanation"
                />
              </div>
            </GlassCard>
          )}

          <div className="lg:col-span-3">
            <div className="flex flex-wrap gap-3">
              {data.planets.map((p, i) => {
                const active = selected?.name === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => setSelected(p)}
                    className={`group flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full border transition-all ${
                      active ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full transition-transform group-hover:scale-125" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
                    <span className={`text-sm ${active ? "text-white" : "text-white/60"}`}>{p.name}</span>
                    <span className="font-mono text-[10px] text-white/30">0{i + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function Toggle({ on, onClick, icon, label }: { on: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors ${on ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300" : "border-white/10 text-white/50 hover:text-white"}`}>
      <iconify-icon icon={icon} width="15" /> {label}
    </button>
  );
}

function StatBar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-white/40 uppercase tracking-wider">{label}</span>
        <span className="text-white/70 font-mono">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-white/40 text-xs">{label}</span>
      <span className="text-white/80">{value}</span>
    </div>
  );
}
