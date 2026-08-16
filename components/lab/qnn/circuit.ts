/**
 * A genuine (if tiny) 2-qubit variational quantum circuit simulator.
 * Because every gate used here (RY, CNOT) has real-valued matrix
 * elements, the statevector stays real-valued throughout — no complex
 * numbers needed. State is a 4-vector indexed as 2*q1 + q0 (qubit 0 is
 * the low bit), i.e. [|00>, |01>, |10>, |11>].
 */

export type Vec4 = [number, number, number, number];
export type Params4 = [number, number, number, number];

export const ZERO_STATE: Vec4 = [1, 0, 0, 0];

export function applyRY(state: Vec4, qubit: 0 | 1, theta: number): Vec4 {
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  const [a0, a1, a2, a3] = state;

  if (qubit === 0) {
    // pairs differing only in the low bit: (0,1) and (2,3)
    return [c * a0 - s * a1, s * a0 + c * a1, c * a2 - s * a3, s * a2 + c * a3];
  }
  // pairs differing only in the high bit: (0,2) and (1,3)
  return [c * a0 - s * a2, c * a1 - s * a3, s * a0 + c * a2, s * a1 + c * a3];
}

export function applyCNOT(state: Vec4): Vec4 {
  // control = qubit 1 (high bit), target = qubit 0 (low bit).
  // Control fires on indices 2 (|10>) and 3 (|11>) — swap them.
  const [a0, a1, a2, a3] = state;
  return [a0, a1, a3, a2];
}

export interface Dataset {
  point: [number, number];
  label: 0 | 1;
}

/** A small, fixed XOR-pattern dataset — not linearly separable, which is
 * the point: it's the standard toy problem for showing what an
 * entangling layer buys a variational circuit over a purely local one. */
export const xorDataset: Dataset[] = [
  { point: [0.6, 0.6], label: 0 },
  { point: [0.7, 0.4], label: 0 },
  { point: [0.3, 0.3], label: 0 },
  { point: [-0.6, -0.6], label: 0 },
  { point: [-0.4, -0.7], label: 0 },
  { point: [-0.3, -0.3], label: 0 },
  { point: [0.5, -0.6], label: 1 },
  { point: [0.7, -0.3], label: 1 },
  { point: [0.3, -0.3], label: 1 },
  { point: [-0.6, 0.5], label: 1 },
  { point: [-0.3, 0.7], label: 1 },
  { point: [-0.3, 0.3], label: 1 },
];

/** Feature map: angle-encode the 2D point onto the two qubits. */
export function encode(point: [number, number]): Vec4 {
  let state = ZERO_STATE;
  state = applyRY(state, 0, point[0] * Math.PI);
  state = applyRY(state, 1, point[1] * Math.PI);
  return state;
}

/** A 2-layer hardware-efficient ansatz: RY - RY - [CNOT] - RY - RY. */
export function ansatz(state: Vec4, params: Params4, withEntanglement: boolean): Vec4 {
  let s = applyRY(state, 0, params[0]);
  s = applyRY(s, 1, params[1]);
  if (withEntanglement) s = applyCNOT(s);
  s = applyRY(s, 0, params[2]);
  s = applyRY(s, 1, params[3]);
  return s;
}

/** <Z> on qubit 0: P(q0=0) - P(q0=1), using indices where the low bit is 0/1. */
export function expectationZ0(state: Vec4): number {
  const p0 = state[0] * state[0] + state[2] * state[2];
  const p1 = state[1] * state[1] + state[3] * state[3];
  return p0 - p1;
}

export function forward(
  point: [number, number],
  params: Params4,
  withEntanglement: boolean,
): number {
  const encoded = encode(point);
  const out = ansatz(encoded, params, withEntanglement);
  return expectationZ0(out);
}

/** Map <Z0> in [-1, 1] to a class-1 probability in [0, 1]. */
export function predictProb(
  point: [number, number],
  params: Params4,
  withEntanglement: boolean,
): number {
  return (1 - forward(point, params, withEntanglement)) / 2;
}

export function meanSquaredLoss(
  dataset: Dataset[],
  params: Params4,
  withEntanglement: boolean,
): number {
  let total = 0;
  for (const { point, label } of dataset) {
    const prob = predictProb(point, params, withEntanglement);
    total += (prob - label) ** 2;
  }
  return total / dataset.length;
}

/**
 * Exact analytic gradient via the parameter-shift rule — the same
 * technique used to train real variational circuits on hardware, since
 * ordinary backprop doesn't reach through a physical measurement.
 * For an RY-parameterized expectation value, d<Z>/dtheta =
 * [f(theta + pi/2) - f(theta - pi/2)] / 2.
 */
export function parameterShiftGradient(
  dataset: Dataset[],
  params: Params4,
  withEntanglement: boolean,
): Params4 {
  const grad: Params4 = [0, 0, 0, 0];
  const shift = Math.PI / 2;

  for (let j = 0; j < 4; j++) {
    let gradSum = 0;
    for (const { point, label } of dataset) {
      const plus = [...params] as Params4;
      const minus = [...params] as Params4;
      plus[j] += shift;
      minus[j] -= shift;

      const zPlus = forward(point, plus, withEntanglement);
      const zMinus = forward(point, minus, withEntanglement);
      const dZ = (zPlus - zMinus) / 2;

      const prob = predictProb(point, params, withEntanglement);
      // d(loss_i)/dtheta_j = 2*(prob-label) * d(prob)/dtheta_j, d(prob)/dtheta_j = -dZ/2
      gradSum += 2 * (prob - label) * (-dZ / 2);
    }
    grad[j] = gradSum / dataset.length;
  }
  return grad;
}

export function trainStep(
  dataset: Dataset[],
  params: Params4,
  withEntanglement: boolean,
  lr: number,
): { params: Params4; loss: number } {
  const grad = parameterShiftGradient(dataset, params, withEntanglement);
  const next = params.map((p, i) => p - lr * grad[i]) as Params4;
  return { params: next, loss: meanSquaredLoss(dataset, next, withEntanglement) };
}

export function randomParams(): Params4 {
  return [0, 0, 0, 0].map(() => (Math.random() - 0.5) * 2) as Params4;
}
