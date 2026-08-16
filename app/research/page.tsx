import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  keyCourses,
  phdApplications,
  researchInterests,
  thesis,
} from "@/lib/data/research";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <Container className="py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Research"
          title="M.Tech Thesis & Research Focus"
          description="Currently working on generalization in neural decoders for quantum error correction, alongside a broader interest in quantum optimization and quantum machine learning."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <Card className="mt-12">
          <Badge tone="warm">{thesis.status}</Badge>
          <h2 className="mt-4 font-display text-2xl text-foreground">{thesis.title}</h2>
          <p className="mt-2 text-sm text-foreground-faint">{thesis.institute}</p>
          <p className="mt-5 text-foreground-muted">{thesis.abstract}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {thesis.targetVenues.map((v) => (
              <Badge key={v} tone="cyan">
                {v}
              </Badge>
            ))}
          </div>
          <Button href="/lab/quantum-error-correction" variant="outline" className="mt-8">
            See it visualized in the Lab <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
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

      <Reveal delay={0.15}>
        <div className="mt-16">
          <h2 className="font-display text-xl text-foreground">PhD / MS-by-Research Applications</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {phdApplications.map((app) => (
              <Card key={app.institute}>
                <p className="font-display text-lg text-foreground">{app.institute}</p>
                <p className="mt-1 text-sm text-foreground-muted">{app.program}</p>
                <p className="mt-3 font-mono text-xs text-cyan">{app.status}</p>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
