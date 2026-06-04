"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/ui/GlassCard";
import { FallbackBadge } from "@/components/ui/Badges";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import BarChart from "@/components/charts/BarChart";
import AIExplain from "@/components/assistant/AIExplain";
import { api } from "@/lib/api";
import { formatNumber, habitabilityColor } from "@/lib/utils";
import type { Exoplanet, ExoplanetStats } from "@/lib/types";

export default function ExoplanetsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [fallback, setFallback] = useState(false);
  const [stats, setStats] = useState<ExoplanetStats | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Exoplanet | null>(null);

  async function load(q?: string) {
    setLoading(true);
    setError("");
    try {
      const [list, st] = await Promise.allSettled([
        q ? api.searchExoplanets(q, 200) : api.getConfirmedExoplanets({ limit: 200 }),
        api.getExoplanetStats(),
      ]);
      if (list.status === "fulfilled") {
        setPlanets(list.value.exoplanets);
        setFallback(!!list.value.fallback);
        setSelected(list.value.exoplanets[0] || null);
      } else {
        throw new Error("exoplanet list failed");
      }
      if (st.status === "fulfilled") setStats(st.value);
    } catch {
      setError("Could not load exoplanet data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const methodData = useMemo(
    () =>
      stats
        ? Object.entries(stats.discovery_methods)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([label, value]) => ({ label, value }))
        : [],
    [stats]
  );

  const yearData = useMemo(
    () =>
      stats
        ? Object.entries(stats.discoveries_by_year)
            .slice(-8)
            .map(([label, value]) => ({ label, value }))
        : [],
    [stats]
  );

  const radiusBuckets = useMemo(() => {
    const buckets = { "<1 R_earth": 0, "1-2 R_earth": 0, "2-4 R_earth": 0, ">4 R_earth": 0 };
    planets.forEach((p) => {
      const r = p.planet_radius_earth;
      if (r == null) return;
      if (r < 1) buckets["<1 R_earth"]++;
      else if (r < 2) buckets["1-2 R_earth"]++;
      else if (r < 4) buckets["2-4 R_earth"]++;
      else buckets[">4 R_earth"]++;
    });
    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
  }, [planets]);

  return (
    <DashboardShell
      title="Exoplanet Discovery"
      subtitle="Confirmed worlds from the NASA Exoplanet Archive with habitability scoring"
      actions={stats && <FallbackBadge fallback={fallback || !!stats.fallback} />}
    >
      {loading ? (
        <Loading label="Querying the Exoplanet Archive..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400">Total Loaded</span>
              <div className="text-4xl font-bricolage text-white mt-2">{formatNumber(stats?.total)}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-white/40 text-xs">Avg radius</span>
                  {formatNumber(stats?.avg_radius_earth, 2)} R_earth
                </div>
                <div>
                  <span className="block text-white/40 text-xs">Avg period</span>
                  {formatNumber(stats?.avg_orbital_period_days, 1)} d
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Discovery Methods</span>
              <div className="mt-4"><BarChart data={methodData} accent="bg-cyan-500" /></div>
            </GlassCard>
            <GlassCard className="p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Radius Distribution</span>
              <div className="mt-4"><BarChart data={radiusBuckets} accent="bg-amber-500" /></div>
            </GlassCard>
          </div>

          {yearData.length > 0 && (
            <GlassCard className="p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Discoveries by Year (recent)</span>
              <div className="mt-4"><BarChart data={yearData} accent="bg-emerald-500" /></div>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-6">
              <form onSubmit={(e) => { e.preventDefault(); load(query.trim()); }} className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={100}
                  placeholder="Search planet or host star (e.g. Kepler)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30"
                />
                <button className="px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200">Search</button>
              </form>
              {planets.length === 0 ? (
                <EmptyState message="No matching exoplanets." icon="solar:planet-2-linear" />
              ) : (
                <div className="overflow-x-auto hide-scrollbar max-h-[420px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="text-white/40 text-[11px] uppercase tracking-wider sticky top-0 bg-neutral-900">
                      <tr className="text-left">
                        <th className="py-2 pr-4">Planet</th>
                        <th className="py-2 pr-4">Method</th>
                        <th className="py-2 pr-4">R_earth</th>
                        <th className="py-2 pr-4">Habitability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planets.map((p) => (
                        <tr
                          key={p.planet_name}
                          onClick={() => setSelected(p)}
                          className={`border-t border-white/5 cursor-pointer hover:bg-white/5 ${
                            selected?.planet_name === p.planet_name ? "bg-white/5" : ""
                          }`}
                        >
                          <td className="py-2 pr-4 text-white">{p.planet_name}</td>
                          <td className="py-2 pr-4 text-white/50">{p.discovery_method || "-"}</td>
                          <td className="py-2 pr-4 text-white/70">{formatNumber(p.planet_radius_earth, 2)}</td>
                          <td className="py-2 pr-4">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${habitabilityColor(p.habitability_category)}`}>
                              {p.habitability_score} {p.habitability_category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>

            {selected && (
              <GlassCard className="p-6" glow>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Selected World</span>
                <h3 className="font-bricolage text-2xl text-white mt-2 mb-1">{selected.planet_name}</h3>
                <p className="text-xs text-white/40 mb-4">
                  {selected.host_star || "-"} / {selected.discovery_method || "-"} / {selected.discovery_year || "-"}
                </p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${habitabilityColor(selected.habitability_category)}`}>
                  <span className="font-bricolage text-lg">{selected.habitability_score}</span>
                  <span className="text-xs uppercase tracking-widest">{selected.habitability_category}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <Field label="Radius" value={`${formatNumber(selected.planet_radius_earth, 2)} R_earth`} />
                  <Field label="Mass" value={`${formatNumber(selected.planet_mass_earth, 2)} M_earth`} />
                  <Field label="Orbital period" value={`${formatNumber(selected.orbital_period_days, 1)} d`} />
                  <Field label="Eq. temp" value={`${formatNumber(selected.equilibrium_temperature)} K`} />
                  <Field label="Star temp" value={`${formatNumber(selected.stellar_temperature)} K`} />
                  <Field label="Star radius" value={`${formatNumber(selected.stellar_radius, 2)} R_sun`} />
                </div>
                {selected.missing_data_warning && (
                  <p className="text-[11px] text-amber-400/80 mb-4">Warning: {selected.missing_data_warning}</p>
                )}
                <p className="text-[11px] text-white/30 mb-4 italic">Educational approximation - not a scientifically validated habitability model.</p>
                <AIExplain
                  prompt={`Could ${selected.planet_name} support life? Its habitability score is ${selected.habitability_score}/100 (${selected.habitability_category}).`}
                  contextType="exoplanet"
                  contextData={{ name: selected.planet_name, score: selected.habitability_score }}
                  label="AI Habitability Explanation"
                />
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
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
