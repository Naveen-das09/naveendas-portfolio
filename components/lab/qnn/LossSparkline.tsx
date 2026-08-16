export function LossSparkline({ history }: { history: number[] }) {
  const width = 240;
  const height = 48;

  if (history.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={0} y1={height - 4} x2={width} y2={height - 4} stroke="#1c2333" />
      </svg>
    );
  }

  const max = Math.max(...history, 0.05);
  const points = history
    .map((v, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - 4 - (v / max) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke="#ffb454" strokeWidth={1.5} />
    </svg>
  );
}
