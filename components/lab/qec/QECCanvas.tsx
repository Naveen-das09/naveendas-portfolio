"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Lattice } from "./lattice";

interface QECCanvasProps {
  lattice: Lattice;
  errorId: string | null;
  syndrome: Set<string>;
  correctionId: string | null;
  showCorrection: boolean;
  onQubitClick?: (id: string) => void;
}

const COLORS = {
  dataIdle: "#8b93a7",
  dataError: "#ffb454",
  edge: "rgba(76, 201, 240, 0.18)",
  ancillaIdle: "#2a3350",
  ancillaFired: "#4cc9f0",
  correction: "#b983ff",
  text: "#565f78",
};

export function QECCanvas({
  lattice,
  errorId,
  syndrome,
  correctionId,
  showCorrection,
  onQubitClick,
}: QECCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const sparkStart = useRef<number | null>(null);
  const correctionStart = useRef<number | null>(null);
  const prevError = useRef<string | null>(null);
  const prevCorrection = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (errorId && errorId !== prevError.current) {
      sparkStart.current = performance.now();
    }
    prevError.current = errorId;
  }, [errorId]);

  useEffect(() => {
    if (showCorrection && !prevCorrection.current) {
      correctionStart.current = performance.now();
    }
    prevCorrection.current = showCorrection;
  }, [showCorrection]);

  const layout = useCallback((width: number, height: number) => {
    const padding = 46;
    const spanX = Math.max(lattice.width, 0.001);
    const spanY = Math.max(lattice.height, 0.001);
    const scale = Math.min(
      (width - padding * 2) / spanX,
      (height - padding * 2) / Math.max(spanY, 1),
    );
    const offsetX = width / 2 - (spanX * scale) / 2;
    const offsetY = height / 2 - (spanY * scale) / 2;
    return (col: number, row: number) => ({
      x: offsetX + col * scale,
      y: offsetY + row * scale,
    });
  }, [lattice.width, lattice.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      sizeRef.current = { width, height };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    function draw(now: number) {
      if (!ctx) return;
      const { width, height } = sizeRef.current;
      if (width === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const project = layout(width, height);
      const pulse = reducedMotion.current
        ? 0.85
        : 0.6 + 0.4 * Math.sin(now / 420);

      // edges
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = COLORS.edge;
      for (const ancilla of lattice.ancillaQubits) {
        const a = project(ancilla.col, ancilla.row);
        for (const neighborId of ancilla.neighbors) {
          const dq = lattice.dataQubits.find((d) => d.id === neighborId);
          if (!dq) continue;
          const p = project(dq.col, dq.row);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      // correction path
      if (showCorrection && correctionId && correctionStart.current) {
        const progress = reducedMotion.current
          ? 1
          : Math.min(1, (now - correctionStart.current) / 500);
        const dq = lattice.dataQubits.find((d) => d.id === correctionId);
        if (dq) {
          const center = project(dq.col, dq.row);
          ctx.save();
          ctx.strokeStyle = COLORS.correction;
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 5]);
          const r = 22 * progress;
          ctx.beginPath();
          ctx.arc(center.x, center.y, r, 0, Math.PI * 2 * progress);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ancilla nodes
      for (const ancilla of lattice.ancillaQubits) {
        const p = project(ancilla.col, ancilla.row);
        const fired = syndrome.has(ancilla.id);
        ctx.beginPath();
        const r = fired ? 7 + pulse * 3 : 5;
        ctx.fillStyle = fired ? COLORS.ancillaFired : COLORS.ancillaIdle;
        if (fired) {
          ctx.shadowColor = COLORS.ancillaFired;
          ctx.shadowBlur = 14 * pulse;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.moveTo(p.x, p.y - r);
        ctx.lineTo(p.x + r, p.y);
        ctx.lineTo(p.x, p.y + r);
        ctx.lineTo(p.x - r, p.y);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // data qubits
      for (const dq of lattice.dataQubits) {
        const p = project(dq.col, dq.row);
        const isError = dq.id === errorId;
        ctx.beginPath();
        ctx.fillStyle = isError ? COLORS.dataError : COLORS.dataIdle;
        if (isError) {
          ctx.shadowColor = COLORS.dataError;
          ctx.shadowBlur = 16;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.arc(p.x, p.y, isError ? 8 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // spark burst on freshly-injected error
        if (isError && sparkStart.current !== null && !reducedMotion.current) {
          const t = (now - sparkStart.current) / 900;
          if (t < 1) {
            ctx.save();
            ctx.globalAlpha = 1 - t;
            ctx.strokeStyle = COLORS.dataError;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8 + t * 26, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [lattice, errorId, syndrome, correctionId, showCorrection, layout]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onQubitClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const project = layout(rect.width, rect.height);

    let closest: { id: string; dist: number } | null = null;
    for (const dq of lattice.dataQubits) {
      const p = project(dq.col, dq.row);
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist < 20 && (!closest || dist < closest.dist)) {
        closest = { id: dq.id, dist };
      }
    }
    if (closest) onQubitClick(closest.id);
  }

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        role="img"
        aria-label="Interactive quantum error correction lattice diagram"
        className={onQubitClick ? "cursor-pointer" : ""}
      />
    </div>
  );
}
