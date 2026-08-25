import * as THREE from "three";

/**
 * Deterministic lattice generation.
 *
 * The narrative scene needs a *stable* structure: which nodes carry an error
 * has to stay the same across re-renders and match between the edge list and
 * the node list. A seeded PRNG gives that, where Math.random() would not.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Lattice = {
  nodes: THREE.Vector3[];
  /** Flat [x1,y1,z1, x2,y2,z2, ...] pairs, ordered nearest-first per node. */
  edgePositions: Float32Array;
  /** Indices of nodes that carry a simulated error during the noise beat. */
  errorNodes: number[];
  /** Nodes adjacent to an error — these light up during the syndrome beat. */
  syndromeNodes: number[];
};

export function generateLattice({
  count,
  neighbors,
  radius,
  seed = 7,
  errorFraction = 0.11,
}: {
  count: number;
  neighbors: number;
  radius: number;
  seed?: number;
  errorFraction?: number;
}): Lattice {
  const rand = mulberry32(seed);
  const nodes: THREE.Vector3[] = [];

  // Node 0 sits at the origin: the narrative opens on a single qubit, and it
  // reads better if that qubit is dead centre rather than wherever chance put it.
  nodes.push(new THREE.Vector3(0, 0, 0));
  for (let i = 1; i < count; i++) {
    const theta = 2 * Math.PI * rand();
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * Math.cbrt(rand());
    nodes.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ),
    );
  }

  const adjacency: number[][] = nodes.map(() => []);
  const edgePositions: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const nearest = nodes
      .map((n, j) => ({ j, d: i === j ? Infinity : nodes[i].distanceTo(n) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbors);
    for (const { j } of nearest) {
      adjacency[i].push(j);
      edgePositions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
    }
  }

  const errorNodes: number[] = [];
  for (let i = 1; i < nodes.length; i++) {
    if (rand() < errorFraction) errorNodes.push(i);
  }

  const syndrome = new Set<number>();
  for (const e of errorNodes) {
    for (const n of adjacency[e]) if (!errorNodes.includes(n)) syndrome.add(n);
  }

  return {
    nodes,
    edgePositions: new Float32Array(edgePositions),
    errorNodes,
    syndromeNodes: [...syndrome],
  };
}

/** Ramp from 0 to 1 across [edge0, edge1], clamped, with smooth ends. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** 1 inside [a,b] with soft shoulders of width `fade` on each side. */
export function pulse(a: number, b: number, fade: number, x: number) {
  return smoothstep(a - fade, a, x) * (1 - smoothstep(b, b + fade, x));
}
