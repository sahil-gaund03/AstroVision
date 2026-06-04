"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import SolarSystemExperience from "@/components/solar-system/SolarSystemExperience";
import { api } from "@/lib/api";

export default function SolarSystemPage() {
  // Local data renders immediately; backend only flips the badge to "Live".
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    let active = true;
    api.getSolarSystemPlanets()
      .then((res) => { if (active) setIsFallback(!!res.fallback); })
      .catch(() => { if (active) setIsFallback(true); });
    return () => { active = false; };
  }, []);

  return (
    <DashboardShell title="3D Solar System" subtitle="Interactive orrery with planetary intelligence" noPadding>
      <SolarSystemExperience isFallback={isFallback} />
    </DashboardShell>
  );
}
