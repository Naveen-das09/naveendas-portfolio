"use client";

import { useEffect, useState } from "react";

/**
 * How much visual machinery this device should be asked to run.
 *
 * - `none` — reduced motion, no WebGL, or a small screen. Render the 2D fallback.
 * - `lite` — WebGL works, but it's a touch device or a low-DPR screen. 3D, no bloom.
 * - `full` — desktop, fine pointer, WebGL2. Everything on.
 */
export type VisualTier = "none" | "lite" | "full";

function hasWebGL(): { ok: boolean; webgl2: boolean } {
  try {
    const canvas = document.createElement("canvas");
    const gl2 = canvas.getContext("webgl2");
    if (gl2) return { ok: true, webgl2: true };
    return { ok: !!canvas.getContext("webgl"), webgl2: false };
  } catch {
    return { ok: false, webgl2: false };
  }
}

export function detectTier(): VisualTier {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopWidth = window.matchMedia("(min-width: 768px)").matches;
  if (reducedMotion || !desktopWidth) return "none";

  const { ok, webgl2 } = hasWebGL();
  if (!ok) return "none";

  // Bloom is an extra full-screen pass, so skip it where the GPU is likely
  // mobile: a coarse pointer, or no WebGL2. Deliberately NOT gated on a high
  // devicePixelRatio — low DPR means fewer pixels to shade, which makes bloom
  // cheaper, not costlier. Gating on it would hide the effect from every
  // ordinary 1080p desktop monitor.
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (coarsePointer || !webgl2) return "lite";

  return "full";
}

/**
 * Tier, re-evaluated when the user changes any of the inputs mid-session
 * (toggling reduce-motion, resizing, moving a window to another display).
 *
 * Starts at `none` so server and first client render agree; the effect upgrades
 * it after mount.
 */
export function useVisualTier(): VisualTier {
  const [tier, setTier] = useState<VisualTier>("none");

  useEffect(() => {
    const recheck = () => setTier(detectTier());
    recheck();

    const queries = [
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
    ];
    queries.forEach((q) => q.addEventListener("change", recheck));
    window.addEventListener("resize", recheck);
    return () => {
      queries.forEach((q) => q.removeEventListener("change", recheck));
      window.removeEventListener("resize", recheck);
    };
  }, []);

  return tier;
}

/** Standalone reduced-motion check for components that only need that bit. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
