"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/ui/GlassCard";
import { FallbackBadge } from "@/components/ui/Badges";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import BarChart from "@/components/charts/BarChart";
import AIExplain from "@/components/assistant/AIExplain";
import { api } from "@/lib/api";
import { formatNumber, riskColor } from "@/lib/utils";
import type { Asteroid } from "@/lib/types";

export default function AsteroidsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [fallback, setFallback] = useState(false);
  const [selected, setSelected] = useState<Asteroid | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.getUpcomingAsteroids();
      setAsteroids(res.asteroids);
      setFallback(!!res.fallback);
      setSelected(res.asteroids[0] || null);
    } catch {
      setError("Could not load asteroid data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    asteroids.forEach((a) => {
      counts[a.risk_level] = (counts[a.risk_level] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [asteroids]);

  const hazardous = asteroids.filter((a) => a.is_potentially_hazardous).length;

  return (
    <DashboardShell
      title="Asteroid Risk Tracker"
      subtitle="Near-Earth objects with educational risk scoring (next 7 days)"
      actions={asteroids.length > 0 && <FallbackBadge fallback={fallback} />}
    >
      {loading ? (
        <Loading label="Scanning near-Earth objects..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : asteroids.length === 0 ? (
        <EmptyState message="No upcoming asteroids found." icon="solar:meteor-linear" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Tile label="Tracked" value={formatNumber(asteroids.length)} accent="text-cyan-400" />
            <Tile label="Hazardous" value={formatNumber(hazardous)} accent="text-red-400" />
            <Tile label="Highest Risk" value={`${asteroids[0]?.risk_score ?? 0}/100`} accent="text-orange-400" />
            <GlassCard className="p-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Risk Levels</span>
              <div className="mt-3"><BarChart data={levelCounts} accent="bg-orange-500" /></div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Close Approaches (sorted by risk)</span>
              <div className="mt-4 flex flex-col gap-2 max-h-[460px] overflow-y-auto hide-scrollbar">
                {asteroids.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      selected?.id === a.id ? "border-white/20 bg-white/5" : "border-white/5 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-white font-medium truncate">{a.name}</span>
                      <span className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border ${riskColor(a.risk_level)}`}>
                        {a.risk_level} {a.risk_score}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/40 font-mono">
                      <span>diam {formatNumber(a.estimated_diameter_km, 3)} km</span>
                      <span>{formatNumber(a.relative_velocity_kph)} kph</span>
                      <span>{formatNumber(a.miss_distance_km)} km miss</span>
                      {a.is_potentially_hazardous && <span className="text-red-400">hazardous</span>}
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>

            {selected && (
              <GlassCard className="p-6" glow>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Selected Object</span>
                <h3 className="font-bricolage text-xl text-white mt-2 mb-3">{selected.name}</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${riskColor(selected.risk_level)}`}>
                  <span className="font-bricolage text-lg">{selected.risk_score}</span>
                  <span className="text-xs uppercase tracking-widest">{selected.risk_level} Risk</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <Field label="Diameter" value={`${formatNumber(selected.estimated_diameter_km, 3)} km`} />
                  <Field label="Velocity" value={`${formatNumber(selected.relative_velocity_kph)} kph`} />
                  <Field label="Miss distance" value={`${formatNumber(selected.miss_distance_km)} km`} />
                  <Field label="Approach" value={selected.close_approach_date} />
                  <Field label="Hazardous" value={selected.is_potentially_hazardous ? "Yes" : "No"} />
                  <Field label="Magnitude" value={formatNumber(selected.absolute_magnitude_h, 1)} />
                </div>
                <p className="text-[11px] text-white/30 mb-4 italic">Educational heuristic - not an official NASA hazard assessment.</p>
                <AIExplain
                  prompt={`Explain the risk of asteroid ${selected.name}. It scored ${selected.risk_score}/100 (${selected.risk_level}).`}
                  contextType="asteroid"
                  contextData={{ name: selected.name, score: selected.risk_score }}
                  label="AI Risk Explanation"
                />
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function Tile({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <GlassCard className="p-5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{label}</span>
      <div className={`text-3xl font-bricolage mt-2 ${accent}`}>{value}</div>
    </GlassCard>
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
