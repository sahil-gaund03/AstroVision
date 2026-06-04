"use client";

import { useRef, useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import GlassCard from "@/components/ui/GlassCard";
import { DemoBadge, LiveBadge } from "@/components/ui/Badges";
import { sendAssistantMessage, CONTEXT_TYPES, SUGGESTED_PROMPTS } from "@/lib/assistant";

type Msg = { role: "user" | "assistant"; text: string; mode?: "ai" | "fallback" };

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I'm AstroVision's astronomy assistant. Ask me about planets, stars, galaxies, asteroids, exoplanets - or try a quick quiz.",
      mode: "fallback",
    },
  ]);
  const [input, setInput] = useState("");
  const [ctx, setCtx] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;
    setError("");
    setMessages((current) => [...current, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendAssistantMessage({ message: msg, context_type: ctx });
      setMessages((current) => [...current, { role: "assistant", text: res.reply, mode: res.mode }]);
    } catch {
      setError("The assistant is unavailable. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell title="AI Astronomy Assistant" subtitle="Grounded, beginner-friendly answers about the cosmos">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Context</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {CONTEXT_TYPES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCtx(c.id)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    ctx === c.id ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Suggested</span>
            <div className="mt-3 flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-left text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="lg:col-span-3 flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white/80"}`}>
                  {m.role === "assistant" && (
                    <div className="mb-2">{m.mode === "ai" ? <LiveBadge label="AI" /> : <DemoBadge label="Offline Demo" />}</div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10 flex items-center gap-2 text-white/50 text-sm">
                  <div className="w-4 h-4 rounded-full border-2 border-t-cyan-400 border-white/10 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-white/10 p-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask about the universe..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              <iconify-icon icon="solar:arrow-up-linear" width="20" />
            </button>
          </form>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
