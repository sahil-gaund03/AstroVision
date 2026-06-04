"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "solar:widget-5-linear" },
  { label: "NASA Explorer", href: "/nasa-explorer", icon: "solar:gallery-linear" },
  { label: "Exoplanets", href: "/exoplanets", icon: "solar:planet-2-linear" },
  { label: "Asteroids", href: "/asteroids", icon: "solar:meteor-linear" },
  { label: "Solar System", href: "/solar-system", icon: "solar:sun-linear" },
  { label: "AI Assistant", href: "/assistant", icon: "solar:chat-round-line-linear" },
];

export default function DashboardShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/3 w-[60vw] h-[500px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[40vw] h-[400px] bg-violet-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 bg-neutral-950/80 backdrop-blur-xl sticky top-0 h-screen z-30">
        <Link href="/" className="flex items-center gap-3 px-6 h-20 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black">
            <iconify-icon icon="solar:planet-bold-duotone" width="20" />
          </div>
          <span className="font-bricolage text-sm font-medium leading-tight">
            AstroVision
            <span className="block text-[10px] text-white/40 tracking-widest uppercase">ExoLab AI</span>
          </span>
        </Link>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                  active
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <iconify-icon icon={n.icon} width="20" />
                {n.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgb(34,211,238)]" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
            <iconify-icon icon="solar:arrow-left-linear" width="16" />
            Back to landing
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 relative z-10">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 h-20">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bricolage font-medium tracking-tight text-white truncate">{title}</h1>
              {subtitle && <p className="text-sm text-white/40 truncate">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3 shrink-0">{actions}</div>
          </div>
          {/* Mobile nav */}
          <div className="lg:hidden flex gap-1 px-4 pb-3 overflow-x-auto hide-scrollbar">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors",
                    active ? "bg-white text-black" : "text-white/50 bg-white/5"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
