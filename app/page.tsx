import Link from "next/link";
import { ResearchSpotlight } from "@/components/research/ResearchSpotlight";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ScrollNarrative } from "@/components/home/ScrollNarrative";
import { projects } from "@/lib/data/projects";
import { researchEntries } from "@/lib/data/research";

const thesis = researchEntries.find((entry) => entry.slug === "neural-decoder-generalization")!;

export default function Home() {
  const featured = projects.filter((p) => p.featured && p.slug !== "qec-lab");

  return (
    <>
      <ScrollNarrative />

      <section id="featured-research" className="pt-16">
        <Container><ResearchSpotlight /></Container>
      </section>

      <section className="py-24">
        <Container>
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <ScrambleText
                as="p"
                text="Featured Work"
                className="font-mono text-xs uppercase tracking-[0.2em] text-cyan"
              />
              <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
                Quantum, AI &amp; software projects
              </h2>
            </div>
            <Link
              href="/projects"
              data-cursor-hover
              className="flex items-center gap-1 text-sm text-foreground-muted hover:text-cyan"
            >
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08} variant="scale-in">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-24">
        <Container className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-border bg-surface/60 p-8">
              <ScrambleText
                as="p"
                text="Interactive Lab"
                className="font-mono text-xs uppercase tracking-[0.2em] text-violet"
              />
              <h3 className="mt-3 font-display text-2xl text-foreground">
                See how a quantum computer corrects its own errors
              </h3>
              <p className="mt-4 text-sm text-foreground-muted">
                A step-by-step, click-through visualization of the surface code —
                inject an error, watch stabilizers measure the syndrome, and see a
                decoder propose a correction across different code distances and
                families. Built alongside my M.Tech thesis on decoder
                generalization.
              </p>
              <Button href="/lab/quantum-error-correction" variant="outline" className="mt-6">
                Open the explainer <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-surface/60 p-8">
              <ScrambleText
                as="p"
                text="Research"
                className="font-mono text-xs uppercase tracking-[0.2em] text-warm"
              />
              <h3 className="mt-3 font-display text-2xl text-foreground">{thesis.title}</h3>
              <p className="mt-4 text-sm text-foreground-muted">{thesis.summary}</p>
              <p className="mt-3 font-mono text-xs text-warm">{thesis.status}</p>
              <Button href={`/research/${thesis.slug}`} variant="outline" className="mt-6">
                Explore the research <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
