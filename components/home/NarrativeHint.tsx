"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { BEATS } from "@/lib/narrative";

const STORAGE_KEY = "qec-narrative-hint-dismissed";
const APPEAR_DELAY = 1600;

/**
 * Tells a first-time visitor what they are looking at: that scrolling walks
 * through quantum error correction, and roughly how long it runs.
 *
 * Deliberately non-blocking — this is a portfolio, so it must never gate the
 * content. It retires itself the moment the story actually starts, and stays
 * retired for repeat visits.
 */
export function NarrativeHint({ storyStarted }: { storyStarted: boolean }) {
  // Starts hidden and is only ever revealed from the timeout callback. Setting
  // state synchronously in the effect body would trip the cascading-render rule,
  // and reading storage during render would break hydration.
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Storage can throw in private mode; treat that as a first visit.
      seen = false;
    }
    if (seen) return;
    const t = window.setTimeout(() => setShow(true), APPEAR_DELAY);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — dismissing for this session is enough */
    }
  };

  const visible = show && !storyStarted;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-8 left-6 z-30 max-w-xs rounded-2xl border border-border-strong bg-surface/85 p-5 backdrop-blur-md sm:left-8"
        >
          <button
            type="button"
            onClick={dismiss}
            data-cursor-hover
            aria-label="Dismiss"
            className="absolute right-3 top-3 rounded-md p-1 text-foreground-faint transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            Scroll to watch
          </p>
          <h2 className="mt-2 pr-4 font-display text-base leading-snug text-foreground">
            How a quantum computer fixes its own errors
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
            The lattice behind this text walks through it — from a single qubit to a
            decoded correction, in {BEATS.length} steps. It follows the scroll, so
            you set the pace.
          </p>

          <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
            {BEATS.map((b, i) => (
              <span
                key={b.id}
                className={`h-px flex-1 ${i === 0 ? "bg-cyan" : "bg-border-strong"}`}
              />
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
