"use client";

import { motion } from "framer-motion";
import { ArrowRight, Atom } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { KineticText } from "@/components/ui/KineticText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { HeroVisualGate } from "@/components/home/HeroVisualGate";
import { site } from "@/lib/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = [
  { text: "Building at the intersection of " },
  { text: "quantum computing", className: "text-violet" },
  { text: " and " },
  { text: "applied machine learning", className: "text-cyan" },
  { text: "." },
];

export function CinematicHero() {
  return (
    <section className="relative flex h-[100svh] min-h-[600px] w-full items-center overflow-hidden">
      <HeroVisualGate />

      {/* Copy side dark, visual side clear. Keeps the headline crisp and pushes
          the lattice to the right so the composition reads as deliberate
          rather than as text dropped on top of a busy field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(5,7,13,0.97) 0%, rgba(5,7,13,0.92) 30%, rgba(5,7,13,0.55) 55%, transparent 80%)",
        }}
      />
      {/* Soft edge vignette on top, so the lattice never collides with the navbar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(5,7,13,0.75) 100%)",
        }}
      />
      {/* Dissolve into the next section instead of ending on a hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28svh]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(5,7,13,0.7) 55%, var(--background) 100%)",
        }}
      />

      <Container className="relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <ScrambleText
              as="p"
              text={site.role}
              className="font-mono text-xs uppercase tracking-[0.2em] text-cyan"
            />
          </motion.div>

          <KineticText
            segments={HEADLINE}
            delay={0.15}
            className="mt-5 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-6xl"
          />

          <motion.p
            className="mt-7 max-w-lg text-foreground-muted"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
          >
            {site.tagline}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
          >
            <Button href="/projects">
              View Projects <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/lab/quantum-error-correction" variant="outline">
              <Atom className="h-4 w-4" /> Explore the QEC Lab
            </Button>
          </motion.div>
        </div>
      </Container>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <motion.div
          className="flex h-10 w-6 items-start justify-center rounded-full border border-cyan/40 pt-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-cyan"
            style={{ boxShadow: "0 0 8px 2px rgba(76,201,240,0.6)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
