export interface QecStep {
  id:
    | "intro"
    | "inject"
    | "syndrome"
    | "decode"
    | "distance"
    | "family"
    | "closing";
  title: string;
  body: string;
}

export const qecSteps: QecStep[] = [
  {
    id: "intro",
    title: "A lattice of qubits",
    body: "This is a simplified surface-code lattice. The grey circles are data qubits — they hold the actual quantum information. The diamonds are stabilizer (ancilla) qubits — they don't store information themselves, they measure the parity of their neighboring data qubits, over and over, without ever reading the data qubits directly.",
  },
  {
    id: "inject",
    title: "Inject an error",
    body: "Click a data qubit, or hit Randomize, to simulate a physical error striking it. In real hardware this happens constantly — from thermal noise, control imprecision, or stray radiation. The orange spark marks the corrupted qubit.",
  },
  {
    id: "syndrome",
    title: "Stabilizers catch it",
    body: "The stabilizers touching that qubit now report a parity flip — they light up cyan. Crucially, this 'syndrome' reveals that something is wrong and roughly where, without ever measuring (and collapsing) the data qubit's actual quantum state. That's the whole trick of quantum error correction.",
  },
  {
    id: "decode",
    title: "A decoder proposes a fix",
    body: "Given only the syndrome — which stabilizers fired — a decoding algorithm has to infer which qubit most likely caused it, and prescribe a correction. This demo uses a simplified single-error decoder for clarity; real decoders (including the neural ones I study) have to handle many simultaneous, correlated errors, which is far harder.",
  },
  {
    id: "distance",
    title: "Code distance changes the picture",
    body: "The 'code distance' is roughly the lattice size — larger distance means more physical qubits protecting the same logical qubit, and more resilience to errors. Try the same error at distance 3, 5, and 7. A decoder trained only at one distance often doesn't generalize cleanly to another — that's a central question in my thesis.",
  },
  {
    id: "family",
    title: "Code family changes the picture too",
    body: "Switch from the 2D surface code to a 1D repetition code. The stabilizer connectivity — how many neighbors each check touches, and in what pattern — is fundamentally different. A decoder that generalizes across distance within one family may still fail when the family itself changes.",
  },
  {
    id: "closing",
    title: "Why this matters",
    body: "My thesis asks: what would let a neural decoder transfer across both code distance and code family, instead of overfitting to the exact lattice it was trained on? One candidate mechanism is coset-graded supervision — training signal structured around the algebraic cosets of the stabilizer group, rather than raw syndrome-to-correction pairs. Read more on the Research page.",
  },
];
