"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/capabilities";
import { MS_PER_CHAR, scramble } from "@/lib/scramble";
/**
 * A run of headline text. `className` colours that run, so accent spans survive
 * the scramble.
 */
export type Segment = { text: string; className?: string };

type Piece = { text: string; className?: string; offset: number };

/**
 * The eyebrow's decode effect, applied to a multi-line headline.
 *
 * Two things make this harder than ScrambleText, which only ever runs on a
 * monospace label:
 *
 * 1. Layout. The headline is set in a proportional face, so substituting random
 *    glyphs changes each word's width — the text would jitter and, worse, the
 *    line breaks would move mid-animation. So the real text is always present as
 *    an invisible layer and is what the browser lays out; the scrambling copy is
 *    painted over it, absolutely positioned. Wrapping therefore never moves.
 * 2. Colour. Accent runs ("quantum computing", "applied machine learning") span
 *    the same words being scrambled, so pieces keep their own className and each
 *    tracks its offset in the whole sentence — the decode sweeps left-to-right
 *    across the headline as one gesture, not per-segment.
 *
 * Frames are written straight to the DOM rather than through state: this runs
 * alongside the WebGL hero, and re-rendering a few hundred spans every frame would
 * compete with it.
 *
 * Accessibility and no-JS both get the real sentence: it is what renders on the
 * server, the wrapper carries it as the accessible name, and the animated layer
 * is aria-hidden.
 */
export function ScrambleHeadline({
  segments,
  className,
  delay = 150,
  as: Tag = "h1",
}: {
  segments: Segment[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reducedMotion = usePrefersReducedMotion();
  // Once the decode finishes the two-layer scaffold is torn down and the plain
  // sentence rendered on its own. The scaffold duplicates the text (one layer
  // laid out, one painted), which is invisible but would otherwise double what
  // find-in-page matches and what a reader copies.
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const pieceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const plain = segments.map((s) => s.text).join("");

  // Group consecutive non-space pieces so a word and its trailing punctuation
  // ("learning" + ".") stay in one inline-block and wrap as a unit, while the
  // spaces between groups remain real text nodes so wrapping stays natural.
  const { groups, totalChars } = useMemo(() => {
    const groups: Piece[][] = [];
    let current: Piece[] = [];
    let offset = 0;

    for (const segment of segments) {
      for (const token of segment.text.split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          if (current.length) groups.push(current);
          current = [];
          groups.push([{ text: " ", className: undefined, offset: -1 }]);
          offset += token.length;
          continue;
        }
        current.push({ text: token, className: segment.className, offset });
        offset += token.length;
      }
    }
    if (current.length) groups.push(current);
    return { groups, totalChars: offset };
  }, [segments]);

  useEffect(() => {
    if (reducedMotion || done) return;
    const el = rootRef.current;
    if (!el) return;

    const duration = Math.max(600, totalChars * MS_PER_CHAR);
    let raf = 0;
    let start = 0;
    let started = false;

    const paint = (t: number) => {
      const flat = flatten(groups);
      pieceRefs.current.forEach((node, i) => {
        const piece = flat[i];
        if (!node || !piece || piece.offset < 0) return;
        node.textContent = scramble(piece.text, t, totalChars, piece.offset);
      });
    };

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      paint(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };

    let cleanupTimer = () => {};
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        // Hold the real text until the scramble actually begins, so a slow
        // start never shows a frame of gibberish before the sweep.
        const timer = window.setTimeout(() => {
          raf = requestAnimationFrame(tick);
        }, delay);
        cleanupTimer = () => window.clearTimeout(timer);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      cleanupTimer();
    };
  }, [groups, totalChars, delay, reducedMotion, done]);

  if (reducedMotion || done) {
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

  let refIndex = 0;
  return (
    <Tag ref={rootRef as never} className={className} aria-label={plain}>
      <span aria-hidden="true">
        {groups.map((group, gi) => {
          if (group.length === 1 && group[0].offset < 0) {
            return <span key={gi}> </span>;
          }
          return (
            <span key={gi} className="relative inline-block whitespace-pre">
              {/* Invisible, but still laid out — this is what sets the width
                  and drives line breaking, so the scramble cannot reflow it. */}
              <span className="invisible">
                {group.map((piece, pi) => (
                  <span key={pi} className={piece.className}>
                    {piece.text}
                  </span>
                ))}
              </span>
              <span className="absolute left-0 top-0 whitespace-pre">
                {group.map((piece, pi) => {
                  const idx = refIndex++;
                  return (
                    <span
                      key={pi}
                      ref={(node) => {
                        pieceRefs.current[idx] = node;
                      }}
                      className={piece.className}
                    >
                      {piece.text}
                    </span>
                  );
                })}
              </span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

/** Same traversal order the refs are assigned in. */
function flatten(groups: Piece[][]) {
  const out: Piece[] = [];
  for (const group of groups) {
    if (group.length === 1 && group[0].offset < 0) continue;
    for (const piece of group) out.push(piece);
  }
  return out;
}
