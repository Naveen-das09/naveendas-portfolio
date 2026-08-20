"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroVisual } from "./HeroVisual";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

function detectCapability() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const desktopWidth = window.matchMedia("(min-width: 768px)").matches;
  if (reducedMotion || coarsePointer || !desktopWidth) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisualGate() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const recheck = () => setUse3D(detectCapability());
    recheck();
    const queries = [
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
    ];
    queries.forEach((q) => q.addEventListener("change", recheck));
    return () => queries.forEach((q) => q.removeEventListener("change", recheck));
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {use3D ? (
        <motion.div
          key="scene"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <HeroScene />
        </motion.div>
      ) : (
        <motion.div
          key="fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <HeroVisual />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
