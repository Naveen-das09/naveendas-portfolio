"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { BLOOM, BLOOM_BOOST, PALETTE } from "@/lib/palette";
import type { VisualTier } from "@/lib/capabilities";

const CYAN = new THREE.Color(PALETTE.cyan);
const VIOLET = new THREE.Color(PALETTE.violet);

const NEIGHBORS = 3;
const RADIUS = 2.2;
const CAMERA_NEAR_Z = 5.0;
const CAMERA_FAR_Z = 7.6;

function generateLattice(count: number, neighbors: number, radius: number) {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    nodes.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ),
    );
  }

  const edgePositions: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const nearest = nodes
      .map((n, j) => ({ j, d: i === j ? Infinity : nodes[i].distanceTo(n) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbors);
    for (const { j } of nearest) {
      edgePositions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
    }
  }

  return { nodes, edgePositions: new Float32Array(edgePositions) };
}

function Lattice({
  nodeCount,
  glow,
  pointerRef,
}: {
  nodeCount: number;
  glow: boolean;
  pointerRef: RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, z: 0 });

  const { nodes, edgePositions } = useMemo(
    () => generateLattice(nodeCount, NEIGHBORS, RADIUS),
    [nodeCount],
  );

  const nodeColors = useMemo(
    () =>
      nodes.map((n) => {
        const c = CYAN.clone().lerp(VIOLET, THREE.MathUtils.clamp(n.length() / RADIUS, 0, 1));
        // Push past 1.0 so the bloom pass's luminance threshold catches it.
        return glow ? c.multiplyScalar(BLOOM_BOOST) : c;
      }),
    [nodes, glow],
  );

  const edgeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
    return geometry;
  }, [edgePositions]);

  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  useFrame((state, rawDelta) => {
    const g = group.current;
    if (!g) return;
    // Clamp so returning from a background tab doesn't jump the rotation.
    const delta = Math.min(rawDelta, 1 / 30);
    g.rotation.y += delta * 0.12;
    const ease = Math.min(delta * 3, 1);
    const pointer = pointerRef.current;
    tilt.current.x += (pointer.y * 0.2 - tilt.current.x) * ease;
    tilt.current.z += (pointer.x * -0.15 - tilt.current.z) * ease;
    g.rotation.x = tilt.current.x;
    g.rotation.z = tilt.current.z;
    // Slow breathing, so the structure never looks frozen between interactions.
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
    g.scale.setScalar(breathe);
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={PALETTE.cyan} transparent opacity={0.22} />
      </lineSegments>
      <Instances limit={nodes.length}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
        {nodes.map((pos, i) => (
          <Instance key={i} position={pos} color={nodeColors[i]} />
        ))}
      </Instances>
    </group>
  );
}

/** Dollies the camera back as the hero scrolls away, for depth without hijacking scroll. */
function ScrollDolly({ scrollRef }: { scrollRef: RefObject<number> }) {
  // Read the camera off the per-frame state rather than from useThree(): the
  // camera is a mutable external object, and mutating a hook result trips the
  // React compiler's immutability rule.
  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const t = THREE.MathUtils.clamp(scrollRef.current, 0, 1);
    const targetZ = THREE.MathUtils.lerp(CAMERA_NEAR_Z, CAMERA_FAR_Z, t);
    const targetY = t * 0.6;
    const ease = Math.min(delta * 4, 1);
    const cam = state.camera;
    cam.position.z += (targetZ - cam.position.z) * ease;
    cam.position.y += (targetY - cam.position.y) * ease;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene({ tier = "full" }: { tier?: VisualTier }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const glow = tier === "full";
  const nodeCount = glow ? 160 : 72;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Plain scroll ref rather than state: the camera reads this inside useFrame,
  // so scrolling never triggers a React re-render.
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / Math.max(window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Parallax is driven from the window rather than R3F's canvas-scoped pointer
  // so it keeps responding while the cursor is over the hero copy, which sits
  // above a pointer-transparent canvas.
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <Canvas
        dpr={[1, glow ? 1.5 : 2]}
        camera={{ position: [0, 0, CAMERA_NEAR_Z], fov: 45 }}
        // Opaque clear color: EffectComposer over a transparent buffer fringes.
        gl={{ alpha: false, antialias: !glow }}
        onCreated={({ gl }) => gl.setClearColor(PALETTE.background, 1)}
        frameloop={inView ? "always" : "never"}
      >
        <fog attach="fog" args={[PALETTE.background, 4, 11]} />
        <Suspense fallback={null}>
          <Lattice nodeCount={nodeCount} glow={glow} pointerRef={pointerRef} />
        </Suspense>
        <ScrollDolly scrollRef={scrollRef} />
        {glow && (
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={BLOOM.intensity}
              luminanceThreshold={BLOOM.luminanceThreshold}
              luminanceSmoothing={BLOOM.luminanceSmoothing}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
