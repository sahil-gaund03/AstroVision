"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Planet, SolarSystem } from "@/lib/types";

export default function Orrery({
  data,
  selected,
  onSelect,
  speed,
}: {
  data: SolarSystem;
  selected: Planet | null;
  onSelect: (p: Planet) => void;
  speed: number;
}) {
  const [paused, setPaused] = useState(false);
  const planets = data.planets;
  const maxAU = Math.max(...planets.map((p) => p.distance_au));

  const orbitR = (au: number) => 70 + (Math.log10(au + 1) / Math.log10(maxAU + 1)) * 270;

  return (
    <div className="relative w-full aspect-square max-w-[640px] mx-auto" onClick={() => setPaused((p) => !p)}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_70%)]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-12 h-12 rounded-full" style={{ background: data.star.color, boxShadow: `0 0 40px ${data.star.color}, 0 0 80px ${data.star.color}80` }} />
      </div>

      {planets.map((p) => {
        const r = orbitR(p.distance_au);
        const duration = Math.max(6, (p.orbital_period_days / 365) * 24) / speed;
        const isSel = selected?.name === p.name;
        const size = Math.max(6, Math.min(20, p.radius_km / 4000));
        return (
          <div key={p.name} className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0 }}>
            <div className="absolute rounded-full border border-white/10" style={{ width: r * 2, height: r * 2, left: -r, top: -r }} />
            <div
              className="absolute"
              style={{
                width: r * 2,
                height: r * 2,
                left: -r,
                top: -r,
                animation: `spin ${duration}s linear infinite`,
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(p);
                }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150 z-10",
                  isSel && "ring-2 ring-white ring-offset-2 ring-offset-neutral-950 scale-150"
                )}
                style={{
                  left: "50%",
                  top: 0,
                  width: size,
                  height: size,
                  background: p.color,
                  boxShadow: `0 0 12px ${p.color}`,
                }}
                title={p.name}
              />
            </div>
          </div>
        );
      })}

      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-white/30">
        {paused ? "Paused - click to resume" : "Click orbit area to pause"}
      </span>
    </div>
  );
}
