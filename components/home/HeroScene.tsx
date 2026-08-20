"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";

const CYAN = new THREE.Color("#4cc9f0");
const VIOLET = new THREE.Color("#b983ff");
const NODE_COUNT = 72;
const NEIGHBORS = 3;
const RADIUS = 1.6;

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

function Lattice() {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, z: 0 });

  const { nodes, edgePositions } = useMemo(
    () => generateLattice(NODE_COUNT, NEIGHBORS, RADIUS),
    [],
  );

  const nodeColors = useMemo(
    () =>
      nodes.map((n) =>
        CYAN.clone().lerp(VIOLET, THREE.MathUtils.clamp(n.length() / RADIUS, 0, 1)),
      ),
    [nodes],
  );

  const edgeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
    return geometry;
  }, [edgePositions]);

  useFrame((state, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 1 / 30);
    g.rotation.y += delta * 0.12;
    const ease = Math.min(delta * 3, 1);
    tilt.current.x += (state.pointer.y * 0.2 - tilt.current.x) * ease;
    tilt.current.z += (state.pointer.x * -0.15 - tilt.current.z) * ease;
    g.rotation.x = tilt.current.x;
    g.rotation.z = tilt.current.z;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#4cc9f0" transparent opacity={0.25} />
      </lineSegments>
      <Instances limit={nodes.length}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
        {nodes.map((pos, i) => (
          <Instance key={i} position={pos} color={nodeColors[i]} />
        ))}
      </Instances>
    </group>
  );
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative mx-auto h-72 w-72 md:h-96 md:w-96"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <Lattice />
        </Suspense>
      </Canvas>
    </div>
  );
}
