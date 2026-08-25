"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { ArrowRight, Atom } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { KineticText } from "@/components/ui/KineticText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { CinematicHero } from "@/components/home/CinematicHero";
import { NarrativeHint } from "@/components/home/NarrativeHint";
import { useVisualTier, type VisualTier } from "@/lib/capabilities";
import { BEATS, INTRO, type Beat } from "@/lib/narrative";
import { site } from "@/lib/data/site";
import { cn } from "@/lib/utils";

const NarrativeScene = dynamic(
  () => import("@/components/home/NarrativeScene").then((m) => m.NarrativeScene),
  { ssr: false },
);

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Keyframes for one beat's fade, derived from the gaps to its neighbours.
 *
 * Each gap is split in half: the outgoing beat finishes fading exactly where
 * the incoming one starts. Overlapping them cross-fades two different blocks of
 * copy in the same position, which reads as a glitch rather than a transition —
 * so this is computed from the beat timings rather than a fixed width, and
 * retuning BEATS can never reintroduce it.
 */
function beatRange(i: number): [number[], number[]] {
  const b = BEATS[i];
  const prevEnd = i === 0 ? INTRO.end : BEATS[i - 1].end;
  const inFade = Math.max(0.004, (b.start - prevEnd) / 2);

  // The last beat holds to the end of the section instead of fading out.
  const isLast = i === BEATS.length - 1;
  if (isLast || b.end >= 1) {
    return [
      [Math.max(0, b.start - inFade), b.start, 1],
      [0, 1, 1],
    ];
  }

  const outFade = Math.max(0.004, (BEATS[i + 1].start - b.end) / 2);
  return [
    [Math.max(0, b.start - inFade), b.start, b.end, Math.min(1, b.end + outFade)],
    [0, 1, 1, 0],
  ];
}

/** Where the identity panel must be gone by: the first beat's fade-in start. */
function introFadeEnd() {
  return Math.max(INTRO.end, INTRO.end + (BEATS[0].start - INTRO.end) / 2);
}

const HEADLINE = [
  { text: "Building at the intersection of " },
  { text: "quantum computing", className: "text-violet" },
  { text: " and " },
  { text: "applied machine learning", className: "text-cyan" },
  { text: "." },
];

/** One story panel, cross-fading as its slice of the scroll passes. */
function BeatPanel({
  beat,
  index,
  progress,
  active,
}: {
  beat: Beat;
  index: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const [inp, out] = beatRange(index);
  const opacity = useTransform(progress, inp, out);
  const y = useTransform(progress, [inp[0], beat.start], [24, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      aria-hidden={!active}
      // opacity:0 does not stop hit-testing, and these panels stack over the
      // intro — without this an invisible panel swallows its CTA clicks.
      className={cn(
        "absolute inset-0 flex items-center",
        active ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <Container>
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
            {beat.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-medium leading-[1.12] text-foreground sm:text-4xl lg:text-5xl">
            {beat.title}
          </h2>
          <p className="mt-5 text-foreground-muted">{beat.body}</p>
          {beat.id === "decode" && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/lab/quantum-error-correction" variant="outline">
                <Atom className="h-4 w-4" /> Try the QEC lab
              </Button>
              <Button href="/research" variant="ghost">
                Read the research <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Container>
    </motion.div>
  );
}

/** Timeline rail — doubles as a scrubber so the story is navigable, not just scrollable. */
function Rail({ activeIndex, onSeek }: { activeIndex: number; onSeek: (i: number) => void }) {
  return (
    <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {BEATS.map((b, i) => (
        <button
          key={b.id}
          type="button"
          onClick={() => onSeek(i)}
          data-cursor-hover
          aria-label={`Jump to: ${b.title}`}
          aria-current={i === activeIndex}
          className="group flex items-center gap-3"
        >
          <span
            className={cn(
              "font-mono text-[10px] tabular-nums transition-colors",
              i === activeIndex ? "text-cyan" : "text-foreground-faint group-hover:text-foreground-muted",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "h-px transition-all",
              i === activeIndex ? "w-8 bg-cyan" : "w-4 bg-border-strong group-hover:w-6",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ScrollNarrative() {
  const tier = useVisualTier();
  // Reduced motion, small screens and no-WebGL get the static hero rather than
  // a multi-screen scroll section they would have to travel through blind.
  // Split into its own component so useScroll's target ref is only ever
  // registered by a tree that actually renders the section.
  if (tier === "none") return <CinematicHero />;
  return <ScrollNarrativeInner tier={tier} />;
}

function ScrollNarrativeInner({ tier }: { tier: VisualTier }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Progress is measured here rather than with useScroll: that hook caches the
  // target's geometry, and this page's layout shifts after mount (the canvas
  // arrives via dynamic import), which left it reporting stale progress —
  // different values for the same scrollY between loads. Reading the live rect
  // each scroll is deterministic, and gives the DOM and the 3D scene one source.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const travelled = -el.getBoundingClientRect().top;
      const v = Math.min(1, Math.max(0, travelled / scrollable));

      progressRef.current = v;
      scrollYProgress.set(v);

      const i = BEATS.findIndex((b, bi) => {
        const [inp] = beatRange(bi);
        return v >= inp[0] && v <= inp[inp.length - 1];
      });
      setActiveIndex((prev) => (prev === i ? prev : i));
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [scrollYProgress]);

  // Derived from the first beat so the identity panel is guaranteed to be gone
  // before beat 01 starts fading in. Overlapping them leaves the headline
  // ghosting behind the story copy at low opacity.
  const introOpacity = useTransform(
    scrollYProgress,
    [INTRO.start, INTRO.end, introFadeEnd()],
    [1, 1, 0],
  );

  const seek = useCallback((i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const mid = (BEATS[i].start + BEATS[i].end) / 2;
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = window.scrollY + el.getBoundingClientRect().top + scrollable * mid;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[560svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <NarrativeScene progressRef={progressRef} tier={tier} />

        {/* Copy side dark, visual side clear — same treatment as the hero. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,7,13,0.97) 0%, rgba(5,7,13,0.94) 42%, rgba(5,7,13,0.55) 64%, transparent 86%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(5,7,13,0.7) 100%)",
          }}
        />

        {/* Identity beat: who this is, before the story starts. */}
        <motion.div
          style={{ opacity: introOpacity }}
          aria-hidden={activeIndex !== -1}
          className={cn(
            "absolute inset-0 flex items-center",
            activeIndex === -1 ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <Container>
            <div className="max-w-4xl">
              <ScrambleText
                as="p"
                text={site.role}
                className="font-mono text-xs uppercase tracking-[0.2em] text-cyan"
              />
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
        </motion.div>

        {BEATS.map((beat, i) => (
          <BeatPanel
            key={beat.id}
            beat={beat}
            index={i}
            progress={scrollYProgress}
            active={i === activeIndex}
          />
        ))}

        <Rail activeIndex={activeIndex} onSeek={seek} />

        <NarrativeHint storyStarted={activeIndex !== -1} />

        {/* Scroll cue, only while the identity beat still holds. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: introOpacity }}
          className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
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
      </div>
    </section>
  );
}
