export interface QnnStep {
  id: "intro" | "encoding" | "entangle" | "training" | "closing";
  title: string;
  body: string;
}

export const qnnSteps: QnnStep[] = [
  {
    id: "intro",
    title: "A quantum classifier, two qubits wide",
    body: "This is a real (if tiny) variational quantum circuit — a genuine 2-qubit statevector simulation running in your browser, not a stylized animation. It takes a 2D point, runs it through a quantum circuit, and predicts which of two classes it belongs to. This is the same family of model behind my Hybrid Quantum-Classical Neural Network project, just small enough to watch train live.",
  },
  {
    id: "encoding",
    title: "Encoding data into qubits",
    body: "Each point's two coordinates become rotation angles on the two qubits — this is the 'feature map'. The colored dots are a small dataset arranged in an XOR pattern: points where the two coordinates share a sign are one class, points where they don't are the other. XOR is the classic example of a pattern no straight line can separate.",
  },
  {
    id: "entangle",
    title: "Why the entangling gate matters",
    body: "After encoding, a variational layer applies learnable rotations, plus a CNOT gate that entangles the two qubits. Toggle it off: the circuit becomes two independent, per-qubit rotations — mathematically incapable of representing the diagonal, correlated boundary XOR needs, no matter how the parameters are tuned. Toggle it back on and that becomes reachable again.",
  },
  {
    id: "training",
    title: "Training with the parameter-shift rule",
    body: "The background shading is the circuit's current prediction across the whole plane. Hit Train: each step computes an exact gradient using the parameter-shift rule — evaluating the circuit at each parameter shifted by ±π/2, which is how real variational circuits are trained on physical hardware, since backprop can't reach through an actual quantum measurement. Watch the loss drop and the boundary reshape itself.",
  },
  {
    id: "closing",
    title: "From two qubits to a full network",
    body: "This toy circuit is doing, at a tiny scale, exactly what a variational quantum layer does inside a larger hybrid architecture: encode, entangle, measure, and let the parameter-shift rule supply the gradient a classical optimizer needs. My Hybrid Quantum-Classical Neural Network project embeds circuits like this inside a ResNet/ViT backbone for image classification.",
  },
];
