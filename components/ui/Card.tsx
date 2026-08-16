import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-border-strong",
        className,
      )}
    >
      {children}
    </div>
  );
}
