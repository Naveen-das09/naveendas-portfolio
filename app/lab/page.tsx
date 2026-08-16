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
          <Card className="h-full opacity-60">
            <Sparkles className="h-6 w-6 text-foreground-faint" />
            <h3 className="mt-4 font-display text-xl text-foreground">
              More explainers coming soon
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              Next up: a 3D Bloch-sphere visualization of single-qubit gates.
            </p>
          </Card>
        </Reveal>
      </div>
    </Container>
  );
}
