import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { projects } from "@/lib/data/projects";
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
    </Container>
  );
}
