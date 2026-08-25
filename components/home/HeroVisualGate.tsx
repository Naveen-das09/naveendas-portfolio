"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useVisualTier } from "@/lib/capabilities";
import { HeroVisual } from "./HeroVisual";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

export function HeroVisualGate() {
  const tier = useVisualTier();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {tier === "none" ? (
        <motion.div
          key="fallback"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <HeroVisual />
        </motion.div>
      ) : (
        <motion.div
          key="scene"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroScene tier={tier} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
