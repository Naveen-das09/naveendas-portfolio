import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { keyCourses, researchEntries, researchInterests } from "@/lib/data/research";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <Container className="py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Research"
          title="Research"
          description="Ongoing and future research, starting with my M.Tech thesis on generalization in neural decoders for quantum error correction."
        />
      </Reveal>

      <div className="mt-12 space-y-6">
        {researchEntries.map((entry, i) => (
          <Reveal key={entry.slug} delay={i * 0.06}>
            <Link href={`/research/${entry.slug}`} data-cursor-hover>
              <div className="group rounded-2xl border border-border bg-surface/60 p-8 transition-colors hover:border-warm/50">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="warm">{entry.tag}</Badge>
                  <span className="font-mono text-xs text-foreground-faint">{entry.status}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl text-foreground md:text-3xl">
                  {entry.title}
                </h2>
                <p className="mt-3 max-w-2xl text-foreground-muted">{entry.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-cyan">
                  Read the full abstract <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-20 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-foreground">Research Interests</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
              {researchInterests.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-violet">▸</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl text-foreground">Key Coursework</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {keyCourses.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
