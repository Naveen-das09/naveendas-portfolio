"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { PALETTE } from "@/lib/palette";

const TILE = 72;
const NODE_R = 1.6;

const patternSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}">
  <line x1="${TILE / 2}" y1="${TILE / 2}" x2="${TILE * 1.5}" y2="${TILE / 2}" stroke="${PALETTE.cyan}" stroke-width="1" stroke-opacity="0.35" />
  <line x1="${TILE / 2}" y1="${TILE / 2}" x2="${TILE / 2}" y2="${TILE * 1.5}" stroke="${PALETTE.cyan}" stroke-width="1" stroke-opacity="0.35" />
  <circle cx="${TILE / 2}" cy="${TILE / 2}" r="${NODE_R}" fill="${PALETTE.violet}" fill-opacity="0.7" />
</svg>
`.trim());

export function LatticeBackground({ dimmed = false }: { dimmed?: boolean }) {
  const { scrollYProgress } = useScroll();
  const glowAlpha = useTransform(scrollYProgress, [0, 1], [0.08, 0.24]);
  const glowBackground = useTransform(
    glowAlpha,
    (alpha) =>
      `radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--background) 75%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(185,131,255,${alpha}), transparent 60%)`,
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div
        className={`animate-drift absolute -inset-[10%] ${dimmed ? "opacity-[0.16]" : "opacity-[0.35]"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,${patternSvg}")`,
          backgroundRepeat: "repeat",
        }}
      />
      <motion.div className="absolute inset-0" style={{ background: glowBackground }} />
    </div>
  );
}
