export interface BlochStep {
  id: "intro" | "pauli" | "hadamard" | "phase" | "measurement" | "closing";
  title: string;
  body: string;
}

export const blochSteps: BlochStep[] = [
  {
    id: "intro",
    title: "A qubit is a point on a sphere",
    body: "A classical bit is 0 or 1 — two isolated points. A qubit's state is a point on the surface of a sphere: the north pole is |0⟩, the south pole is |1⟩, and every other point on the surface is some quantum superposition of the two. Right now the arrow sits at |0⟩. Everything that follows is just: click a gate, watch the arrow move.",
  },
  {
    id: "pauli",
    title: "The Pauli gates: flips around an axis",
    body: "X, Y, and Z are each a 180° rotation of the state vector about their own axis. X is the quantum analog of a classical bit-flip — apply it to |0⟩ and the arrow swings straight to |1⟩. Z leaves |0⟩ and |1⟩ untouched (they sit on its own axis) but flips anything with a component off that axis. Reset snaps the state back to |0⟩ whenever you want a clean slate.",
  },
  {
    id: "hadamard",
    title: "Hadamard: landing on the equator",
    body: "H maps |0⟩ to the +X point on the equator — an equal superposition of |0⟩ and |1⟩, written |+⟩. Geometrically, H is a 180° flip about the diagonal axis halfway between X and Z, which is why applying it twice in a row returns you exactly to where you started. Any point on the equator is an equal-superposition state; which point tells you the relative phase, not the odds of measuring 0 or 1.",
  },
  {
    id: "phase",
    title: "S and T: phase you can see, but can't measure",
    body: "S and T rotate the state around the Z axis by 90° and 45°. From |0⟩ or |1⟩ they do nothing — there's no phase to rotate at the poles. But from |+⟩, watch the arrow sweep around the equator: that motion is a real, physical difference in the qubit's state — it's what lets interference happen in a real circuit — yet a measurement in the 0/1 basis alone can never distinguish it, because it doesn't change the arrow's height.",
  },
  {
    id: "measurement",
    title: "Measurement only cares about height",
    body: "The probability of measuring 0 depends only on the z-coordinate: P(0) = (1+z)/2. That's why the poles give certain outcomes (z = ±1) and the equator gives a coin flip (z = 0) — and why every phase gate you just tried left this number completely unchanged. Try any sequence of gates and watch the readout track the arrow's height in real time.",
  },
  {
    id: "closing",
    title: "One qubit, many circuits",
    body: "Every real quantum circuit — including the two-qubit variational circuit trained live in the QNN demo, and the multi-qubit lattices in the error-correction demo elsewhere in this lab — is built from single-qubit rotations like these plus entangling gates between qubits. This sphere is the irreducible picture underneath all of it: state as geometry, gates as rotations, measurement as a projection onto one axis.",
  },
];
