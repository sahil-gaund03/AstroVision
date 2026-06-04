import Link from "next/link";

const LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "NASA Explorer", href: "/nasa-explorer" },
  { label: "Exoplanets", href: "/exoplanets" },
  { label: "Asteroids", href: "/asteroids" },
  { label: "Solar System", href: "/solar-system" },
  { label: "AI Assistant", href: "/assistant" },
];

export default function Navbar() {
  return (
    <div className="fixed flex animate-slide-up [animation-delay:0.5s] z-50 opacity-0 pr-4 pl-4 top-6 right-0 left-0 justify-center">
      <nav className="flex transition-all duration-300 bg-neutral-900/60 w-full max-w-6xl border-white/10 border rounded-full py-2 pr-4 pl-2 shadow-2xl backdrop-blur-xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 pl-3 shrink-0">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black">
            <iconify-icon icon="solar:planet-bold-duotone" width="16" />
          </div>
          <span className="font-bricolage text-sm tracking-tight font-semibold whitespace-nowrap">
            AstroVision <span className="hidden xl:inline">ExoLab AI</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.03em] font-medium text-white/[0.65]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <iconify-icon icon="solar:magnifer-linear" width="20" />
          </button>
          <Link
            href="/dashboard"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors group"
          >
            <iconify-icon icon="solar:menu-dots-square-linear" width="20" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
