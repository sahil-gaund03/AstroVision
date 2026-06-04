"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/ui/GlassCard";
import { FallbackBadge } from "@/components/ui/Badges";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import BarChart from "@/components/charts/BarChart";
import AIExplain from "@/components/assistant/AIExplain";
import { api } from "@/lib/api";
import { formatNumber, riskColor } from "@/lib/utils";
import type { APOD, Asteroid, ExoplanetStats, NASAImage } from "@/lib/types";

const MODULES = [
  { label: "NASA Explorer", href: "/nasa-explorer", icon: "solar:gallery-linear", desc: "APOD, Mars rovers & image library" },
  { label: "Exoplanets", href: "/exoplanets", icon: "solar:planet-2-linear", desc: "5,500+ confirmed worlds & habitability" },
  { label: "Asteroids", href: "/asteroids", icon: "solar:meteor-linear", desc: "Near-Earth object risk tracker" },
  { label: "Solar System", href: "/solar-system", icon: "solar:sun-linear", desc: "Interactive 3D orrery" },
  { label: "AI Assistant", href: "/assistant", icon: "solar:chat-round-line-linear", desc: "Conversational astronomy AI" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [fatal, setFatal] = useState(false);
  const [apod, setApod] = useState<APOD | null>(null);
  const [images, setImages] = useState<NASAImage[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [stats, setStats] = useState<ExoplanetStats | null>(null);

  async function load() {
    setLoading(true);
    setFatal(false);
    const [a, i, ast, st] = await Promise.allSettled([
      api.getAPOD(),
      api.searchNASAImages("nebula"),
      api.getUpcomingAsteroids(),
      api.getExoplanetStats(),
    ]);
    if (a.status === "fulfilled") setApod(a.value);
    if (i.status === "fulfilled") setImages(i.value.items.slice(0, 4));
    if (ast.status === "fulfilled") setAsteroids(ast.value.asteroids.slice(0, 4));
    if (st.status === "fulfilled") setStats(st.value);
    if (a.status === "rejected" && i.status === "rejected" && ast.status === "rejected" && st.status === "rejected")
      setFatal(true);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const methodData = stats
    ? Object.entries(stats.discovery_methods).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }))
    : [];

  return (
    <DashboardShell
      title="Mission Control"
      subtitle="Live overview of NASA data, exoplanets, and near-Earth objects"
      actions={
        <AIExplain
          prompt="Give me a short, exciting summary of what's happening in space exploration and astronomy right now."
          contextType="general"
          label="AI Space Summary"
        />
      }
    >
      {loading ? (
        <Loading />
      ) : fatal ? (
        <ErrorState message="Could not reach the backend. Start it on port 8000 and retry." onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {apod ? (
            <GlassCard className="lg:col-span-2 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-56 md:h-full min-h-[220px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={apod.url} alt={apod.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Picture of the Day</span>
                    <FallbackBadge fallback={apod.fallback} />
                  </div>
                  <h3 className="font-bricolage text-xl text-white mb-2">{apod.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-5">{apod.explanation}</p>
                  <div className="mt-4">
                    <AIExplain
                      prompt={`Explain this NASA Astronomy Picture of the Day in simple terms: "${apod.title}".`}
                      contextType="apod"
                      contextData={{ title: apod.title }}
                      compact
                      label="Explain with AI"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="lg:col-span-2 p-6">
              <EmptyState message="No APOD data returned." icon="solar:gallery-linear" />
            </GlassCard>
          )}

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400">Exoplanet Archive</span>
              {stats && <FallbackBadge fallback={stats.fallback} />}
            </div>
            {stats ? (
              <>
                <div className="text-4xl font-bricolage text-white mb-1">{formatNumber(stats.total)}</div>
                <p className="text-xs text-white/40 mb-5 uppercase tracking-widest">Confirmed worlds loaded</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3">Discovery methods</p>
                <BarChart data={methodData} accent="bg-violet-500" />
              </>
            ) : (
              <EmptyState message="No exoplanet stats returned." icon="solar:planet-2-linear" />
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Asteroid Alerts</span>
              <Link href="/asteroids" className="text-xs text-white/40 hover:text-white">View all</Link>
            </div>
            {asteroids.length === 0 ? (
              <EmptyState message="No asteroid data returned." icon="solar:meteor-linear" />
            ) : (
              <div className="flex flex-col gap-3">
                {asteroids.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white/70 truncate">{a.name}</span>
                  <span className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border ${riskColor(a.risk_level)}`}>
                    {a.risk_level} {a.risk_score}
                  </span>
                </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Latest NASA Imagery</span>
              <Link href="/nasa-explorer" className="text-xs text-white/40 hover:text-white">Explore</Link>
            </div>
            {images.length === 0 ? (
              <EmptyState message="No NASA images returned." icon="solar:gallery-linear" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((img) => (
                <div key={img.nasa_id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumbnail} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 text-[10px] text-white/80 line-clamp-2">{img.title}</span>
                </div>
                ))}
              </div>
            )}
          </GlassCard>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {MODULES.map((m) => (
              <Link key={m.href} href={m.href}>
                <GlassCard className="p-5 h-full hover:bg-neutral-900/70 transition-colors group">
                  <iconify-icon icon={m.icon} width="26" className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bricolage text-white mt-3 mb-1">{m.label}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{m.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
