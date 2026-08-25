"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { BLOOM, BLOOM_BOOST, PALETTE } from "@/lib/palette";
import { SCENE } from "@/lib/narrative";
import type { VisualTier } from "@/lib/capabilities";
import { generateLattice, pulse, smoothstep } from "./lattice";

const CYAN = new THREE.Color(PALETTE.cyan);
const VIOLET = new THREE.Color(PALETTE.violet);
const WARM = new THREE.Color(PALETTE.warm);

const NEIGHBORS = 3;
const RADIUS = 2.2;

/** Camera distance at the start (one qubit, close) and at rest (whole lattice). */
const CAM_NEAR = 2.6;
const CAM_WIDE = 6.4;

function Lattice({
  nodeCount,
  glow,
  progressRef,
  pointerRef,
}: {
  nodeCount: number;
  glow: boolean;
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tilt = useRef({ x: 0, z: 0 });
  // Scroll is stepwise and jittery; the scene reads it through this smoothed
  // value so the result feels like scrubbing a video rather than snapping.
  const smoothed = useRef(0);

  const { nodes, edgePositions, errorNodes, syndromeNodes } = useMemo(
    () => generateLattice({ count: nodeCount, neighbors: NEIGHBORS, radius: RADIUS }),
    [nodeCount],
  );

  const isError = useMemo(() => {
    const set = new Set(errorNodes);
    return nodes.map((_, i) => set.has(i));
  }, [nodes, errorNodes]);

  const isSyndrome = useMemo(() => {
    const set = new Set(syndromeNodes);
    return nodes.map((_, i) => set.has(i));
  }, [nodes, syndromeNodes]);

  const baseColors = useMemo(
    () =>
      nodes.map((n) =>
        CYAN.clone().lerp(VIOLET, THREE.MathUtils.clamp(n.length() / RADIUS, 0, 1)),
      ),
    [nodes],
  );

  const edgeGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
    return g;
  }, [edgePositions]);

  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  const edgeMaterial = useRef<THREE.LineBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scratch = useMemo(() => new THREE.Color(), []);

  // instanceColor only exists once a color has been written, so seed it up front.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < nodes.length; i++) m.setColorAt(i, baseColors[i]);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [nodes, baseColors]);

  useFrame((state, rawDelta) => {
    const m = mesh.current;
    const g = group.current;
    if (!m || !g) return;

    const delta = Math.min(rawDelta, 1 / 30);
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    smoothed.current += (target - smoothed.current) * Math.min(delta * 3.2, 1);
    const p = smoothed.current;
    const t = state.clock.elapsedTime;

    // --- timeline ---
    // `solo` is the dive into a single qubit. Node visibility is intentionally
    // non-monotonic: the lattice is already there, clears away to one node,
    // then rebuilds — which is what makes the move read as a camera push-in.
    const solo = pulse(SCENE.solo[0], SCENE.solo[1], 0.045, p);
    const noise = pulse(SCENE.noise[0], SCENE.noise[1], 0.06, p);
    const syndrome = pulse(SCENE.syndrome[0], SCENE.syndrome[1], 0.06, p);
    const corrected = smoothstep(SCENE.correction[0], SCENE.correction[1], p);

    // --- camera: dive in for the solo qubit, otherwise hold the wide lattice ---
    const dist = THREE.MathUtils.lerp(CAM_WIDE, CAM_NEAR, solo);
    state.camera.position.set(0, (1 - solo) * p * 0.5, dist);
    state.camera.lookAt(0, 0, 0);

    // --- group orientation: slow drift plus pointer parallax ---
    g.rotation.y += delta * 0.1;
    const ease = Math.min(delta * 3, 1);
    const ptr = pointerRef.current;
    tilt.current.x += (ptr.y * 0.16 - tilt.current.x) * ease;
    tilt.current.z += (ptr.x * -0.12 - tilt.current.z) * ease;
    g.rotation.x = tilt.current.x;
    g.rotation.z = tilt.current.z;

    for (let i = 0; i < nodes.length; i++) {
      const stagger = (i / nodes.length) * 0.05;
      // Node 0 is the qubit the camera dives to: it never clears away.
      const cleared =
        i === 0 ? 0 : pulse(SCENE.solo[0] + stagger, SCENE.solo[1], 0.045, p);
      let scale = 1 - cleared;

      // The solo qubit swells while it holds the frame alone.
      if (i === 0) scale *= 1 + solo * 1.9;

      let jitter = 0;
      if (isError[i]) {
        scale *= 1 + noise * (0.7 + Math.sin(t * 9 + i) * 0.25) * (1 - corrected);
        jitter = noise * (1 - corrected) * 0.035;
      } else if (isSyndrome[i]) {
        scale *= 1 + syndrome * 0.5 * (0.6 + Math.sin(t * 6 + i * 0.7) * 0.4);
      }

      const n = nodes[i];
      dummy.position.set(
        n.x + (jitter ? Math.sin(t * 11 + i) * jitter : 0),
        n.y + (jitter ? Math.cos(t * 13 + i) * jitter : 0),
        n.z,
      );
      dummy.scale.setScalar(Math.max(scale, 0.0001));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      // --- colour: base -> warm under noise -> cyan flash on syndrome -> base ---
      scratch.copy(baseColors[i]);
      if (isError[i]) scratch.lerp(WARM, noise * (1 - corrected));
      else if (isSyndrome[i]) scratch.lerp(CYAN, syndrome * 0.85);
      if (glow) {
        const hot = isError[i] ? noise * (1 - corrected) : isSyndrome[i] ? syndrome : 0;
        scratch.multiplyScalar(BLOOM_BOOST * (1 + hot * 0.9));
      }
      m.setColorAt(i, scratch);
    }

    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    // --- edges clear away with the lattice, then redraw as it rebuilds ---
    const drawn = 1 - solo;
    edgeGeometry.setDrawRange(0, Math.floor((drawn * edgePositions.length) / 3));
    if (edgeMaterial.current) {
      edgeMaterial.current.opacity = 0.22 * drawn * (1 - noise * 0.35);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial ref={edgeMaterial} color={PALETTE.cyan} transparent opacity={0} />
      </lineSegments>
      <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export function NarrativeScene({
  progressRef,
  tier = "full",
}: {
  progressRef: RefObject<number>;
  tier?: VisualTier;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);

  const glow = tier === "full";
  const nodeCount = glow ? 170 : 80;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.02,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, glow ? 1.5 : 2]}
        camera={{ position: [0, 0, CAM_NEAR], fov: 45 }}
        gl={{ alpha: false, antialias: !glow }}
        onCreated={({ gl }) => gl.setClearColor(PALETTE.background, 1)}
        frameloop={inView ? "always" : "never"}
      >
        <fog attach="fog" args={[PALETTE.background, 4, 12]} />
        <Suspense fallback={null}>
          <Lattice
            nodeCount={nodeCount}
            glow={glow}
            progressRef={progressRef}
            pointerRef={pointerRef}
          />
        </Suspense>
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
