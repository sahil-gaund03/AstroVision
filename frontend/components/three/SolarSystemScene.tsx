"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Ring, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Planet, SolarSystem } from "@/lib/types";

type Pos = Record<string, THREE.Vector3>;

// Bloom (mipmapBlur) needs WebGL2; skip postprocessing if unavailable so the
// scene still renders on WebGL1-only devices instead of crashing.
const BLOOM_OK = (() => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
})();

function orbitRadius(au: number, max: number) {
  return 7 + (Math.log10(au + 1) / Math.log10(max + 1)) * 30;
}
function planetSize(km: number) {
  return Math.max(0.7, Math.min(3.4, Math.cbrt(km) / 18));
}
function stableAngle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  return (hash / 360) * Math.PI * 2;
}

function PlanetMesh({
  planet, radius, speed, paused, selected, showLabels, onSelect, posRef,
}: {
  planet: Planet; radius: number; speed: number; paused: boolean;
  selected: boolean; showLabels: boolean; onSelect: () => void; posRef: React.MutableRefObject<Pos>;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const angle = useRef(stableAngle(planet.name));
  const size = planetSize(planet.radius_km);
  const isSaturn = planet.name === "Saturn";

  useFrame((_, delta) => {
    if (!paused) angle.current += (delta * speed) / Math.sqrt(planet.distance_au) * 0.4;
    const x = Math.cos(angle.current) * radius;
    const z = Math.sin(angle.current) * radius;
    if (group.current) group.current.position.set(x, 0, z);
    if (mesh.current) mesh.current.rotation.y += delta * 0.3;
    posRef.current[planet.name] = new THREE.Vector3(x, 0, z);
  });

  return (
    <group ref={group}>
      {/* atmosphere / selection glow */}
      <mesh>
        <sphereGeometry args={[size * (selected ? 1.5 : 1.25), 24, 24]} />
        <meshBasicMaterial color={planet.color} transparent opacity={selected ? 0.16 : 0.07} />
      </mesh>
      <mesh
        ref={mesh}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
        scale={selected ? 1.18 : 1}
      >
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={selected ? 0.5 : 0.18}
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>
      {isSaturn && (
        <Ring args={[size * 1.5, size * 2.4, 64]} rotation={[Math.PI / 2.2, 0, 0]}>
          <meshBasicMaterial color="#e3d9b0" side={THREE.DoubleSide} transparent opacity={0.45} />
        </Ring>
      )}
      <Moons count={planet.moons} planetSize={size} paused={paused} speed={speed} />
      {showLabels && (
        <Html position={[0, size + 1.6, 0]} center distanceFactor={42} pointerEvents="none">
          <span
            className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border backdrop-blur-sm ${
              selected
                ? "text-cyan-200 border-cyan-400/50 bg-cyan-500/20 shadow-[0_0_14px_rgba(34,211,238,0.6)]"
                : "text-white/70 border-white/15 bg-black/40"
            }`}
          >
            {planet.name}
          </span>
        </Html>
      )}
    </group>
  );
}

function Moons({ count, planetSize, paused, speed }: { count: number; planetSize: number; paused: boolean; speed: number }) {
  const n = Math.min(3, count); // cap visible moons for clarity
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current && !paused) ref.current.rotation.y += d * speed * 0.8; });
  if (n === 0) return null;
  return (
    <group ref={ref}>
      {Array.from({ length: n }).map((_, i) => {
        const dist = planetSize * (1.9 + i * 0.7);
        const a = (i / n) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * dist, Math.sin(i) * 0.4, Math.sin(a) * dist]}>
            <sphereGeometry args={[Math.max(0.12, planetSize * 0.22), 16, 16]} />
            <meshStandardMaterial color="#cdd2da" emissive="#3a3f47" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function NebulaHaze() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(140,90,220,0.5)");
    g.addColorStop(0.5, "rgba(40,120,200,0.18)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group>
      <mesh position={[-40, -8, -60]} rotation={[0, 0.4, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial map={tex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[55, 12, -70]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshBasicMaterial map={tex} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, highlight }: { radius: number; highlight?: boolean }) {
  return (
    <Ring args={[radius - (highlight ? 0.08 : 0.04), radius + (highlight ? 0.08 : 0.04), 128]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial
        color={highlight ? "#22d3ee" : "#3aa8c8"}
        side={THREE.DoubleSide}
        transparent
        opacity={highlight ? 0.6 : 0.16}
      />
    </Ring>
  );
}

function Sun({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.05; });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[6.6, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} />
      </mesh>
      <pointLight intensity={3} distance={300} decay={0.6} color="#fff4d6" />
    </group>
  );
}

const DEFAULT_CAM = new THREE.Vector3(0, 26, 54);

function CameraRig({ focus, posRef, controls, resetSignal }: {
  focus: string | null; posRef: React.MutableRefObject<Pos>;
  controls: React.MutableRefObject<any>; resetSignal: number;
}) {
  const lastReset = useRef(resetSignal);
  const resetting = useRef(false);

  useFrame(({ camera }) => {
    if (!controls.current) return;

    // Reset View pressed -> start an ease-back animation.
    if (resetSignal !== lastReset.current) {
      lastReset.current = resetSignal;
      resetting.current = true;
    }

    const focusPos = focus ? posRef.current[focus] : null;

    if (focusPos) {
      resetting.current = false;
      controls.current.target.lerp(focusPos, 0.08);
      camera.position.lerp(focusPos.clone().add(new THREE.Vector3(0, 6, 16)), 0.06);
      controls.current.update();
    } else if (resetting.current) {
      controls.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      camera.position.lerp(DEFAULT_CAM, 0.08);
      controls.current.update();
      if (camera.position.distanceTo(DEFAULT_CAM) < 0.5) resetting.current = false;
    }
    // Otherwise: leave the camera under free user control.
  });
  return null;
}

export default function SolarSystemScene({
  data, selected, onSelect, speed, paused, showOrbits, showLabels, autoRotate, focus, resetSignal,
}: {
  data: SolarSystem; selected: Planet | null; onSelect: (p: Planet) => void;
  speed: number; paused: boolean; showOrbits: boolean; showLabels: boolean;
  autoRotate: boolean; focus: string | null; resetSignal: number;
}) {
  const posRef = useRef<Pos>({});
  const controls = useRef<any>(null);
  const maxAU = useMemo(() => Math.max(...data.planets.map((p) => p.distance_au)), [data]);
  const radii = useMemo(
    () => data.planets.map((p) => orbitRadius(p.distance_au, maxAU)),
    [data, maxAU]
  );

  return (
    <Canvas camera={{ position: [0, 26, 54], fov: 50 }} dpr={[1, 1.8]} gl={{ antialias: true }}>
      <color attach="background" args={["#05060f"]} />
      <fog attach="fog" args={["#05060f", 80, 165]} />
      <ambientLight intensity={0.25} />
      <Stars radius={140} depth={70} count={5000} factor={4} saturation={0} fade speed={0.6} />
      <NebulaHaze />

      <Sun color={data.star.color} />

      {data.planets.map((p, i) => (
        <group key={p.name}>
          {showOrbits && <OrbitRing radius={radii[i]} highlight={selected?.name === p.name} />}
          <PlanetMesh
            planet={p}
            radius={radii[i]}
            speed={speed}
            paused={paused}
            selected={selected?.name === p.name}
            showLabels={showLabels}
            onSelect={() => onSelect(p)}
            posRef={posRef}
          />
        </group>
      ))}

      <CameraRig focus={focus} posRef={posRef} controls={controls} resetSignal={resetSignal} />
      <OrbitControls
        ref={controls}
        enablePan
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
        minDistance={12}
        maxDistance={120}
      />

      {BLOOM_OK && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
