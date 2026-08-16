"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import {
  computeSyndrome,
  decode,
  generateLattice,
  randomDataQubitId,
  type CodeFamily,
  type Lattice,
} from "./lattice";
import { qecSteps } from "./steps";
import { QECCanvas } from "./QECCanvas";
import { cn } from "@/lib/utils";

const DISTANCES = [3, 5, 7];

function nearestDataQubitId(lattice: Lattice, targetCol: number, targetRow: number) {
  let best = lattice.dataQubits[0];
  let bestDist = Infinity;
  for (const dq of lattice.dataQubits) {
    const dist = Math.hypot(dq.col - targetCol, dq.row - targetRow);
    if (dist < bestDist) {
      bestDist = dist;
      best = dq;
    }
  }
  return best.id;
}

export function QECExplainer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [family, setFamily] = useState<CodeFamily>("surface");
  const [distance, setDistance] = useState(5);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [errorFrac, setErrorFrac] = useState<{ col: number; row: number } | null>(null);

  const lattice = useMemo(() => generateLattice(family, distance), [family, distance]);
  const syndrome = useMemo(() => computeSyndrome(lattice, errorId), [lattice, errorId]);
  const correctionId = useMemo(() => decode(lattice, syndrome), [lattice, syndrome]);

  const step = qecSteps[stepIndex];
  const injectIdx = qecSteps.findIndex((s) => s.id === "inject");
  const decodeIdx = qecSteps.findIndex((s) => s.id === "decode");
  const distanceIdx = qecSteps.findIndex((s) => s.id === "distance");
  const familyIdx = qecSteps.findIndex((s) => s.id === "family");

  const canInject = stepIndex >= injectIdx;
  const showDistanceControls = stepIndex >= distanceIdx;
  const showFamilyControls = stepIndex >= familyIdx;
  const showCorrection = stepIndex >= decodeIdx && errorId !== null;

  const setError = useCallback(
    (id: string) => {
      const dq = lattice.dataQubits.find((d) => d.id === id);
      if (!dq) return;
      setErrorId(id);
      setErrorFrac({
        col: lattice.width > 0 ? dq.col / lattice.width : 0,
        row: lattice.height > 0 ? dq.row / lattice.height : 0,
      });
    },
    [lattice],
  );

  const injectRandom = useCallback(() => {
    setError(randomDataQubitId(lattice));
  }, [lattice, setError]);

  // Auto-inject once the learner reaches the "inject" step without clicking.
  useEffect(() => {
    if (stepIndex >= injectIdx && errorId === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to step navigation with an impure random pick, not derived state
      injectRandom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // Re-project the same relative error position onto a new distance.
  function changeDistance(next: number) {
    setDistance(next);
    if (errorFrac) {
      const nextLattice = generateLattice(family, next);
      const targetCol = errorFrac.col * nextLattice.width;
      const targetRow = errorFrac.row * nextLattice.height;
      const id = nearestDataQubitId(nextLattice, targetCol, targetRow);
      setErrorId(id);
    }
  }

  function changeFamily(next: CodeFamily) {
    setFamily(next);
    const nextLattice = generateLattice(next, distance);
    const id = randomDataQubitId(nextLattice);
    const dq = nextLattice.dataQubits.find((d) => d.id === id)!;
    setErrorId(id);
    setErrorFrac({
      col: nextLattice.width > 0 ? dq.col / nextLattice.width : 0,
      row: nextLattice.height > 0 ? dq.row / nextLattice.height : 0,
    });
  }

  const goNext = useCallback(
    () => setStepIndex((i) => Math.min(i + 1, qecSteps.length - 1)),
    [],
  );
  const goPrev = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-start">
      <div className="order-2 md:order-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          Step {stepIndex + 1} / {qecSteps.length}
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
          {step.title}
        </h2>
        <p className="mt-4 text-foreground-muted">{step.body}</p>

        <div className="mt-8 space-y-6">
          {canInject ? (
            <button
              type="button"
              onClick={injectRandom}
              data-cursor-hover
              className="flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm text-foreground-muted hover:border-warm hover:text-warm"
            >
              <Shuffle className="h-4 w-4" /> Randomize error
            </button>
          ) : null}

          {showDistanceControls ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Code distance
              </p>
              <div className="flex gap-2">
                {DISTANCES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => changeDistance(d)}
                    data-cursor-hover
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm",
                      distance === d
                        ? "border-cyan text-cyan"
                        : "border-border-strong text-foreground-muted hover:text-foreground",
                    )}
                  >
                    d = {d}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {showFamilyControls ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Code family
              </p>
              <div className="flex gap-2">
                {(["surface", "repetition"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => changeFamily(f)}
                    data-cursor-hover
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm capitalize",
                      family === f
                        ? "border-violet text-violet"
                        : "border-border-strong text-foreground-muted hover:text-foreground",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex === 0}
            data-cursor-hover
            className="flex items-center gap-1 rounded-full border border-border-strong px-4 py-2 text-sm text-foreground-muted hover:text-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={stepIndex === qecSteps.length - 1}
            data-cursor-hover
            className="flex items-center gap-1 rounded-full bg-warm px-4 py-2 text-sm text-background disabled:opacity-30"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
          <p className="ml-2 hidden font-mono text-xs text-foreground-faint md:block">
            ← / → to navigate
          </p>
        </div>
      </div>

      <div className="order-1 md:sticky md:top-24 md:order-2">
        <QECCanvas
          lattice={lattice}
          errorId={errorId}
          syndrome={syndrome}
          correctionId={correctionId}
          showCorrection={showCorrection}
          onQubitClick={canInject ? setError : undefined}
        />
        <p className="mt-4 text-center font-mono text-xs text-foreground-faint">
          {canInject ? "Click a data qubit to move the error" : "Read along to begin"}
        </p>
      </div>
    </div>
  );
}
