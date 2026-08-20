"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACHIEVEMENTS, computeUnlocked, type AchievementId } from "@/lib/achievements";

const VISITED_KEY = "portfolio:visited:v1";
const SECRET_KEY = "portfolio:secret:v1";
const INTRO_KEY = "portfolio:intro-seen:v1";
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function loadVisited(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VISITED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

const toneGlow = {
  cyan: "border-cyan/40 shadow-[0_0_24px_-8px_var(--accent-cyan)]",
  violet: "border-violet/40 shadow-[0_0_24px_-8px_var(--accent-violet)]",
  warm: "border-warm/40 shadow-[0_0_24px_-8px_var(--accent-warm)]",
} as const;

const toneText = {
  cyan: "text-cyan",
  violet: "text-violet",
  warm: "text-warm",
} as const;

export function AchievementsWidget({
  projectSlugs,
  researchSlugs,
  articleSlugs,
}: {
  projectSlugs: string[];
  researchSlugs: string[];
  articleSlugs: string[];
}) {
  const pathname = usePathname();
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [secretFound, setSecretFound] = useState(false);
  const [open, setOpen] = useState(false);
  const [toastId, setToastId] = useState<AchievementId | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const seenUnlocked = useRef<Set<AchievementId>>(new Set());
  const hydrated = useRef(false);

  useEffect(() => {
    const initialVisited = loadVisited();
    const initialSecret = window.localStorage.getItem(SECRET_KEY) === "1";
    const introSeen = window.localStorage.getItem(INTRO_KEY) === "1";
    seenUnlocked.current = computeUnlocked({
      visited: initialVisited,
      projectSlugs,
      researchSlugs,
      articleSlugs,
      secretFound: initialSecret,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount
    setVisited(initialVisited);
    setSecretFound(initialSecret);
    if (!introSeen) {
      setShowIntro(true);
      window.localStorage.setItem(INTRO_KEY, "1");
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once on mount only
  }, []);

  useEffect(() => {
    if (!hydrated.current || !pathname) return;
    setVisited((prev) => {
      if (prev.has(pathname)) return prev;
      const next = new Set(prev);
      next.add(pathname);
      window.localStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    let buffer: string[] = [];
    const onKeyDown = (e: KeyboardEvent) => {
      buffer = [...buffer, e.key].slice(-KONAMI.length);
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        setSecretFound(true);
        window.localStorage.setItem(SECRET_KEY, "1");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const unlocked = useMemo(
    () => computeUnlocked({ visited, projectSlugs, researchSlugs, articleSlugs, secretFound }),
    [visited, projectSlugs, researchSlugs, articleSlugs, secretFound],
  );

  useEffect(() => {
    if (!hydrated.current) return;
    for (const id of unlocked) {
      if (!seenUnlocked.current.has(id)) {
        seenUnlocked.current.add(id);
        setToastId(id);
      }
    }
  }, [unlocked]);

  useEffect(() => {
    if (!toastId) return;
    const timer = setTimeout(() => setToastId(null), 4200);
    return () => clearTimeout(timer);
  }, [toastId]);

  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => setShowIntro(false), 5500);
    return () => clearTimeout(timer);
  }, [showIntro]);

  const toastAchievement = toastId ? ACHIEVEMENTS.find((a) => a.id === toastId) : null;

  return (
    <>
      <AnimatePresence>
        {showIntro && !toastAchievement ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 right-4 z-[80] flex max-w-xs items-start gap-3 rounded-2xl border border-violet/40 bg-surface/95 p-4 shadow-[0_0_24px_-8px_var(--accent-violet)] backdrop-blur-md"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-faint">
                Signals hidden on this site
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                Explore the projects, lab, and articles to unlock achievements. Check the
                tray, bottom right.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toastAchievement ? (
          <motion.div
            key={toastAchievement.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed bottom-20 right-4 z-[80] flex max-w-xs items-start gap-3 rounded-2xl border bg-surface/95 p-4 backdrop-blur-md",
              toneGlow[toastAchievement.tone],
            )}
          >
            <Sparkles className={cn("mt-0.5 h-4 w-4 shrink-0", toneText[toastAchievement.tone])} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-faint">
                Achievement unlocked
              </p>
              <p className={cn("mt-1 font-display text-sm", toneText[toastAchievement.tone])}>
                {toastAchievement.title}
              </p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {toastAchievement.description}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-[80]">
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="mb-3 w-72 rounded-2xl border border-border bg-surface/95 p-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-faint">
                  Signals found — {unlocked.size}/{ACHIEVEMENTS.length}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close achievements"
                  data-cursor-hover
                  className="text-foreground-faint hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {ACHIEVEMENTS.map((a) => {
                  const isUnlocked = unlocked.has(a.id);
                  return (
                    <li
                      key={a.id}
                      className={cn(
                        "rounded-lg border px-3 py-2 transition-colors",
                        isUnlocked ? toneGlow[a.tone] : "border-border",
                      )}
                    >
                      <p
                        className={cn(
                          "font-display text-xs",
                          isUnlocked ? toneText[a.tone] : "text-foreground-faint",
                        )}
                      >
                        {isUnlocked ? a.title : "???"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-muted">
                        {isUnlocked ? a.description : a.hint}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            setShowIntro(false);
          }}
          data-cursor-hover
          aria-label="View achievements"
          className={cn(
            "flex items-center gap-2 rounded-full border bg-surface/90 px-4 py-2.5 text-cyan backdrop-blur-md transition-colors hover:border-border-strong",
            showIntro ? "border-violet/50 shadow-[0_0_20px_-6px_var(--accent-violet)]" : "border-border",
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="font-mono text-xs tracking-wide">
            {unlocked.size}/{ACHIEVEMENTS.length}
          </span>
        </button>
      </div>
    </>
  );
}
