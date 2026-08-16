import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Atom, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Lab" };

export default function LabPage() {
  return (
    <Container className="py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Lab"
          title="Interactive explainers"
          description="Hands-on, click-through visualizations of the ideas behind my research — built to be explored, not just read."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal>
          <Link href="/lab/quantum-error-correction" data-cursor-hover>
            <Card className="h-full hover:-translate-y-1">
              <Atom className="h-6 w-6 text-violet" />
              <h3 className="mt-4 font-display text-xl text-foreground">
                Quantum Error Correction
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">
                Inject an error, watch stabilizers catch it, and see a decoder
                propose a fix — across different code distances and code
                families.
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm text-cyan">
                Open explainer <ArrowUpRight className="h-4 w-4" />
              </span>
            </Card>
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <Link href="/lab/quantum-neural-network" data-cursor-hover>
            <Card className="h-full hover:-translate-y-1">
              <Sparkles className="h-6 w-6 text-cyan" />
              <h3 className="mt-4 font-display text-xl text-foreground">
                Quantum Neural Networks
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">
                A real 2-qubit variational circuit, trained live in your
                browser with the parameter-shift rule — watch entanglement
                unlock a boundary a classical linear model can&apos;t reach.
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm text-cyan">
                Open explainer <ArrowUpRight className="h-4 w-4" />
              </span>
            </Card>
          </Link>
        </Reveal>
      </div>
    </Container>
  );
}
