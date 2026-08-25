"use client";

import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/capabilities";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A segment of headline text. `text` is split into words and staggered in;
 * `className` colors that run of words (so accent spans still work).
 */
export type Segment = { text: string; className?: string };

/**
 * Word-level staggered reveal for a headline.
 *
 * Words, not characters — per-character staggering on a sentence this long
 * reads as a gimmick and makes the DOM hostile to screen readers.
 *
 * Accessibility: the wrapper carries the whole sentence as its accessible name
 * and every animated span is hidden, so assistive tech reads one sentence
 * rather than a pile of fragments.
 */
export function KineticText({
  segments,
  className,
  delay = 0,
  stagger = 0.045,
  as: Tag = "h1",
}: {
  segments: Segment[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reducedMotion = usePrefersReducedMotion();

  const plain = segments.map((s) => s.text).join("");

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

  // Flatten to words while remembering which segment (and so which color) each
  // word came from, and keep a running index so the stagger is continuous
  // across segment boundaries.
  let wordIndex = 0;
  const rendered: ReactNode[] = segments.map((segment, si) => {
    const words = segment.text.split(/(\s+)/).filter((w) => w.length > 0);
    return (
      <Fragment key={si}>
        {words.map((word, wi) => {
          if (/^\s+$/.test(word)) return <Fragment key={wi}> </Fragment>;
          const i = wordIndex++;
          return (
            <span key={wi} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className={`inline-block ${segment.className ?? ""}`}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.75, delay: delay + i * stagger, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </Fragment>
    );
  });

  return (
    <Tag className={className} aria-label={plain}>
      <span aria-hidden="true">{rendered}</span>
    </Tag>
  );
}
