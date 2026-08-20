export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const ZERO: Vec3 = { x: 0, y: 0, z: 1 };

export function normalize(v: Vec3): Vec3 {
  const n = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / n, y: v.y / n, z: v.z / n };
}

function rotateZ(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return normalize({ x: v.x * c - v.y * s, y: v.x * s + v.y * c, z: v.z });
}

export const applyX = (v: Vec3): Vec3 => normalize({ x: v.x, y: -v.y, z: -v.z });
export const applyY = (v: Vec3): Vec3 => normalize({ x: -v.x, y: v.y, z: -v.z });
export const applyZ = (v: Vec3): Vec3 => normalize({ x: -v.x, y: -v.y, z: v.z });
export const applyH = (v: Vec3): Vec3 => normalize({ x: v.z, y: -v.y, z: v.x });
export const applyS = (v: Vec3): Vec3 => rotateZ(v, Math.PI / 2);
export const applyT = (v: Vec3): Vec3 => rotateZ(v, Math.PI / 4);
export const reset = (): Vec3 => ({ ...ZERO });

/** P(measure 0) = cos²(θ/2) = (1+z)/2 */
export const probZero = (v: Vec3): number => (1 + v.z) / 2;

export type GateId = "X" | "Y" | "Z" | "H" | "S" | "T" | "RESET";

export interface GateDef {
  id: GateId;
  label: string;
  apply: (v: Vec3) => Vec3;
  /** Rotation axis + angle for unitary gates; undefined for RESET (non-unitary). */
  rotation?: { axis: Vec3; angle: number };
}

const INV_SQRT2 = 1 / Math.SQRT2;

export const GATES: Record<GateId, GateDef> = {
  X: {
    id: "X",
    label: "X",
    apply: applyX,
    rotation: { axis: { x: 1, y: 0, z: 0 }, angle: Math.PI },
  },
  Y: {
    id: "Y",
    label: "Y",
    apply: applyY,
    rotation: { axis: { x: 0, y: 1, z: 0 }, angle: Math.PI },
  },
  Z: {
    id: "Z",
    label: "Z",
    apply: applyZ,
    rotation: { axis: { x: 0, y: 0, z: 1 }, angle: Math.PI },
  },
  H: {
    id: "H",
    label: "H",
    apply: applyH,
    rotation: { axis: { x: INV_SQRT2, y: 0, z: INV_SQRT2 }, angle: Math.PI },
  },
  S: {
    id: "S",
    label: "S",
    apply: applyS,
    rotation: { axis: { x: 0, y: 0, z: 1 }, angle: Math.PI / 2 },
  },
  T: {
    id: "T",
    label: "T",
    apply: applyT,
    rotation: { axis: { x: 0, y: 0, z: 1 }, angle: Math.PI / 4 },
  },
  RESET: { id: "RESET", label: "Reset", apply: reset },
};
