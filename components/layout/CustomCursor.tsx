"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const PRIMARY_SPRING = { stiffness: 500, damping: 40, mass: 0.4 };
const TRAIL_SPRINGS = [
  { stiffness: 260, damping: 26, mass: 0.5 },
  { stiffness: 160, damping: 24, mass: 0.6 },
  { stiffness: 100, damping: 22, mass: 0.7 },
];
const TRAIL_SIZES = [7, 5, 4];
const TRAIL_OPACITY = [0.5, 0.32, 0.18];

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, PRIMARY_SPRING);
  const springY = useSpring(y, PRIMARY_SPRING);
  const trail1X = useSpring(springX, TRAIL_SPRINGS[0]);
  const trail1Y = useSpring(springY, TRAIL_SPRINGS[0]);
  const trail2X = useSpring(springX, TRAIL_SPRINGS[1]);
  const trail2Y = useSpring(springY, TRAIL_SPRINGS[1]);
  const trail3X = useSpring(springX, TRAIL_SPRINGS[2]);
  const trail3Y = useSpring(springY, TRAIL_SPRINGS[2]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client capability detection, not derived render state
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [data-cursor-hover]")));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  const trailDots = [
    { x: trail1X, y: trail1Y },
    { x: trail2X, y: trail2Y },
    { x: trail3X, y: trail3Y },
  ];

  return (
    <>
      {trailDots.map((dot, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[99] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
          style={{
            x: dot.x,
            y: dot.y,
            width: TRAIL_SIZES[i],
            height: TRAIL_SIZES[i],
            opacity: hovering ? 0 : TRAIL_OPACITY[i],
            transition: "opacity 0.2s ease",
          }}
        />
      ))}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: springX,
          y: springY,
          width: hovering ? 28 : 10,
          height: hovering ? 28 : 10,
          backgroundColor: hovering ? "transparent" : "var(--accent-cyan)",
          border: hovering ? "1.5px solid var(--accent-cyan)" : "none",
          boxShadow: hovering
            ? "0 0 18px 2px rgba(76,201,240,0.45)"
            : "0 0 10px 2px rgba(76,201,240,0.6)",
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease",
        }}
      />
    </>
  );
}
