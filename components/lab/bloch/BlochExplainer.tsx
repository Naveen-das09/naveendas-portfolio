"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GATES, ZERO, type GateId, type Vec3 } from "./gates";
import { blochSteps } from "./steps";

const BlochSphere = dynamic(() => import("./BlochSphere").then((m) => m.BlochSphere), {
  ssr: false,
  loading: () => <div className="mx-auto h-[260px] w-[260px] md:h-[300px] md:w-[300px]" />,
});

const PAULI_GATES: GateId[] = ["X", "Y", "Z"];
const PHASE_GATES: GateId[] = ["S", "T"];

function GateButton({ id, onClick }: { id: GateId; onClick: (id: GateId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      data-cursor-hover
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-sm text-foreground-muted hover:border-violet hover:text-violet"
    >
      {GATES[id].label}
    </button>
  );
}

export function BlochExplainer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [vector, setVector] = useState<Vec3>(ZERO);
  const [lastGateId, setLastGateId] = useState<GateId | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const probRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client capability detection, not derived render state
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const step = blochSteps[stepIndex];
  const pauliIdx = blochSteps.findIndex((s) => s.id === "pauli");
  const hadamardIdx = blochSteps.findIndex((s) => s.id === "hadamard");
  const phaseIdx = blochSteps.findIndex((s) => s.id === "phase");
  const measurementIdx = blochSteps.findIndex((s) => s.id === "measurement");

  const showPauli = stepIndex >= pauliIdx;
  const showHadamard = stepIndex >= hadamardIdx;
  const showPhase = stepIndex >= phaseIdx;
  const showMeasurement = stepIndex >= measurementIdx;

  const fire = useCallback((id: GateId) => {
    setVector((v) => GATES[id].apply(v));
    setLastGateId(id);
  }, []);

  const goNext = useCallback(
    () => setStepIndex((i) => Math.min(i + 1, blochSteps.length - 1)),
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
          Step {stepIndex + 1} / {blochSteps.length}
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">{step.title}</h2>
        <p className="mt-4 text-foreground-muted">{step.body}</p>

        <div className="mt-8 space-y-6">
          {showPauli ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Pauli gates
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {PAULI_GATES.map((id) => (
                  <GateButton key={id} id={id} onClick={fire} />
                ))}
                <button
                  type="button"
                  onClick={() => fire("RESET")}
                  data-cursor-hover
                  className="rounded-full border border-border-strong px-4 py-2 text-sm text-foreground-muted hover:border-warm hover:text-warm"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : null}

          {showHadamard ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Hadamard
              </p>
              <div className="flex gap-2">
                <GateButton id="H" onClick={fire} />
              </div>
            </div>
          ) : null}

          {showPhase ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Phase gates
              </p>
              <div className="flex gap-2">
                {PHASE_GATES.map((id) => (
                  <GateButton key={id} id={id} onClick={fire} />
                ))}
              </div>
            </div>
          ) : null}

          {showMeasurement ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Measurement probability
              </p>
              <p className="font-mono text-sm text-foreground">
                P(0) = <span ref={probRef} className="text-cyan">100%</span>
              </p>
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
            disabled={stepIndex === blochSteps.length - 1}
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

      <div className="order-1 md:order-2">
        <BlochSphere
          vector={vector}
          lastGateId={lastGateId}
          reducedMotion={reducedMotion}
          probRef={probRef}
        />
        <p className="mt-4 text-center font-mono text-xs text-foreground-faint">
          Drag to orbit the sphere
        </p>
      </div>
    </div>
  );
}
