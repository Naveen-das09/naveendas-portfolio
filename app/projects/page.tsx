import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";
import { CATEGORIES, type Category } from "@/types";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const params = await searchParams;
  const raw = Array.isArray(params.category) ? params.category[0] : params.category;
  const initialCategory = CATEGORIES.includes(raw as Category) ? (raw as Category) : undefined;

  return (
    <Container className="py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Projects"
          title="Quantum, ML, and data science work"
          description="A mix of quantum computing research, applied ML/AI systems, and data-science engineering — filter by area below."
        />
      </Reveal>
      <div className="mt-12">
        <ProjectsExplorer projects={projects} initialCategory={initialCategory} />
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-col items-start gap-3 border-t border-border pt-10">
          <p className="text-sm text-foreground-muted">
            For more projects — including smaller experiments and work in progress —
            check my GitHub.
          </p>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-hover
            className="flex items-center gap-2 text-sm text-cyan hover:text-violet"
          >
            <GitHubIcon className="h-4 w-4" /> github.com/Naveen-das09
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </Container>
  );
}
