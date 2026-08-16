import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-medium text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-foreground-muted">{description}</p>
      ) : null}
    </div>
  );
}
