"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  createEvent,
  envelope,
  generatePoints,
  impactEnvelope,
  lerpColor,
  pointAlongPath,
  randomBetween,
  travelProgress,
  EVENT_GAP,
  MAX_CONCURRENT,
  type FieldEvent,
  type QubitPoint,
} from "./entanglement";

function drawGlowPoint(ctx: CanvasRenderingContext2D, p: QubitPoint, intensity: number) {
  ctx.save();
  ctx.globalAlpha = Math.min(1, 0.45 + intensity * 0.55);
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 8 + 16 * intensity;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.baseRadius + 1 + intensity * 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Small, non-periodic-looking jitter so the particle reads as "charged" rather than gliding smoothly. */
function wobble(t: number, seed: number): number {
  return Math.sin(t * 26 + seed) * 3.2 + Math.sin(t * 11 + seed * 1.7) * 1.6;
}

const TRAIL = [0.02, 0.045, 0.075];

function drawSparkBurst(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  color: string,
  alpha: number,
) {
  const rays = 5 + Math.floor(Math.random() * 4);
  ctx.save();
  ctx.globalAlpha = alpha * 0.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  for (let i = 0; i < rays; i++) {
    const angle = Math.random() * Math.PI * 2;
    const len = 2.5 + Math.random() * 4;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + Math.cos(angle) * len, pos.y + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.restore();
}

function drawChargedParticle(
  ctx: CanvasRenderingContext2D,
  ev: Extract<FieldEvent, { kind: "pair" }>,
  a: QubitPoint,
  b: QubitPoint,
  progress: number,
  intensity: number,
) {
  const headT = travelProgress(progress);
  if (headT <= 0 || intensity <= 0) return;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const seed = ev.startedAt % 1000;

  const project = (t: number) => {
    const base = pointAlongPath(ev.path, ev.cumLen, ev.totalLen, t);
    const wob = wobble(t, seed) + (Math.random() - 0.5) * 1.6;
    return { x: base.x + nx * wob, y: base.y + ny * wob };
  };

  for (let i = TRAIL.length - 1; i >= 0; i--) {
    const t = headT - TRAIL[i];
    if (t < 0) continue;
    const pos = project(t);
    const color = lerpColor(a.color, b.color, t);
    const fade = 1 - i / TRAIL.length;
    const flicker = 0.4 + Math.random() * 0.5;

    ctx.save();
    ctx.globalAlpha = intensity * fade * flicker * 0.7;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6 * fade;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, fade + 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const headPos = project(headT);
  const headColor = lerpColor(a.color, b.color, headT);
  const headFlicker = 0.7 + Math.random() * 0.3;

  drawSparkBurst(ctx, headPos, headColor, intensity * headFlicker);

  ctx.save();
  ctx.globalAlpha = intensity * headFlicker;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = headColor;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(headPos.x, headPos.y, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEvent(
  ctx: CanvasRenderingContext2D,
  ev: FieldEvent,
  points: QubitPoint[],
  progress: number,
) {
  const intensity = envelope(progress);
  if (ev.kind === "solo") {
    const p = points[ev.pointIdx];
    if (!p || intensity <= 0) return;
    drawGlowPoint(ctx, p, intensity);
    return;
  }

  const a = points[ev.a];
  const b = points[ev.b];
  if (!a || !b) return;

  const impact = impactEnvelope(progress);
  if (intensity > 0) {
    drawGlowPoint(ctx, a, intensity);
    const impactFlicker = impact > 0 ? 0.7 + Math.random() * 0.3 : 1;
    drawGlowPoint(ctx, b, intensity + impact * 1.3 * impactFlicker);
  }
  drawChargedParticle(ctx, ev, a, b, progress, intensity);
}

function EntanglementFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const pointsRef = useRef<QubitPoint[]>([]);
  const activeEventsRef = useRef<FieldEvent[]>([]);
  const nextEventAtRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

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
      sizeRef.current = { width, height };

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        pointsRef.current = generatePoints(width, height);
      }, 200);
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

      if (!reducedMotionRef.current) {
        if (now >= nextEventAtRef.current && activeEventsRef.current.length < MAX_CONCURRENT) {
          const event = createEvent(now, pointsRef.current);
          if (event) activeEventsRef.current = [...activeEventsRef.current, event];
          nextEventAtRef.current = now + randomBetween(EVENT_GAP);
        }
        activeEventsRef.current = activeEventsRef.current.filter(
          (ev) => now - ev.startedAt < ev.duration,
        );
      }

      for (const p of pointsRef.current) {
        ctx.save();
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius + 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!reducedMotionRef.current) {
        for (const ev of activeEventsRef.current) {
          const progress = Math.max(0, Math.min(1, (now - ev.startedAt) / ev.duration));
          drawEvent(ctx, ev, pointsRef.current, progress);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        activeEventsRef.current = [];
        nextEventAtRef.current = performance.now() + randomBetween(EVENT_GAP);
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export function EntanglementField() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <EntanglementFieldCanvas />;
}
