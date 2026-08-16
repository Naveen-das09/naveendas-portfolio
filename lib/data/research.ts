export interface ResearchEntry {
  slug: string;
  tag: string;
  title: string;
  status: string;
  summary: string;
  abstract: string;
  institute: string;
  targetVenues: string[];
}

export const researchEntries: ResearchEntry[] = [
  {
    slug: "neural-decoder-generalization",
    tag: "M.Tech Thesis",
    title:
      "What Makes Neural Decoders Generalize? A Characterization of Transfer Across Code Distance and Code Family in Quantum Error Correction",
    status: "In progress — pre-results stage",
    summary:
      "Why do neural decoders for quantum error correction fail to generalize across code distance and code family — and can training be restructured to fix it?",
    abstract:
      "Neural network decoders for quantum error correction are typically trained and evaluated on a single code distance and code family, leaving open the question of whether — and why — they generalize when that structure changes. This work studies transfer of neural QEC decoders across code distance and code family, and proposes coset-graded supervision as a candidate mechanism for improving generalization, backed by a falsifiable experimental plan (E0–E4).",
    institute: "Indian Institute of Technology, Jodhpur — M.Tech Quantum Technology",
    targetVenues: ["Quantum", "npj Quantum Information", "PRX Quantum", "Physical Review Applied"],
  },
];

export function getResearchBySlug(slug: string) {
  return researchEntries.find((r) => r.slug === slug);
}

export const keyCourses = [
  "Quantum Computation",
  "Quantum Algorithms",
  "Quantum Optimization",
  "Quantum Machine Learning",
  "Quantum Cryptography",
  "Classical & Quantum Algorithms",
  "Quantum Error Correction",
  "Device Independent Quantum Technology",
];

export const researchInterests = [
  "Quantum error correction & neural decoders",
  "Quantum optimization (QAOA, VQE, quantum annealing)",
  "Quantum machine learning",
  "Representation learning & explainable AI",
  "Mathematics, cognitive science & philosophy of mind",
];
