import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import results from "@/public/projects/qec-lab/results.png";
import failure from "@/public/projects/qec-lab/failure-explorer.png";
import workspace from "@/public/projects/qec-lab/projects-v02.png";
import report from "@/public/projects/qec-lab/illustrated-report.png";
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

        <p className="mt-6 text-lg leading-relaxed text-foreground-muted">{project.summary}</p>
        {project.links.research && <Link href={project.links.research} className="mt-5 inline-flex items-center gap-2 text-sm text-cyan hover:text-foreground">Read methods, validation & research notes <ExternalLink className="h-4 w-4" /></Link>}
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
      {project.slug === "qec-lab" && (
        <section className="mt-14 border-t border-border pt-10" aria-label="QEC Lab workspace screenshots">
          <h2 className="font-display text-2xl text-foreground">Inside the workspace</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">Real application captures, from project planning to measured results and exportable reports. Select an image to inspect it at full size.</p>
          <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
            {[
              { image: workspace, title: "Organize the investigation", caption: "Named projects, research notes, editable drafts, and a shared local job queue." },
              { image: results, title: "Inspect measured results", caption: "A documented measurement-noise stress run: 150,000 sampled memory experiments across 15 configurations." },
              { image: failure, title: "Understand a logical failure", caption: "Detector events and syndrome time slices connect a failed shot to actual and predicted observable parity." },
              { image: report, title: "Share the evidence", caption: "Illustrated reports bring together measured plots, uncertainty, and researcher notes. Replay bundles preserve the underlying artifacts." },
            ].map((item) => (
              <figure key={item.title} className="overflow-hidden rounded-xl border border-border bg-surface/80">
                <a href={item.image.src} target="_blank" rel="noreferrer" aria-label={`Open full-size screenshot: ${item.title}`}><Image src={item.image} alt={item.title + ". " + item.caption} sizes="(max-width: 768px) 90vw, 540px" className="h-auto w-full" /></a>
                <figcaption className="p-5"><h3 className="font-display text-lg text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-foreground-muted">{item.caption}</p></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
