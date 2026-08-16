import type { ReactNode } from "react";

const CYAN = "#4cc9f0";
const VIOLET = "#b983ff";
const MUTED = "#8b93a7";

export function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="not-prose my-8 rounded-2xl border border-border bg-surface/60 p-6">
      {children}
      {caption ? (
        <figcaption className="mt-4 text-center font-mono text-xs text-foreground-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-8 border-l-2 border-cyan pl-6">
      <p className="font-display text-xl leading-snug text-foreground md:text-2xl">
        {children}
      </p>
    </div>
  );
}

function MiniLattice({
  d,
  cell = 22,
  family = "surface",
}: {
  d: number;
  cell?: number;
  family?: "surface" | "repetition";
}) {
  const pad = 14;
  const size = (d - 1) * cell + pad * 2;

  if (family === "repetition") {
    const width = (d - 1) * cell + pad * 2;
    return (
      <svg width={width} height={pad * 2} viewBox={`0 0 ${width} ${pad * 2}`}>
        {Array.from({ length: d - 1 }, (_, i) => (
          <line
            key={`e${i}`}
            x1={pad + i * cell}
            y1={pad}
            x2={pad + (i + 1) * cell}
            y2={pad}
            stroke={CYAN}
            strokeOpacity={0.35}
          />
        ))}
        {Array.from({ length: d - 1 }, (_, i) => (
          <rect
            key={`a${i}`}
            x={pad + (i + 0.5) * cell - 3}
            y={pad - 3}
            width={6}
            height={6}
            transform={`rotate(45 ${pad + (i + 0.5) * cell} ${pad})`}
            fill={VIOLET}
            fillOpacity={0.8}
          />
        ))}
        {Array.from({ length: d }, (_, i) => (
          <circle key={`d${i}`} cx={pad + i * cell} cy={pad} r={4} fill={MUTED} />
        ))}
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: d }, (_, row) =>
        Array.from({ length: d - 1 }, (_, col) => (
          <line
            key={`h${row}-${col}`}
            x1={pad + col * cell}
            y1={pad + row * cell}
            x2={pad + (col + 1) * cell}
            y2={pad + row * cell}
            stroke={CYAN}
            strokeOpacity={0.22}
          />
        )),
      )}
      {Array.from({ length: d - 1 }, (_, row) =>
        Array.from({ length: d }, (_, col) => (
          <line
            key={`v${row}-${col}`}
            x1={pad + col * cell}
            y1={pad + row * cell}
            x2={pad + col * cell}
            y2={pad + (row + 1) * cell}
            stroke={CYAN}
            strokeOpacity={0.22}
          />
        )),
      )}
      {Array.from({ length: d - 1 }, (_, row) =>
        Array.from({ length: d - 1 }, (_, col) => (
          <rect
            key={`a${row}-${col}`}
            x={pad + (col + 0.5) * cell - 3}
            y={pad + (row + 0.5) * cell - 3}
            width={6}
            height={6}
            transform={`rotate(45 ${pad + (col + 0.5) * cell} ${pad + (row + 0.5) * cell})`}
            fill={VIOLET}
            fillOpacity={0.8}
          />
        )),
      )}
      {Array.from({ length: d }, (_, row) =>
        Array.from({ length: d }, (_, col) => (
          <circle
            key={`d${row}-${col}`}
            cx={pad + col * cell}
            cy={pad + row * cell}
            r={3.5}
            fill={MUTED}
          />
        )),
      )}
    </svg>
  );
}

export function CodeDistanceFigure() {
  return (
    <Figure caption="Code distance d = 3, 5, 7 — larger distance means more physical qubits protecting one logical qubit, and more resilience to errors.">
      <div className="flex flex-wrap items-end justify-center gap-10">
        {[3, 5, 7].map((d) => (
          <div key={d} className="flex flex-col items-center gap-2">
            <MiniLattice d={d} cell={16} />
            <span className="font-mono text-xs text-foreground-faint">d = {d}</span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function CodeFamilyFigure() {
  return (
    <Figure caption="Two code families: a 2D surface code (many-neighbor stabilizers) versus a 1D repetition code (two-neighbor stabilizers) — different topology, different generalization behavior.">
      <div className="flex flex-wrap items-center justify-center gap-14">
        <div className="flex flex-col items-center gap-3">
          <MiniLattice d={4} family="surface" />
          <span className="font-mono text-xs text-foreground-faint">Surface (2D)</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <MiniLattice d={5} family="repetition" />
          <span className="font-mono text-xs text-foreground-faint">Repetition (1D)</span>
        </div>
      </div>
    </Figure>
  );
}

export function EEGWaveFigure() {
  const width = 640;
  const height = 140;
  function wavePath(amp: number, freq: number, phase: number, y: number) {
    const points: string[] = [];
    for (let x = 0; x <= width; x += 4) {
      const t = (x / width) * Math.PI * freq + phase;
      const jitter = Math.sin(t * 3.7) * amp * 0.18;
      const yy = y + Math.sin(t) * amp + jitter;
      points.push(`${x === 0 ? "M" : "L"}${x},${yy.toFixed(1)}`);
    }
    return points.join(" ");
  }

  return (
    <Figure caption="Two channels of a stylized EEG trace — a lot of structure, and no direct read on what the structure feels like from the inside.">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <path d={wavePath(22, 10, 0, height * 0.35)} stroke={CYAN} strokeWidth={1.5} fill="none" opacity={0.85} />
        <path d={wavePath(16, 14, 1.3, height * 0.72)} stroke={VIOLET} strokeWidth={1.5} fill="none" opacity={0.85} />
      </svg>
    </Figure>
  );
}
