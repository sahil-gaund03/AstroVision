"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AIExplain from "@/components/assistant/AIExplain";
import SceneBoundary from "@/components/three/SceneBoundary";
import SpaceLoader from "./SpaceLoader";
import { SOLAR_SYSTEM_PLANETS, type PlanetData } from "@/data/solarSystemPlanets";

const SolarSystemScene = dynamic(() => import("./SolarSystemScene"), {
  ssr: false,
  loading: () => <SpaceLoader />,
});

const SPEEDS = [0.25, 0.5, 1, 2, 5];

export default function SolarSystemExperience({ isFallback }: { isFallback: boolean }) {
  const planets = SOLAR_SYSTEM_PLANETS;
  const [selected, setSelected] = useState<PlanetData>(planets[2]);
  const [speedMul, setSpeedMul] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  function resetView() { setFocusId(null); setResetSignal((n) => n + 1); }

  return (
    <div className="relative h-[calc(100vh-5rem)] w-full bg-[#05050a] overflow-hidden">
      {/* 3D canvas */}
      <div className="absolute inset-0">
        <SceneBoundary fallback={<SpaceLoader />}>
          <SolarSystemScene
            planets={planets}
            selectedId={selected.id}
            onSelect={setSelected}
            speedMul={speedMul}
            paused={paused}
            showOrbits={showOrbits}
            showLabels={showLabels}
            autoRotate={autoRotate}
            focusId={focusId}
            resetSignal={resetSignal}
          />
        </SceneBoundary>
      </div>

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-4 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/90">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live Orrery
          </div>
          <h1 className="font-bricolage text-2xl md:text-3xl font-semibold text-white mt-1">3D Solar System</h1>
          <p className="text-xs text-white/40">Interactive orrery with planetary intelligence</p>
        </div>
        <span className={`pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest ${isFallback ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isFallback ? "bg-amber-400" : "bg-emerald-400"}`} />
          {isFallback ? "Demo Orbital Data" : "Live Data"}
        </span>
      </div>

      {/* Paused overlay */}
      {paused && (
        <button onClick={() => setPaused(false)} className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group">
          <span className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/20 bg-black/60 text-sm text-white/90 group-hover:bg-black/70 transition-colors">
            <iconify-icon icon="solar:play-circle-linear" width="18" /> Paused — Click to Resume
          </span>
        </button>
      )}

      {/* Right intelligence panel */}
      <div className="absolute top-24 right-4 z-10 w-[300px] max-w-[calc(100%-2rem)] hidden md:block">
        <PlanetPanel planet={selected} focused={focusId === selected.id} onFocus={() => setFocusId(focusId === selected.id ? null : selected.id)} />
      </div>

      {/* Bottom: selector + controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex flex-wrap gap-2">
          {planets.map((p, i) => {
            const active = selected.id === p.id;
            return (
              <button key={p.id} onClick={() => setSelected(p)}
                className={`group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border backdrop-blur-xl transition-all ${active ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_-6px_rgba(34,211,238,0.6)]" : "border-white/10 bg-black/40 hover:bg-white/10"}`}>
                <span className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
                <span className={`text-xs ${active ? "text-white" : "text-white/60"}`}>{p.name}</span>
                <span className="font-mono text-[9px] text-white/30">0{i + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Speed</span>
            <input type="range" min={0} max={4} step={1} value={SPEEDS.indexOf(speedMul)} onChange={(e) => setSpeedMul(SPEEDS[Number(e.target.value)])} className="accent-cyan-400 w-24" />
            <span className="text-xs font-mono text-cyan-300 w-8">{speedMul}x</span>
          </div>
          <Toggle on={!paused} onClick={() => setPaused((p) => !p)} icon={paused ? "solar:play-linear" : "solar:pause-linear"} label={paused ? "Resume" : "Pause"} />
          <Toggle on={showOrbits} onClick={() => setShowOrbits((v) => !v)} icon="solar:share-circle-linear" label="Orbits" />
          <Toggle on={showLabels} onClick={() => setShowLabels((v) => !v)} icon="solar:tag-linear" label="Labels" />
          <Toggle on={autoRotate} onClick={() => setAutoRotate((v) => !v)} icon="solar:refresh-linear" label="Auto-rotate" />
          <button onClick={resetView} className="ml-auto inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
            <iconify-icon icon="solar:full-screen-square-linear" width="15" /> Reset view
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, icon, label }: { on: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors ${on ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300" : "border-white/10 text-white/50 hover:text-white"}`}>
      <iconify-icon icon={icon} width="15" /> {label}
    </button>
  );
}

function PlanetPanel({ planet, focused, onFocus }: { planet: PlanetData; focused: boolean; onFocus: () => void }) {
  const fmt = (n: number) => n.toLocaleString("en-US");
  return (
    <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-2xl p-5 shadow-2xl ring-1 ring-cyan-500/10">
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400">Planet Intelligence</span>
      <div className="flex items-center gap-3 mt-2 mb-1">
        <span className="w-8 h-8 rounded-full shrink-0" style={{ background: planet.color, boxShadow: `0 0 22px ${planet.color}` }} />
        <h3 className="font-bricolage text-xl text-white">{planet.name}</h3>
      </div>
      <span className="inline-flex w-fit px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] font-mono uppercase tracking-widest text-white/60 mb-3">{planet.type}</span>
      <p className="text-xs text-white/55 leading-relaxed mb-4">{planet.description}</p>
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <Field label="Radius" value={`${fmt(planet.radiusKm)} km`} />
        <Field label="Distance" value={`${fmt(planet.distanceFromSunKm)} km`} />
        <Field label="Orbit" value={`${fmt(planet.orbitalPeriodDays)} d`} />
        <Field label="Day" value={`${planet.dayLengthHours} h`} />
        <Field label="Moons" value={`${planet.moons}`} />
        <Field label="Avg temp" value={planet.averageTemperature} />
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onFocus} className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${focused ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300" : "border-white/15 text-white/70 hover:bg-white/10"}`}>
          <iconify-icon icon="solar:target-linear" width="16" /> {focused ? "Focused" : "Focus Planet"}
        </button>
        <AIExplain prompt={`Tell me about the planet ${planet.name} in a fun, beginner-friendly way.`} contextType="planet" contextData={{ name: planet.name }} label="AI Planet Explanation" />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-white/40 text-[11px]">{label}</span>
      <span className="text-white/80 text-xs">{value}</span>
    </div>
  );
}
