"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const VARIANTS = {
  "fade-up": { hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } },
  "scale-in": { hidden: { opacity: 0, scale: 0.94 }, shown: { opacity: 1, scale: 1 } },
  "blur-in": { hidden: { opacity: 0, filter: "blur(10px)" }, shown: { opacity: 1, filter: "blur(0px)" } },
} as const;

export type RevealVariant = keyof typeof VARIANTS;

export function Reveal({
  children,
  delay = 0,
  className,
  variant = "fade-up",
  duration = 0.6,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
  duration?: number;
}) {
  const { hidden, shown } = VARIANTS[variant];

  return (
    <motion.div
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
