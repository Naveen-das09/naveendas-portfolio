import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import results from "@/public/projects/qec-lab/results.png";

export function ResearchSpotlight() {
  return (
    <article className="overflow-hidden rounded-2xl border border-cyan/25 bg-surface/90">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <div className="p-6 sm:p-9 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">Open-source research</p>
            <Badge>Working alpha</Badge>
          </div>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-foreground">QEC Lab</h2>
          <p className="mt-3 font-display text-xl leading-snug text-foreground sm:text-2xl">From a research question to reproducible evidence.</p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-foreground-muted">A research workspace I built to design surface-code experiments, compare decoder assumptions, inspect logical failures, and export the evidence behind every result.</p>
          <div className="mt-7 grid grid-cols-3 gap-3 border-y border-border py-5">
            {[["Simulate", "Stim + PyMatching"], ["Inspect", "Failure-level evidence"], ["Reproduce", "Export + replay"]].map(([title, detail]) => (
              <div key={title}>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/projects/qec-lab">Explore the project <ArrowRight className="h-4 w-4" /></Button>
            <Button href="https://github.com/Naveen-das09/qec-lab" external variant="outline">View source <ArrowUpRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <figure className="flex flex-col justify-center border-t border-border bg-surface-raised/50 p-5 sm:p-8 lg:border-t-0 lg:border-l">
          <a href="/projects/qec-lab/results.png" target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-border-strong" aria-label="Open full-size QEC Lab results screenshot">
            <Image src={results} alt="QEC Lab workspace displaying measured logical error curves from a measurement-noise stress investigation" sizes="(max-width: 1024px) 90vw, 540px" className="h-auto w-full" />
          </a>
          <figcaption className="mt-4 text-xs leading-relaxed text-foreground-muted">Actual workspace · 150,000 sampled memory experiments across 15 configurations. Simulation evidence, not a threshold estimate.</figcaption>
        </figure>
      </div>
    </article>
  );
}
