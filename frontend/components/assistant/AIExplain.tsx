"use client";

import { useState } from "react";
import { sendAssistantMessage } from "@/lib/assistant";
import { FallbackBadge } from "@/components/ui/Badges";

export default function AIExplain({
  prompt,
  contextType,
  contextData,
  label = "AI Explain",
  compact = false,
}: {
  prompt: string;
  contextType?: string;
  contextData?: Record<string, unknown>;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [mode, setMode] = useState<"ai" | "fallback">("fallback");
  const [error, setError] = useState("");

  async function run() {
    setOpen(true);
    setLoading(true);
    setError("");
    try {
      const res = await sendAssistantMessage({
        message: prompt,
        context_type: contextType,
        context_data: contextData,
      });
      setReply(res.reply);
      setMode(res.mode);
    } catch {
      setError("The AI assistant is unavailable. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={run}
        className={
          compact
            ? "inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            : "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm hover:bg-cyan-500/20 transition-colors"
        }
      >
        <iconify-icon icon="solar:magic-stick-3-linear" width="16" />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <iconify-icon icon="solar:magic-stick-3-bold-duotone" width="22" className="text-cyan-400" />
                <h3 className="font-bricolage text-lg">AI Astronomy Assistant</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                <iconify-icon icon="solar:close-circle-linear" width="22" />
              </button>
            </div>
            <p className="text-xs text-white/40 mb-4 border-l-2 border-white/10 pl-3">{prompt}</p>
            {loading ? (
              <div className="flex items-center gap-3 text-white/50 py-8 justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-t-cyan-400 border-white/10 animate-spin" />
                Thinking...
              </div>
            ) : error ? (
              <p className="text-red-400 text-sm py-4">{error}</p>
            ) : (
              <>
                <div className="mb-3">
                  <FallbackBadge fallback={mode === "fallback"} />
                </div>
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line max-h-[50vh] overflow-y-auto hide-scrollbar">
                  {reply}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
