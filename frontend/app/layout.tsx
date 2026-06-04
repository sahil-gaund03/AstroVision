import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "AstroVision ExoLab AI - AI-Powered NASA Astronomy Explorer",
  description:
    "AstroVision ExoLab AI combines NASA space imagery, Mars rover photos, asteroid tracking, exoplanet analytics, 3D solar system visualization, and AI-powered astronomy explanations into one cinematic research-grade platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-neutral-950 text-neutral-50 w-full overflow-x-hidden selection:bg-white/20 selection:text-white relative">
        <div className="bg-grain" />
        {children}
        <ScrollReveal />
        <Script
          src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
          strategy="afterInteractive"
        />
        <Script src="https://www.aura.build/FxFilter.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
