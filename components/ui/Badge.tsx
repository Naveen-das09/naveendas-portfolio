import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "cyan" | "violet" | "warm";
}) {
  const toneStyles = {
    default: "border-border-strong text-foreground-muted",
    cyan: "border-cyan/40 text-cyan",
    violet: "border-violet/40 text-violet",
    warm: "border-warm/40 text-warm",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs tracking-wide",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
