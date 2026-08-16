import type { Params4 } from "./circuit";

const CYAN = "#4cc9f0";
const VIOLET = "#b983ff";
const WARM = "#ffb454";
const WIRE = "#2a3350";

function GateBox({
  x,
  y,
  label,
  color,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x - 22}
        y={y - 14}
        width={44}
        height={28}
        rx={6}
        fill="#0b0f1a"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={10}
        fontFamily="var(--font-mono, monospace)"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

export function CircuitDiagram({
  params,
  withEntanglement,
}: {
  params: Params4;
  withEntanglement: boolean;
}) {
  const width = 420;
  const y0 = 32;
  const y1 = 84;
  const fmt = (n: number) => n.toFixed(2);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} 116`}
      role="img"
      aria-label="Variational quantum circuit diagram: two qubits, angle encoding, a trainable rotation layer, an entangling CNOT gate, a second rotation layer, and measurement on qubit 0"
    >
      <line x1={20} y1={y0} x2={width - 20} y2={y0} stroke={WIRE} strokeWidth={1.5} />
      <line x1={20} y1={y1} x2={width - 20} y2={y1} stroke={WIRE} strokeWidth={1.5} />
      <text x={4} y={y0 + 4} fontSize={10} fill="#8b93a7" fontFamily="var(--font-mono, monospace)">
        q0
      </text>
      <text x={4} y={y1 + 4} fontSize={10} fill="#8b93a7" fontFamily="var(--font-mono, monospace)">
        q1
      </text>

      <GateBox x={60} y={y0} label="RY(x)" color={CYAN} />
      <GateBox x={60} y={y1} label="RY(y)" color={CYAN} />

      <GateBox x={150} y={y0} label={`RY(${fmt(params[0])})`} color={VIOLET} />
      <GateBox x={150} y={y1} label={`RY(${fmt(params[1])})`} color={VIOLET} />

      {withEntanglement ? (
        <g>
          <line x1={210} y1={y0} x2={210} y2={y1} stroke={WARM} strokeWidth={1.5} />
          <circle cx={210} cy={y1} r={5} fill={WARM} />
          <circle cx={210} cy={y0} r={7} fill="none" stroke={WARM} strokeWidth={1.5} />
          <line x1={205} y1={y0} x2={215} y2={y0} stroke={WARM} strokeWidth={1.5} />
          <line x1={210} y1={y0 - 5} x2={210} y2={y0 + 5} stroke={WARM} strokeWidth={1.5} />
        </g>
      ) : (
        <text
          x={210}
          y={(y0 + y1) / 2 + 4}
          textAnchor="middle"
          fontSize={9}
          fill="#565f78"
          fontFamily="var(--font-mono, monospace)"
        >
          (no entangler)
        </text>
      )}

      <GateBox x={290} y={y0} label={`RY(${fmt(params[2])})`} color={VIOLET} />
      <GateBox x={290} y={y1} label={`RY(${fmt(params[3])})`} color={VIOLET} />

      <g>
        <rect
          x={width - 60}
          y={y0 - 14}
          width={40}
          height={28}
          rx={6}
          fill="#0b0f1a"
          stroke={WARM}
          strokeWidth={1.5}
        />
        <text
          x={width - 40}
          y={y0 + 4}
          textAnchor="middle"
          fontSize={11}
          fill={WARM}
          fontFamily="var(--font-mono, monospace)"
        >
          M
        </text>
      </g>
    </svg>
  );
}
