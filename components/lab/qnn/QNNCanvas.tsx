"use client";

import { useEffect, useRef } from "react";
import { PALETTE } from "@/lib/palette";
import { predictProb, xorDataset, type Params4 } from "./circuit";

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const CYAN = toRgb(PALETTE.cyan);
const WARM = toRgb(PALETTE.warm);
const GRID = 48;

function lerpColor(t: number) {
  const r = Math.round(CYAN[0] + (WARM[0] - CYAN[0]) * t);
  const g = Math.round(CYAN[1] + (WARM[1] - CYAN[1]) * t);
  const b = Math.round(CYAN[2] + (WARM[2] - CYAN[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function QNNCanvas({
  params,
  withEntanglement,
}: {
  params: Params4;
  withEntanglement: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(width, height);
    });
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    function draw(width: number, height: number) {
      if (!ctx) return;
      const cell = Math.max(width, height) / GRID;

      for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
          const x = (col / (GRID - 1)) * 2 - 1;
          const y = 1 - (row / (GRID - 1)) * 2;
          const prob = predictProb([x, y], params, withEntanglement);
          ctx.fillStyle = lerpColor(prob);
          ctx.globalAlpha = 0.55;
          ctx.fillRect(col * cell, row * cell, cell + 0.5, cell + 0.5);
        }
      }
      ctx.globalAlpha = 1;

      const toPx = (point: [number, number]) => ({
        x: ((point[0] + 1) / 2) * width,
        y: ((1 - point[1]) / 2) * height,
      });

      for (const { point, label } of xorDataset) {
        const p = toPx(point);
        const color = label === 1 ? PALETTE.warm : PALETTE.cyan;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = PALETTE.background;
        ctx.lineWidth = 2;
        // Matches the bloom on the WebGL scenes so the lab reads as one system.
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    }

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) draw(rect.width, rect.height);

    return () => observer.disconnect();
  }, [params, withEntanglement]);

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Decision boundary of the quantum classifier over the 2D data plane"
      />
    </div>
  );
}
