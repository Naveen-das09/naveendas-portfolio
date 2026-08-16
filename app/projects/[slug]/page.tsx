import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import { projects, getProjectBySlug } from "@/lib/data/projects";
import { CATEGORY_LABEL } from "@/types";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <Container className="py-20">
      <Link
        href="/projects"
        data-cursor-hover
        className="flex items-center gap-1 text-sm text-foreground-muted hover:text-cyan"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <div className="mt-8 max-w-3xl">
        <Badge tone="violet">{CATEGORY_LABEL[project.category]}</Badge>
        <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 font-mono text-xs text-foreground-faint">
          {project.status ?? project.year}
        </p>

        <ul className="mt-8 space-y-3 text-foreground-muted">
          {project.description.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        {project.links.github || project.links.demo || project.links.paper ? (
          <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6">
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-cyan"
              >
                <GitHubIcon className="h-4 w-4" /> Source
              </a>
            ) : null}
            {project.links.demo ? (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-cyan"
              >
                <ExternalLink className="h-4 w-4" /> Live demo
              </a>
            ) : null}
            {project.links.paper ? (
              <a
                href={project.links.paper}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-hover
                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-cyan"
              >
                <ExternalLink className="h-4 w-4" /> Paper
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </Container>
  );
}
