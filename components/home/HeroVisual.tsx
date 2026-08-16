"use client";

import { motion } from "framer-motion";

const orbits = [0, 60, 120];

export function HeroVisual() {
  return (
    <div className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
      <motion.div
        className="absolute h-3 w-3 rounded-full bg-cyan"
        style={{ boxShadow: "0 0 24px 6px rgba(76,201,240,0.7)" }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {orbits.map((rotate, i) => (
        <motion.div
          key={rotate}
          className="absolute rounded-full border border-violet/30"
          style={{
            width: `${60 + i * 20}%`,
            height: `${60 + i * 20}%`,
            rotate,
          }}
          animate={{ rotate: rotate + 360 }}
          transition={{
            duration: 18 + i * 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet"
            style={{
              left: "100%",
              top: "50%",
              boxShadow: "0 0 12px 3px rgba(185,131,255,0.7)",
            }}
          />
        </motion.div>
      ))}
      <div className="absolute h-full w-full rounded-full border border-border" />
    </div>
  );
}
