"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/capabilities";
import { PALETTE, rgba } from "@/lib/palette";

/**
 * A run of headline text. `className` colours that run, so accent spans survive
 * the effect.
 */
export type Segment = { text: string; className?: string };

/**
 * Chromatic split, in the site's own accents rather than the usual red/cyan.
 *
 * Every keyframe keeps the same two-shadow structure — framer interpolates
 * text-shadow positionally, so a keyframe with a different number of shadows
 * would jump instead of easing.
 */
const SPLIT_HARD = `6px 0 ${rgba(PALETTE.cyan, 0.95)}, -6px 0 ${rgba(PALETTE.violet, 0.95)}`;
const SPLIT_SOFT = `2px 0 ${rgba(PALETTE.cyan, 0.6)}, -2px 0 ${rgba(PALETTE.violet, 0.6)}`;
const SPLIT_NONE = `0px 0 ${rgba(PALETTE.cyan, 0)}, 0px 0 ${rgba(PALETTE.violet, 0)}`;

const EASE = [0.16, 1, 0.3, 1] as const;

/** How often a settled headline twitches, and for how long. */
const AMBIENT_EVERY = [4000, 7500] as const;
const AMBIENT_MS = 300;

/**
 * Headline reveal with a brief glitch, meant to be felt rather than read.
 *
 * Deliberately does *not* substitute characters. Scrambling a proportional face
 * changes every word's width, which forces an invisible layout scaffold to stop
 * the line breaks moving, and at headline size the gibberish reads as noise
 * rather than as an effect. Here the words are always the real words — the
 * glitch is purely optical: an RGB split in the site accents, a slice skew, and
 * a dropped frame or two.
 *
 * After settling, a single random word twitches every several seconds. It is
 * short and rare on purpose: this sits behind body copy people are reading.
 */
export function GlitchHeadline({
  segments,
  className,
  delay = 0.15,
  stagger = 0.05,
  ambient = true,
  as: Tag = "h1",
}: {
  segments: Segment[];
  className?: string;
  delay?: number;
  stagger?: number;
  ambient?: boolean;
  as?: "h1" | "h2" | "p";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [twitch, setTwitch] = useState(-1);
  // Once the entrance is done the words must fall back to a *settled* target,
  // not to the entrance keyframes — otherwise every ambient twitch ends by
  // replaying the reveal, flashing the word back through opacity 0.
  const [settled, setSettled] = useState(false);

  // Flatten to words, remembering each word's colour and keeping one running
  // index so the stagger stays continuous across segment boundaries.
  const words: { text: string; className?: string }[] = [];
  const spacers = new Set<number>();
  for (const segment of segments) {
    for (const token of segment.text.split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        spacers.add(words.length);
        continue;
      }
      words.push({ text: token, className: segment.className });
    }
  }
  const wordCount = words.length;
  const plain = segments.map((s) => s.text).join("");

  useEffect(() => {
    if (reducedMotion || wordCount === 0) return;
    const total = (delay + (wordCount - 1) * stagger + 0.6) * 1000;
    const t = window.setTimeout(() => setSettled(true), total);
    return () => window.clearTimeout(t);
  }, [reducedMotion, wordCount, delay, stagger]);

  useEffect(() => {
    if (reducedMotion || !ambient || wordCount === 0) return;
    let clear = 0;
    let next = 0;

    const schedule = () => {
      const gap = AMBIENT_EVERY[0] + Math.random() * (AMBIENT_EVERY[1] - AMBIENT_EVERY[0]);
      next = window.setTimeout(() => {
        setTwitch(Math.floor(Math.random() * wordCount));
        clear = window.setTimeout(() => {
          setTwitch(-1);
          schedule();
        }, AMBIENT_MS);
      }, gap);
    };
    schedule();

    return () => {
      window.clearTimeout(next);
      window.clearTimeout(clear);
    };
  }, [reducedMotion, ambient, wordCount]);

  if (reducedMotion) {
    return (
      <Tag className={className}>
        {segments.map((segment, i) => (
          <span key={i} className={segment.className}>
            {segment.text}
          </span>
        ))}
      </Tag>
    );
  }

  const rendered: ReactNode[] = [];
  words.forEach((word, i) => {
    if (spacers.has(i)) rendered.push(<Fragment key={`s${i}`}> </Fragment>);
    rendered.push(
      <motion.span
        key={i}
        className={`inline-block ${word.className ?? ""}`}
        initial={{ opacity: 0, x: -5, skewX: 10, textShadow: SPLIT_HARD }}
        animate={
          twitch === i
            ? {
                opacity: [1, 0.62, 1, 0.8, 1],
                x: [0, -6, 4, -2, 0],
                skewX: [0, -12, 7, -3, 0],
                textShadow: [SPLIT_NONE, SPLIT_HARD, SPLIT_SOFT, SPLIT_HARD, SPLIT_NONE],
                transition: { duration: AMBIENT_MS / 1000, ease: "linear" },
              }
            : settled
              ? {
                  opacity: 1,
                  x: 0,
                  skewX: 0,
                  textShadow: SPLIT_NONE,
                  transition: { duration: 0 },
                }
              : {
                  opacity: [0, 1, 0.45, 1, 0.75, 1],
                  x: [-10, 6, -4, 2, -1, 0],
                  skewX: [16, -9, 5, -3, 1, 0],
                  textShadow: [
                    SPLIT_HARD,
                    SPLIT_HARD,
                    SPLIT_SOFT,
                    SPLIT_HARD,
                    SPLIT_SOFT,
                    SPLIT_NONE,
                  ],
                  transition: {
                    duration: 0.6,
                    delay: delay + i * stagger,
                    ease: EASE,
                    times: [0, 0.2, 0.36, 0.54, 0.72, 1],
                  },
                }
        }
      >
        {word.text}
      </motion.span>,
    );
  });

  return (
    <Tag className={className} aria-label={plain}>
      <span aria-hidden="true">{rendered}</span>
    </Tag>
  );
}
