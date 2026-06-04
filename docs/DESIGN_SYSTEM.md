# Design System — AstroVision ExoLab AI

## Aesthetic
Dark, premium, cinematic space-tech. Glassmorphism, soft glowing borders, grain overlay,
shimmer, and depth. The landing page is editorial and dramatic; internal pages are clean,
data-dense dashboards that share the same dark palette and glass language.

## Color
| Token | Value | Use |
|-------|-------|-----|
| Base | `neutral-950` (#0a0a0a) | Page background |
| Surface | `neutral-900/50` + backdrop-blur | Glass cards |
| Borders | `white/10` | Card / divider borders |
| Text | `white`, `white/60`, `white/40` | Primary / secondary / muted |
| Cyan | `cyan-400` | Primary accent (dashboard, links) |
| Violet | `violet-400` | Exoplanets accent |
| Amber | `amber-400` | Demo badge / warnings |
| Emerald | `emerald-400` | Live badge / success |
| Risk | emerald → amber → orange → red | Low → Medium → High → Critical |

## Typography
- **Bricolage Grotesque** — display / headings (`font-bricolage`).
- **Inter** — body text (default sans).
- **Playfair Display** — accent italics.
- **Space Mono** — micro-labels, monospace data (`font-mono`).
- Micro-labels: `text-[10px] uppercase tracking-widest font-mono`.

## Effects (globals.css + Tailwind config)
- `animate-cinematic` — hero image entrance (scale + blur + grayscale).
- `animate-slide-up` — staggered hero element entrances.
- `animate-shimmer-effect` — glass-card shimmer sweep.
- `.animate-on-scroll` (+ `slide-left`/`slide-right`) — IntersectionObserver reveals.
- `.bg-grain` — fixed SVG noise overlay; `.text-glow` — headline glow.
- `bar-anim` — equalizer bars; 3D transform utilities (rotate-x/y/z, perspective).

## Components
- **GlassCard** — rounded-2xl, border `white/10`, blurred surface, optional glow ring.
- **Badges** — DemoBadge (amber), LiveBadge (emerald), FallbackBadge (auto).
- **States** — Loading (orbital spinner), ErrorState (retry), EmptyState.
- **DashboardShell** — fixed sidebar (active highlight), topbar (title/subtitle/actions),
  mobile horizontal nav, ambient background glows.
- **BarChart** — dependency-free horizontal bars.
- **Orrery** — CSS/SVG animated solar system.
- **AIExplain** — button + modal calling the assistant, with mode badge.

## Layout
- Max content width `max-w-7xl`; generous spacing; `gap-6` grids.
- Responsive: single column on mobile → multi-column on `lg`.

## Iconography
Iconify `solar:*` line/duotone set, loaded via the `iconify-icon` web component.

## Motion Principles
Smooth easing (`cubic-bezier(0.2,0.8,0.2,1)`), subtle hover scale/translate, reveal on
scroll. Motion adds depth without blocking content.
