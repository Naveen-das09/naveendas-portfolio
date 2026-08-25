"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/capabilities";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/\\[]{}=+*#%";

/**
 * Settles a short label out of random glyphs when it scrolls into view — a
 * measurement collapsing into a definite value.
 *
 * The real text is what renders on the server and on first paint, so there's no
 * layout shift and no flash of gibberish if JS is slow or absent; the scramble
 * only starts once the element is actually observed. Scrambled frames reuse the
 * original string's length and keep its spaces, so the box never resizes.
 */
export function ScrambleText({
  text,
  className,
  duration = 900,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  duration?: number;
  as?: "span" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  // `null` means "show the real text" — so the reduced-motion and pre-observe
  // paths need no state write at all.
  const [scrambled, setScrambled] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let start = 0;
    let done = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      // Characters lock in left-to-right as `t` sweeps across the string.
      const settled = t * text.length;
      setScrambled(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < settled) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setScrambled(null);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return;
        done = true;
        observer.disconnect();
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration, reducedMotion]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden="true">{scrambled ?? text}</span>
    </Tag>
  );
}
