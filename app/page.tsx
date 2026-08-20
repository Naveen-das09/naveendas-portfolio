import Link from "next/link";
import { ArrowRight, Atom } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { HeroVisualGate } from "@/components/home/HeroVisualGate";
import { site } from "@/lib/data/site";
import { projects } from "@/lib/data/projects";
import { researchEntries } from "@/lib/data/research";

const thesis = researchEntries[0];

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <section className="pt-20 pb-24 md:pt-28">
        <Container className="grid items-center gap-16 md:grid-cols-2">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
              {site.role}
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-foreground md:text-5xl">
              Building at the intersection of{" "}
              <span className="text-violet">quantum computing</span> and{" "}
              <span className="text-cyan">applied machine learning</span>.
            </h1>
            <p className="mt-6 max-w-lg text-foreground-muted">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/projects">
                View Projects <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/lab/quantum-error-correction" variant="outline">
                <Atom className="h-4 w-4" /> Explore the QEC Lab
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <HeroVisualGate />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border py-24">
        <Container>
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                Featured Work
              </p>
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
              <Reveal key={project.slug} delay={i * 0.08}>
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
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet">
                Interactive Lab
              </p>
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
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm">
                Research
              </p>
              <h3 className="mt-3 font-display text-2xl text-foreground">{thesis.title}</h3>
              <p className="mt-4 text-sm text-foreground-muted">{thesis.status}</p>
              <Button href={`/research/${thesis.slug}`} variant="outline" className="mt-6">
                Read the abstract <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
