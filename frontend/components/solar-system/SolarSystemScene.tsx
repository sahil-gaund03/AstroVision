"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Ring } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { PlanetData } from "@/data/solarSystemPlanets";
import { SUN } from "@/data/solarSystemPlanets";

// Bloom (mipmapBlur) needs WebGL2; gate it so WebGL1 devices still render.
const BLOOM_OK = (() => {
  try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; }
})();

const DEFAULT_CAM = new THREE.Vector3(0, 30, 70);

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.06; });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color={SUN.color} />
      </mesh>
      <mesh><sphereGeometry args={[6, 32, 32]} /><meshBasicMaterial color={SUN.coronaColor} transparent opacity={0.25} /></mesh>
      <mesh><sphereGeometry args={[7.6, 32, 32]} /><meshBasicMaterial color={SUN.coronaColor} transparent opacity={0.1} /></mesh>
      <pointLight intensity={3.2} distance={400} decay={0.5} color="#fff2d6" />
    </group>
  );
}

function OrbitPath({ radius, highlight }: { radius: number; highlight: boolean }) {
  return (
    <Ring args={[radius - (highlight ? 0.1 : 0.04), radius + (highlight ? 0.1 : 0.04), 160]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color={highlight ? "#22d3ee" : "#3aa8c8"} side={THREE.DoubleSide} transparent opacity={highlight ? 0.65 : 0.16} />
    </Ring>
  );
}

function Planet({
  data, selected, showLabels, paused, speedMul, onSelect, posRef,
}: {
  data: PlanetData; selected: boolean; showLabels: boolean; paused: boolean;
  speedMul: number; onSelect: () => void; posRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, d) => {
    if (!paused) angle.current += data.orbitSpeed * speedMul * d * 6;
    const x = Math.cos(angle.current) * data.orbitRadius;
    const z = Math.sin(angle.current) * data.orbitRadius;
    if (group.current) group.current.position.set(x, 0, z);
    if (mesh.current) mesh.current.rotation.y += data.rotationSpeed;
    posRef.current[data.id] = new THREE.Vector3(x, 0, z);
  });

  return (
    <group ref={group}>
      {/* atmosphere glow */}
      <mesh>
        <sphereGeometry args={[data.size * (selected ? 1.55 : 1.3), 24, 24]} />
        <meshBasicMaterial color={data.atmosphereColor} transparent opacity={selected ? 0.18 : 0.08} />
      </mesh>
      <mesh
        ref={mesh}
        scale={selected ? 1.2 : 1}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[data.size, 48, 48]} />
        <meshStandardMaterial color={data.color} emissive={data.secondaryColor} emissiveIntensity={selected ? 0.45 : 0.15} roughness={0.75} metalness={0.2} />
      </mesh>
      {data.hasRings && (
        <Ring args={[data.size * 1.4, data.size * 2.3, 64]} rotation={[Math.PI / 2.1, 0.2, 0]}>
          <meshBasicMaterial color={data.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.5} />
        </Ring>
      )}
      {showLabels && (
        <Html position={[0, data.size + 1.4, 0]} center distanceFactor={48} pointerEvents="none">
          <span className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border backdrop-blur-sm ${selected ? "text-cyan-200 border-cyan-400/50 bg-cyan-500/20 shadow-[0_0_14px_rgba(34,211,238,0.6)]" : "text-white/70 border-white/15 bg-black/40"}`}>
            {data.name}
          </span>
        </Html>
      )}
    </group>
  );
}

function CameraRig({ focusId, posRef, controls, resetSignal }: {
  focusId: string | null; posRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
  controls: React.MutableRefObject<any>; resetSignal: number;
}) {
  const lastReset = useRef(resetSignal);
  const resetting = useRef(false);
  useFrame(({ camera }) => {
    if (!controls.current) return;
    if (resetSignal !== lastReset.current) { lastReset.current = resetSignal; resetting.current = true; }
    const fp = focusId ? posRef.current[focusId] : null;
    if (fp) {
      resetting.current = false;
      controls.current.target.lerp(fp, 0.08);
      camera.position.lerp(fp.clone().add(new THREE.Vector3(0, 5, 12)), 0.06);
      controls.current.update();
    } else if (resetting.current) {
      controls.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      camera.position.lerp(DEFAULT_CAM, 0.08);
      controls.current.update();
      if (camera.position.distanceTo(DEFAULT_CAM) < 0.5) resetting.current = false;
    }
  });
  return null;
}

export default function SolarSystemScene({
  planets, selectedId, onSelect, speedMul, paused, showOrbits, showLabels, autoRotate, focusId, resetSignal,
}: {
  planets: PlanetData[]; selectedId: string | null; onSelect: (p: PlanetData) => void;
  speedMul: number; paused: boolean; showOrbits: boolean; showLabels: boolean;
  autoRotate: boolean; focusId: string | null; resetSignal: number;
}) {
  const posRef = useRef<Record<string, THREE.Vector3>>({});
  const controls = useRef<any>(null);

  return (
    <Canvas camera={{ position: [0, 30, 70], fov: 50 }} dpr={[1, 1.8]} gl={{ antialias: true }}>
      <color attach="background" args={["#05050a"]} />
      <fog attach="fog" args={["#05050a", 90, 200]} />
      <ambientLight intensity={0.28} />
      <Stars radius={160} depth={80} count={6000} factor={4} saturation={0} fade speed={0.5} />
      <NebulaBackdrop />
      <Sun />
      {planets.map((p) => (
        <group key={p.id}>
          {showOrbits && <OrbitPath radius={p.orbitRadius} highlight={selectedId === p.id} />}
          <Planet data={p} selected={selectedId === p.id} showLabels={showLabels} paused={paused} speedMul={speedMul} onSelect={() => onSelect(p)} posRef={posRef} />
        </group>
      ))}
      <CameraRig focusId={focusId} posRef={posRef} controls={controls} resetSignal={resetSignal} />
      <OrbitControls ref={controls} enablePan enableDamping dampingFactor={0.08} autoRotate={autoRotate} autoRotateSpeed={0.4} minDistance={10} maxDistance={160} />
      {BLOOM_OK && (
        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}

function NebulaBackdrop() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(140,90,220,0.5)");
    g.addColorStop(0.5, "rgba(40,120,200,0.18)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group>
      <mesh position={[-60, -10, -90]} rotation={[0, 0.4, 0]}><planeGeometry args={[180, 180]} /><meshBasicMaterial map={tex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
      <mesh position={[80, 20, -100]} rotation={[0, -0.3, 0]}><planeGeometry args={[220, 220]} /><meshBasicMaterial map={tex} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    </group>
  );
}
