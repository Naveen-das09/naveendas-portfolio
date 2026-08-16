"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Play, RotateCcw } from "lucide-react";
import {
  meanSquaredLoss,
  randomParams,
  trainStep,
  xorDataset,
  type Params4,
} from "./circuit";
import { qnnSteps } from "./steps";
import { QNNCanvas } from "./QNNCanvas";
import { CircuitDiagram } from "./CircuitDiagram";
import { LossSparkline } from "./LossSparkline";
import { cn } from "@/lib/utils";

const TRAIN_STEPS = 40;
const LEARNING_RATE = 0.6;
// A fixed, non-trivial starting point so server and client render the same
// markup on first paint; randomized client-side after mount (see effect below).
const INITIAL_PARAMS: Params4 = [0.4, -0.3, 0.5, -0.2];

export function QNNExplainer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [params, setParams] = useState<Params4>(INITIAL_PARAMS);
  const [withEntanglement, setWithEntanglement] = useState(true);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only randomization, avoids SSR/client hydration mismatch
    setParams(randomParams());
  }, []);

  const currentLoss = useMemo(
    () => meanSquaredLoss(xorDataset, params, withEntanglement),
    [params, withEntanglement],
  );

  const step = qnnSteps[stepIndex];
  const entangleIdx = qnnSteps.findIndex((s) => s.id === "entangle");
  const trainingIdx = qnnSteps.findIndex((s) => s.id === "training");

  const showEntanglementToggle = stepIndex >= entangleIdx;
  const showTrainingControls = stepIndex >= trainingIdx;

  function reset() {
    setParams(randomParams());
    setLossHistory([]);
  }

  async function handleTrain() {
    if (isTraining) return;
    setIsTraining(true);
    let current = params;
    for (let i = 0; i < TRAIN_STEPS; i++) {
      const result = trainStep(xorDataset, current, withEntanglement, LEARNING_RATE);
      current = result.params;
      setParams(current);
      setLossHistory((h) => [...h, result.loss].slice(-60));
      await new Promise((resolve) => setTimeout(resolve, 45));
    }
    setIsTraining(false);
  }

  const goNext = useCallback(
    () => setStepIndex((i) => Math.min(i + 1, qnnSteps.length - 1)),
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
          Step {stepIndex + 1} / {qnnSteps.length}
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">
          {step.title}
        </h2>
        <p className="mt-4 text-foreground-muted">{step.body}</p>

        <div className="mt-8 space-y-6">
          {showEntanglementToggle ? (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-foreground-faint">
                Entangling gate
              </p>
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setWithEntanglement(val)}
                    data-cursor-hover
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm",
                      withEntanglement === val
                        ? "border-warm text-warm"
                        : "border-border-strong text-foreground-muted hover:text-foreground",
                    )}
                  >
                    {val ? "With CNOT" : "Without CNOT"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {showTrainingControls ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTrain}
                  disabled={isTraining}
                  data-cursor-hover
                  className="flex items-center gap-2 rounded-full bg-warm px-4 py-2 text-sm text-background disabled:opacity-50"
                >
                  <Play className="h-4 w-4" /> {isTraining ? "Training…" : "Train"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={isTraining}
                  data-cursor-hover
                  className="flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm text-foreground-muted hover:text-foreground disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
              <div>
                <p className="font-mono text-xs text-foreground-faint">
                  loss: {currentLoss.toFixed(4)}
                </p>
                <LossSparkline history={lossHistory} />
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
            disabled={stepIndex === qnnSteps.length - 1}
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
        <div className="rounded-xl border border-border bg-surface/60 p-4">
          <CircuitDiagram params={params} withEntanglement={withEntanglement} />
        </div>
        <div className="mt-4">
          <QNNCanvas params={params} withEntanglement={withEntanglement} />
        </div>
        <p className="mt-4 text-center font-mono text-xs text-foreground-faint">
          background = predicted class · dots = true labels (XOR pattern)
        </p>
      </div>
    </div>
  );
}
