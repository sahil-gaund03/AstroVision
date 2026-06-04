"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground({ src }: { src: string }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    function onMove(e: PointerEvent) {
      if (isMobile()) {
        targetX = 0;
        targetY = 0;
        return;
      }
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    }

    function tick() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      const t = performance.now();
      const driftX = Math.sin(t / 9000) * 6;
      const driftY = Math.cos(t / 11000) * 4;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${curX * -18 + driftX}px, ${curY * -12 + driftY}px, 0) scale(1.1)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${curX * -10}px, ${curY * -7}px, 0)`;
      }
      if (starRef.current) {
        starRef.current.style.transform = `translate3d(${curX * 26}px, ${curY * 18}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    }

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.1)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Deep space nebula"
          className="w-full h-full object-cover object-[70%_center] animate-cinematic opacity-0 [filter:contrast(1.12)_saturate(0.95)_brightness(0.92)]"
        />
        <div className="absolute inset-0 bg-[#0a1430] mix-blend-color opacity-25" />
      </div>

      <div
        ref={starRef}
        className="absolute -inset-10 will-change-transform pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.5), transparent), radial-gradient(1.5px 1.5px at 45% 80%, rgba(173,216,255,0.6), transparent), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.4), transparent)",
          backgroundSize: "600px 600px",
        }}
      />

      <div
        ref={glowRef}
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 50% at 78% 32%, rgba(56,189,248,0.16), transparent 70%), radial-gradient(45% 45% at 88% 65%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      <div className="absolute inset-0 z-[1] bg-black/30" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-neutral-950/85 via-neutral-950/35 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-neutral-950/40" />
      <div className="absolute inset-0 z-[1] pointer-events-none [background:radial-gradient(120%_120%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
