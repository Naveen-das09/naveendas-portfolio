"use client";

import { Suspense, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { GATES, type GateId, type Vec3 } from "./gates";

const CYAN = "#4cc9f0";
const VIOLET = "#b983ff";

function WireSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 12]} />
      <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.18} />
    </mesh>
  );
}

function Axes() {
  return (
    <>
      <Line points={[[-1.3, 0, 0], [1.3, 0, 0]]} color={CYAN} transparent opacity={0.35} />
      <Line points={[[0, -1.3, 0], [0, 1.3, 0]]} color={CYAN} transparent opacity={0.35} />
      <Line points={[[0, 0, -1.3], [0, 0, 1.3]]} color={CYAN} transparent opacity={0.35} />
      <Text position={[1.4, 0, 0]} fontSize={0.2} color={CYAN}>
        X
      </Text>
      <Text position={[0, 1.4, 0]} fontSize={0.2} color={CYAN}>
        Y
      </Text>
      <Text position={[0, 0, 1.4]} fontSize={0.2} color={CYAN}>
        {"|0⟩"}
      </Text>
      <Text position={[0, 0, -1.4]} fontSize={0.2} color={CYAN}>
        {"|1⟩"}
      </Text>
    </>
  );
}

function StateVector({
  vector,
  lastGateId,
  reducedMotion,
  probRef,
}: {
  vector: Vec3;
  lastGateId: GateId | null;
  reducedMotion: boolean;
  probRef: RefObject<HTMLSpanElement | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const displayed = useRef(new THREE.Vector3(0, 0, 1));
  const animFrom = useRef(new THREE.Vector3(0, 0, 1));
  const animAxis = useRef(new THREE.Vector3(0, 1, 0));
  const animAngle = useRef(0);
  const animElapsed = useRef(0);
  const animDuration = useRef(0);
  const isReset = useRef(false);

  useEffect(() => {
    const def = lastGateId ? GATES[lastGateId] : null;
    if (reducedMotion) {
      animDuration.current = 0;
      displayed.current.set(vector.x, vector.y, vector.z);
      return;
    }
    animFrom.current.copy(displayed.current);
    animElapsed.current = 0;
    animDuration.current = 0.6;
    if (def?.rotation) {
      animAxis.current.set(def.rotation.axis.x, def.rotation.axis.y, def.rotation.axis.z);
      animAngle.current = def.rotation.angle;
      isReset.current = false;
    } else {
      isReset.current = true;
    }
  }, [vector, lastGateId, reducedMotion]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    if (animDuration.current > 0 && animElapsed.current < animDuration.current) {
      animElapsed.current = Math.min(animElapsed.current + delta, animDuration.current);
      const t = animElapsed.current / animDuration.current;
      const eased = t * t * (3 - 2 * t);
      if (isReset.current) {
        displayed.current
          .copy(animFrom.current)
          .lerp(new THREE.Vector3(0, 0, 1), eased)
          .normalize();
      } else {
        const q = new THREE.Quaternion().setFromAxisAngle(animAxis.current, animAngle.current * eased);
        displayed.current.copy(animFrom.current).applyQuaternion(q).normalize();
      }
    }
    if (group.current) {
      group.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), displayed.current);
    }
    if (probRef.current) {
      probRef.current.textContent = `${Math.round(((1 + displayed.current.z) / 2) * 100)}%`;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 12]} />
        <meshBasicMaterial color={VIOLET} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.14, 16]} />
        <meshBasicMaterial color={VIOLET} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function BlochSphere({
  vector,
  lastGateId,
  reducedMotion,
  probRef,
}: {
  vector: Vec3;
  lastGateId: GateId | null;
  reducedMotion: boolean;
  probRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="mx-auto h-[260px] w-[260px] md:h-[300px] md:w-[300px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.8, 2.0, 2.2], up: [0, 0, 1], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <WireSphere />
          <Axes />
          <StateVector
            vector={vector}
            lastGateId={lastGateId}
            reducedMotion={reducedMotion}
            probRef={probRef}
          />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
