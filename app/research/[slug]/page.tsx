import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getResearchBySlug, researchEntries } from "@/lib/data/research";

export function generateStaticParams() {
  return researchEntries.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getResearchBySlug(slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.summary };
}

export default async function ResearchEntryPage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const entry = getResearchBySlug(slug);
  if (!entry) notFound();

  return (
    <Container className="py-20">
      <Link
        href="/research"
        data-cursor-hover
        className="flex items-center gap-1 text-sm text-foreground-muted hover:text-cyan"
      >
        <ArrowLeft className="h-4 w-4" /> All research
      </Link>

      <div className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="warm">{entry.tag}</Badge>
          <span className="font-mono text-xs text-foreground-faint">{entry.status}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">
          {entry.title}
        </h1>
        <p className="mt-2 text-sm text-foreground-faint">{entry.institute}</p>

        <p className="mt-8 text-lg leading-relaxed text-foreground-muted">{entry.abstract}</p>
        {entry.repository && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={entry.repository} external>View source code <ArrowRight className="h-4 w-4" /></Button>
            <Button href={`/projects/${entry.projectSlug}`} variant="outline">Project overview</Button>
          </div>
        )}

      </div>
      <div className="mt-12 grid gap-10 border-t border-border pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside>
          <nav aria-label="On this page" className="lg:sticky lg:top-28">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan">On this page</p>
            <ul className="mt-4 space-y-3">
              {entry.sections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`} className="text-sm text-foreground-muted transition-colors hover:text-cyan">{section.title}</a></li>
              ))}
              <li><a href="#resources" className="text-sm text-foreground-muted hover:text-cyan">Further reading</a></li>
            </ul>
          </nav>
        </aside>
        <div className="min-w-0 max-w-3xl">
          {entry.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mb-12 scroll-mt-28">
              <p className="font-mono text-xs text-cyan">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-relaxed text-foreground-muted">{paragraph}</p>)}
            </section>
          ))}
          <section id="resources" className="scroll-mt-28 rounded-2xl border border-border bg-surface/80 p-6 sm:p-8">
            <h2 className="font-display text-xl text-foreground">Further reading</h2>
            <p className="mt-2 text-sm text-foreground-muted">Follow the implementation, review the evidence, or explore the research context.</p>
            <ul className="mt-5 space-y-4">
              {entry.resources?.map((resource) => (
                <li key={resource.href}>
                  <Link href={resource.href} className="inline-flex items-center gap-2 text-sm text-cyan hover:text-foreground" {...(resource.href.startsWith("https://") ? { target: "_blank", rel: "noreferrer noopener" } : {})}>{resource.label}<ArrowRight className="h-4 w-4 shrink-0" /></Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Container>
  );
}
