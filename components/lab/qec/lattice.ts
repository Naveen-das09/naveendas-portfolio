export type CodeFamily = "surface" | "repetition";

export interface DataQubit {
  id: string;
  kind: "data";
  col: number;
  row: number;
}

export interface AncillaQubit {
  id: string;
  kind: "ancilla";
  col: number;
  row: number;
  neighbors: string[];
}

export interface Lattice {
  family: CodeFamily;
  distance: number;
  dataQubits: DataQubit[];
  ancillaQubits: AncillaQubit[];
  width: number;
  height: number;
}

/**
 * Simplified, illustrative model: a single generic stabilizer type checks the
 * parity of its neighboring data qubits. The real surface code splits
 * stabilizers into separate X (bit-flip) and Z (phase-flip) checks; we
 * collapse that distinction here so the picture stays legible.
 */
export function generateLattice(family: CodeFamily, distance: number): Lattice {
  const d = Math.max(2, distance);

  if (family === "repetition") {
    const dataQubits: DataQubit[] = Array.from({ length: d }, (_, i) => ({
      id: `d-${i}`,
      kind: "data",
      col: i,
      row: 0,
    }));
    const ancillaQubits: AncillaQubit[] = Array.from({ length: d - 1 }, (_, i) => ({
      id: `a-${i}`,
      kind: "ancilla",
      col: i + 0.5,
      row: 0,
      neighbors: [`d-${i}`, `d-${i + 1}`],
    }));
    return { family, distance: d, dataQubits, ancillaQubits, width: d - 1, height: 0 };
  }

  const dataQubits: DataQubit[] = [];
  for (let row = 0; row < d; row++) {
    for (let col = 0; col < d; col++) {
      dataQubits.push({ id: `d-${col}-${row}`, kind: "data", col, row });
    }
  }

  const ancillaQubits: AncillaQubit[] = [];
  for (let row = 0; row < d - 1; row++) {
    for (let col = 0; col < d - 1; col++) {
      ancillaQubits.push({
        id: `a-${col}-${row}`,
        kind: "ancilla",
        col: col + 0.5,
        row: row + 0.5,
        neighbors: [
          `d-${col}-${row}`,
          `d-${col + 1}-${row}`,
          `d-${col}-${row + 1}`,
          `d-${col + 1}-${row + 1}`,
        ],
      });
    }
  }

  return { family, distance: d, dataQubits, ancillaQubits, width: d - 1, height: d - 1 };
}

function dataQubitAncillaNeighbors(lattice: Lattice): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const dq of lattice.dataQubits) map.set(dq.id, []);
  for (const ancilla of lattice.ancillaQubits) {
    for (const neighborId of ancilla.neighbors) {
      map.get(neighborId)?.push(ancilla.id);
    }
  }
  return map;
}

/** Syndrome = ancillas whose neighboring-error-parity is odd. With at most one
 * injected error, that's simply the error qubit's own ancilla neighbors. */
export function computeSyndrome(lattice: Lattice, errorId: string | null): Set<string> {
  if (!errorId) return new Set();
  const map = dataQubitAncillaNeighbors(lattice);
  return new Set(map.get(errorId) ?? []);
}

/**
 * Maximum-likelihood decode under a single-error assumption: find the data
 * qubit whose ancilla-neighbor set exactly matches the observed syndrome.
 * Because each grid position maps to a unique set of neighboring cells, this
 * always recovers the true error qubit for the single-error case produced by
 * this demo. It does not attempt general multi-error matching — that's the
 * hard, actively-researched part of real QEC decoding, not this toy model.
 */
export function decode(lattice: Lattice, syndrome: Set<string>): string | null {
  if (syndrome.size === 0) return null;
  const map = dataQubitAncillaNeighbors(lattice);
  for (const [dataId, ancillaIds] of map) {
    if (
      ancillaIds.length === syndrome.size &&
      ancillaIds.every((id) => syndrome.has(id))
    ) {
      return dataId;
    }
  }
  return null;
}

export function randomDataQubitId(lattice: Lattice): string {
  const pick = lattice.dataQubits[Math.floor(Math.random() * lattice.dataQubits.length)];
  return pick.id;
}
