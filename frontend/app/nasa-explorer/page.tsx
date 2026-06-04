"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/ui/GlassCard";
import { FallbackBadge } from "@/components/ui/Badges";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import AIExplain from "@/components/assistant/AIExplain";
import { api } from "@/lib/api";
import { ROVERS, CAMERAS } from "@/lib/nasa";
import { todayISO } from "@/lib/utils";
import type { APOD, FavoriteType, MarsPhoto, NASAImage } from "@/lib/types";

type Tab = "apod" | "mars" | "search";

export default function NasaExplorerPage() {
  const [tab, setTab] = useState<Tab>("apod");

  const [date, setDate] = useState(todayISO());
  const [apod, setApod] = useState<APOD | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [apodError, setApodError] = useState("");

  const [rover, setRover] = useState<string>("curiosity");
  const [camera, setCamera] = useState<string>("");
  const [marsPhotos, setMarsPhotos] = useState<MarsPhoto[]>([]);
  const [marsFallback, setMarsFallback] = useState(false);
  const [marsLoading, setMarsLoading] = useState(false);
  const [marsError, setMarsError] = useState("");

  const [query, setQuery] = useState("galaxy");
  const [images, setImages] = useState<NASAImage[]>([]);
  const [imgFallback, setImgFallback] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState("");

  const [modal, setModal] = useState<{ img: string; title: string; desc?: string } | null>(null);
  const [faved, setFaved] = useState<Record<string, boolean>>({});

  async function loadApod(d?: string) {
    setApodLoading(true);
    setApodError("");
    try {
      setApod(await api.getAPOD(d));
    } catch {
      setApodError("Could not load APOD. Is the backend running?");
      setApod(null);
    } finally {
      setApodLoading(false);
    }
  }

  async function loadMars() {
    setMarsLoading(true);
    setMarsError("");
    try {
      const res = await api.getMarsRoverPhotos({ rover, camera: camera || undefined });
      setMarsPhotos(res.photos);
      setMarsFallback(!!res.fallback);
    } catch {
      setMarsPhotos([]);
      setMarsError("Could not load rover photos. Check the backend and try again.");
    } finally {
      setMarsLoading(false);
    }
  }

  async function loadImages(q: string) {
    setImgLoading(true);
    setImgError("");
    try {
      const res = await api.searchNASAImages(q.trim() || "galaxy");
      setImages(res.items);
      setImgFallback(!!res.fallback);
    } catch {
      setImages([]);
      setImgError("Could not search NASA images. Check the backend and try again.");
    } finally {
      setImgLoading(false);
    }
  }

  useEffect(() => {
    loadApod();
  }, []);

  useEffect(() => {
    if (tab === "mars" && marsPhotos.length === 0 && !marsError) loadMars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab === "search" && images.length === 0 && !imgError) loadImages(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function favorite(type: FavoriteType, title: string, payload: Record<string, unknown>) {
    const key = `${type}:${title}`;
    try {
      await api.addFavorite({ type, title, payload });
      setFaved((current) => ({ ...current, [key]: true }));
    } catch {
      setFaved((current) => ({ ...current, [key]: false }));
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "apod", label: "Picture of the Day" },
    { id: "mars", label: "Mars Rover" },
    { id: "search", label: "Image Search" },
  ];

  return (
    <DashboardShell title="NASA Explorer" subtitle="Astronomy imagery, Mars rovers, and the NASA media library">
      <div className="flex gap-1 mb-6 p-1.5 rounded-full bg-neutral-900/60 border border-white/10 w-fit max-w-full overflow-x-auto hide-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              tab === t.id ? "bg-white text-black" : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "apod" &&
        (apodLoading ? (
          <Loading />
        ) : apodError ? (
          <ErrorState message={apodError} onRetry={() => loadApod(date)} />
        ) : apod ? (
          <GlassCard className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={apod.hdurl || apod.url}
                  alt={apod.title}
                  className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setModal({ img: apod.hdurl || apod.url, title: apod.title, desc: apod.explanation })}
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <input
                    type="date"
                    value={date}
                    max={todayISO()}
                    onChange={(e) => {
                      setDate(e.target.value);
                      loadApod(e.target.value);
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 [color-scheme:dark]"
                  />
                  <FallbackBadge fallback={apod.fallback} />
                </div>
                <h2 className="font-bricolage text-2xl text-white mb-3">{apod.title}</h2>
                <p className="text-sm text-white/50 leading-relaxed max-h-64 overflow-y-auto hide-scrollbar">{apod.explanation}</p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <AIExplain
                    prompt={`Explain "${apod.title}" from NASA's Astronomy Picture of the Day for a beginner.`}
                    contextType="apod"
                    contextData={{ title: apod.title }}
                  />
                  <button
                    onClick={() => favorite("apod", apod.title, { url: apod.url })}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <iconify-icon icon={faved[`apod:${apod.title}`] ? "solar:heart-bold" : "solar:heart-linear"} width="16" />
                    {faved[`apod:${apod.title}`] ? "Saved" : "Favorite"}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          <EmptyState message="No picture of the day data returned." icon="solar:gallery-linear" />
        ))}

      {tab === "mars" && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <select value={rover} onChange={(e) => setRover(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 capitalize">
              {ROVERS.map((r) => (
                <option key={r} value={r} className="bg-neutral-900">
                  {r}
                </option>
              ))}
            </select>
            <select value={camera} onChange={(e) => setCamera(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80">
              <option value="" className="bg-neutral-900">
                All cameras
              </option>
              {CAMERAS.map((c) => (
                <option key={c} value={c} className="bg-neutral-900">
                  {c}
                </option>
              ))}
            </select>
            <button onClick={loadMars} className="px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200">
              Apply
            </button>
            {marsPhotos.length > 0 && (
              <div className="ml-auto self-center">
                <FallbackBadge fallback={marsFallback} />
              </div>
            )}
          </div>
          {marsLoading ? (
            <Loading label="Loading rover frames..." />
          ) : marsError ? (
            <ErrorState message={marsError} onRetry={loadMars} />
          ) : marsPhotos.length === 0 ? (
            <EmptyState message="No photos for this rover/camera combination." icon="solar:camera-linear" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {marsPhotos.map((p) => (
                <GlassCard key={p.id} className="overflow-hidden group">
                  <div className="relative aspect-square cursor-zoom-in" onClick={() => setModal({ img: p.img_src, title: `${p.rover} / ${p.camera}` })}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img_src} alt={p.camera} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-white/50">{p.camera} / {p.earth_date}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "search" && (
        <>
          <form onSubmit={(e) => { e.preventDefault(); loadImages(query); }} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={100}
              placeholder="Search NASA images (galaxy, mars, apollo...)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30"
            />
            <button className="px-6 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200">Search</button>
          </form>
          {imgLoading ? (
            <Loading />
          ) : imgError ? (
            <ErrorState message={imgError} onRetry={() => loadImages(query)} />
          ) : images.length === 0 ? (
            <EmptyState message="No images found. Try another search." icon="solar:gallery-linear" />
          ) : (
            <>
              <div className="mb-4">
                <FallbackBadge fallback={imgFallback} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <GlassCard key={img.nasa_id} className="overflow-hidden group">
                    <div className="relative aspect-square cursor-zoom-in" onClick={() => setModal({ img: img.image, title: img.title, desc: img.description })}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.thumbnail} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs text-white/80 line-clamp-2 mb-2">{img.title}</h4>
                      <button onClick={() => favorite("image", img.title, { image: img.image })} className="text-[11px] text-white/40 hover:text-cyan-400 inline-flex items-center gap-1">
                        <iconify-icon icon={faved[`image:${img.title}`] ? "solar:heart-bold" : "solar:heart-linear"} width="13" />
                        {faved[`image:${img.title}`] ? "Saved" : "Favorite"}
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={modal.img} alt={modal.title} className="w-full max-h-[70vh] object-contain rounded-xl" />
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-bricolage text-white truncate">{modal.title}</h3>
                {modal.desc && <p className="text-xs text-white/40 line-clamp-2 max-w-2xl">{modal.desc}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <AIExplain prompt={`Explain this NASA image: "${modal.title}".`} contextType="image" contextData={{ title: modal.title }} compact label="AI Explain" />
                <button onClick={() => setModal(null)} className="text-white/60 hover:text-white">
                  <iconify-icon icon="solar:close-circle-linear" width="26" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
