/**
 * The homepage scroll narrative.
 *
 * Beats are ordered and their `start`/`end` are normalized scroll progress
 * through the pinned section. They double as the timeline the 3D scene reads,
 * so the copy and the visuals can never drift apart.
 *
 * Beat 0 is the identity beat — it carries the name, role and CTAs, and is
 * rendered specially. The rest tell the research story.
 */
export type Beat = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Normalized scroll progress [0..1] where this beat is fully visible. */
  start: number;
  end: number;
};

export const BEATS: Beat[] = [
  {
    id: "qubit",
    eyebrow: "01 — The unit",
    title: "A qubit is not a bit",
    body: "A classical bit is 0 or 1. A qubit is a point on a sphere — every superposition in between is a state it can actually hold. That extra room is where the advantage lives.",
    start: 0.16,
    end: 0.3,
  },
  {
    id: "entangle",
    eyebrow: "02 — The structure",
    title: "Entangle them into a lattice",
    body: "Alone, a qubit is fragile and not much use. Wired together, their correlations become a medium you can compute in — and, crucially, one you can protect.",
    start: 0.34,
    end: 0.47,
  },
  {
    id: "noise",
    eyebrow: "03 — The problem",
    title: "Noise is the real adversary",
    body: "Every qubit leaks. Heat, stray fields and imperfect gates flip states continuously. Scaling a quantum computer is less about adding qubits than surviving the errors that come with them.",
    start: 0.51,
    end: 0.64,
  },
  {
    id: "syndrome",
    eyebrow: "04 — The measurement",
    title: "Stabilizers expose a syndrome",
    body: "You cannot look at a qubit without collapsing it. So you measure its neighbours instead: stabilizers report parity, never the data, and light up a pattern that betrays where the error went.",
    start: 0.68,
    end: 0.81,
  },
  {
    id: "decode",
    eyebrow: "05 — The research",
    title: "A decoder proposes the correction",
    body: "From that syndrome a decoder infers what happened and undoes it. My M.Tech thesis asks a harder question: when a neural decoder is trained on one code, does anything it learned still hold on another?",
    start: 0.85,
    end: 1.0,
  },
];

/**
 * Where the identity beat holds before the story starts. It must be fully gone
 * before BEATS[0] begins fading in, or the two overlap — see ScrollNarrative,
 * which derives the fade-out end from the first beat rather than repeating a
 * number here.
 */
export const INTRO = { start: 0.0, end: 0.08 } as const;

/**
 * Scene timeline, in the same normalized progress as the beats.
 *
 * `solo` is the window where the camera dives into a single qubit and the rest
 * of the lattice clears away — so node visibility is deliberately not
 * monotonic: the lattice is present, collapses to one node, then rebuilds.
 */
export const SCENE = {
  solo: [0.15, 0.29] as const,
  noise: [0.5, 0.8] as const,
  syndrome: [0.66, 0.88] as const,
  correction: [0.84, 0.98] as const,
} as const;
