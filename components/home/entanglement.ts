export interface Vec2 {
  x: number;
  y: number;
}

export interface QubitPoint extends Vec2 {
  color: string;
  baseRadius: number;
}

export type FieldEvent =
  | { kind: "solo"; pointIdx: number; startedAt: number; duration: number }
  | {
      kind: "pair";
      a: number;
      b: number;
      startedAt: number;
      duration: number;
      path: Vec2[];
      cumLen: number[];
      totalLen: number;
    };

const COLORS = [
  { color: "#4cc9f0", weight: 0.55 },
  { color: "#b983ff", weight: 0.3 },
  { color: "#ffb454", weight: 0.15 },
];

const CELL = 190;
const FILL_PROBABILITY = 0.45;
const MAX_POINTS = 32;

export const SOLO_DURATION: [number, number] = [1400, 2000];
export const PAIR_DURATION: [number, number] = [2000, 2700];
export const EVENT_GAP: [number, number] = [700, 2000];
export const MAX_CONCURRENT = 3;
const PAIR_WEIGHT = 0.5;
const TRAVEL_FRACTION = 0.65;

export function randomBetween([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

function pickColor(): string {
  const roll = Math.random();
  let acc = 0;
  for (const { color, weight } of COLORS) {
    acc += weight;
    if (roll <= acc) return color;
  }
  return COLORS[0].color;
}

export function generatePoints(width: number, height: number): QubitPoint[] {
  if (width === 0 || height === 0) return [];
  const cols = Math.ceil(width / CELL);
  const rows = Math.ceil(height / CELL);
  const points: QubitPoint[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > FILL_PROBABILITY) continue;
      points.push({
        x: c * CELL + CELL * (0.2 + Math.random() * 0.6),
        y: r * CELL + CELL * (0.2 + Math.random() * 0.6),
        color: pickColor(),
        baseRadius: 1.2 + Math.random(),
      });
    }
  }
  return points.slice(0, MAX_POINTS);
}

function generateBoltPath(a: Vec2, b: Vec2): Vec2[] {
  const segments = 5 + Math.floor(Math.random() * 2);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const jitter = Math.min(28, Math.max(8, dist * 0.06));

  const points: Vec2[] = [{ x: a.x, y: a.y }];
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const offset = (Math.random() - 0.5) * 2 * jitter;
    points.push({
      x: a.x + dx * t + nx * offset,
      y: a.y + dy * t + ny * offset,
    });
  }
  points.push({ x: b.x, y: b.y });
  return points;
}

function computePathLengths(path: Vec2[]): { cumLen: number[]; totalLen: number } {
  const cumLen = [0];
  for (let i = 1; i < path.length; i++) {
    cumLen.push(
      cumLen[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y),
    );
  }
  return { cumLen, totalLen: cumLen[cumLen.length - 1] };
}

export function pointAlongPath(
  path: Vec2[],
  cumLen: number[],
  totalLen: number,
  t: number,
): Vec2 {
  const target = Math.max(0, Math.min(1, t)) * totalLen;
  for (let i = 0; i < path.length - 1; i++) {
    if (cumLen[i + 1] >= target) {
      const segLen = cumLen[i + 1] - cumLen[i];
      const segT = segLen > 0 ? (target - cumLen[i]) / segLen : 0;
      return {
        x: path[i].x + (path[i + 1].x - path[i].x) * segT,
        y: path[i].y + (path[i + 1].y - path[i].y) * segT,
      };
    }
  }
  return path[path.length - 1];
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function lerpColor(c1: string, c2: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const r = Math.round(r1 + (r2 - r1) * clamped);
  const g = Math.round(g1 + (g2 - g1) * clamped);
  const b = Math.round(b1 + (b2 - b1) * clamped);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Fraction of a pair event's duration during which the spark travels a -> b. */
export function travelProgress(progress: number): number {
  return Math.max(0, Math.min(1, progress / TRAVEL_FRACTION));
}

/** The leading sub-path of `path` covering fraction `t` of its total length. */
export function partialPath(path: Vec2[], cumLen: number[], totalLen: number, t: number): Vec2[] {
  const target = Math.max(0, Math.min(1, t)) * totalLen;
  const result: Vec2[] = [path[0]];
  for (let i = 1; i < path.length; i++) {
    if (cumLen[i] <= target) {
      result.push(path[i]);
      continue;
    }
    const segLen = cumLen[i] - cumLen[i - 1];
    const segT = segLen > 0 ? (target - cumLen[i - 1]) / segLen : 0;
    result.push({
      x: path[i - 1].x + (path[i].x - path[i - 1].x) * segT,
      y: path[i - 1].y + (path[i].y - path[i - 1].y) * segT,
    });
    break;
  }
  return result;
}

const IMPACT_START = TRAVEL_FRACTION;
const IMPACT_SPAN = 0.18;

/** A sharp rise-then-decay spike right as the spark reaches its destination qubit. */
export function impactEnvelope(progress: number): number {
  if (progress < IMPACT_START) return 0;
  const t = (progress - IMPACT_START) / IMPACT_SPAN;
  if (t > 1) return 0;
  return t < 0.25 ? t / 0.25 : Math.max(0, 1 - (t - 0.25) / 0.75);
}

export function createEvent(now: number, points: QubitPoint[]): FieldEvent | null {
  if (points.length === 0) return null;

  if (points.length >= 2 && Math.random() < PAIR_WEIGHT) {
    const diagonal = Math.hypot(
      Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x)),
      Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y)),
    );
    const minDist = 120;
    const maxDist = Math.max(minDist + 1, diagonal * 0.45);

    for (let attempt = 0; attempt < 6; attempt++) {
      const a = Math.floor(Math.random() * points.length);
      let b = Math.floor(Math.random() * points.length);
      if (b === a) b = (b + 1) % points.length;
      const dist = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
      if (dist >= minDist && dist <= maxDist) {
        const path = generateBoltPath(points[a], points[b]);
        const { cumLen, totalLen } = computePathLengths(path);
        return {
          kind: "pair",
          a,
          b,
          startedAt: now,
          duration: randomBetween(PAIR_DURATION),
          path,
          cumLen,
          totalLen,
        };
      }
    }
  }

  const pointIdx = Math.floor(Math.random() * points.length);
  return { kind: "solo", pointIdx, startedAt: now, duration: randomBetween(SOLO_DURATION) };
}

export function envelope(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  const FADE_IN = 0.25;
  const FADE_OUT = 0.6;
  if (p < FADE_IN) return p / FADE_IN;
  if (p > FADE_OUT) return Math.max(0, 1 - (p - FADE_OUT) / (1 - FADE_OUT));
  return 1;
}
