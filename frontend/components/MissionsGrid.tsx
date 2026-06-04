"use client";

import { useState } from "react";
import Link from "next/link";

type Cat = "exploration" | "analytics";
type Mission = {
  num: string;
  title: string;
  href: string;
  cat: Cat;
  tag: string;
  tagColor: string;
  desc: string;
  img: string;
  featured?: boolean;
  stats?: { label: string; value: string }[];
};

const MISSIONS: Mission[] = [
  {
    num: "01",
    title: "NASA Astronomy Explorer",
    href: "/nasa-explorer",
    cat: "exploration",
    tag: "Astronomy Picture of the Day",
    tagColor: "emerald",
    desc: "Stream NASA's daily astronomy imagery with full metadata, HD downloads, and AI-generated context for every celestial capture.",
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    stats: [
      { label: "Daily Frames", value: "9,400+" },
      { label: "Resolution", value: "8K HDR" },
    ],
  },
  {
    num: "02",
    title: "Exoplanet Discovery Dashboard",
    href: "/exoplanets",
    cat: "analytics",
    tag: "Confirmed Worlds",
    tagColor: "amber",
    desc: "Analyze 5,500+ confirmed exoplanets with habitability scoring and orbital telemetry.",
    img: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "03",
    title: "Near-Earth Asteroid Tracker",
    href: "/asteroids",
    cat: "analytics",
    tag: "Risk Monitor",
    tagColor: "amber",
    desc: "Live close-approach feed with velocity, miss-distance, and hazard classification.",
    img: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "04",
    title: "Mars Rover Image Lab",
    href: "/nasa-explorer",
    cat: "exploration",
    tag: "Surface Ops",
    tagColor: "amber",
    desc: "Browse Curiosity & Perseverance frames by sol, camera, and AI scene tags.",
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "05",
    title: "3D Solar System",
    href: "/solar-system",
    cat: "exploration",
    tag: "Orbital Sim",
    tagColor: "emerald",
    desc: "Real-time WebGL orrery with accurate orbits, scale modes, and time travel.",
    img: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "06",
    title: "AI Astronomy Assistant",
    href: "/assistant",
    cat: "analytics",
    tag: "Conversational",
    tagColor: "emerald",
    desc: "Ask anything about the cosmos and get grounded, source-cited explanations.",
    img: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1600&auto=format&fit=crop",
  },
];

const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "All Modules" },
  { id: "exploration", label: "Exploration" },
  { id: "analytics", label: "Analytics" },
];

export default function MissionsGrid() {
  const [filter, setFilter] = useState<"all" | Cat>("all");

  return (
    <>
      {/* Functional Segmented Controls */}
      <div className="relative group animate-on-scroll delay-100 self-end md:self-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="relative flex items-center p-1.5 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl">
          {TABS.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  active
                    ? "bg-white text-neutral-950 shadow-lg shadow-white/5 scale-105"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic asymmetric grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[260px] gap-6 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
        {MISSIONS.map((m, i) => {
          const visible = filter === "all" || m.cat === filter;
          const span = m.featured ? "md:col-span-8 md:row-span-2" : "md:col-span-4";
          return (
            <Link
              href={m.href}
              key={m.title}
              className={`group relative ${span} ${
                visible ? "" : "hidden"
              } rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.25)] hover:ring-1 hover:ring-cyan-400/20 animate-on-scroll delay-${
                ((i % 4) + 1) * 100
              } min-h-[300px] md:min-h-0`}
            >
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              </div>

              {/* HUD */}
              <div className="absolute top-6 right-6 z-20">
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                  <span className="font-bricolage text-sm font-medium">{m.num}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.tagColor === "emerald"
                          ? "bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)]"
                          : "bg-amber-500 shadow-[0_0_10px_rgb(245,158,11)]"
                      }`}
                    />
                    <span
                      className={`text-[10px] uppercase tracking-widest font-mono ${
                        m.tagColor === "emerald" ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <h3
                    className={`font-bricolage font-medium text-white mb-2 tracking-tight ${
                      m.featured ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
                    }`}
                  >
                    {m.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {m.desc}
                  </p>

                  {m.featured && m.stats && (
                    <div className="flex items-center gap-8 pt-6 mt-4 border-t border-white/10 text-xs font-mono text-white/40 uppercase tracking-widest">
                      {m.stats.map((s) => (
                        <div key={s.label}>
                          <span className="block text-white mb-1">{s.label}</span>
                          {s.value}
                        </div>
                      ))}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors bg-white/5 backdrop-blur-md">
                          <iconify-icon icon="solar:arrow-right-linear" width="20" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
