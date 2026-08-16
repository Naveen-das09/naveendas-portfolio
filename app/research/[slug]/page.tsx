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

        <p className="mt-8 text-foreground-muted">{entry.abstract}</p>

        <Button href="/lab/quantum-error-correction" variant="outline" className="mt-10">
          See it visualized in the Lab <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Container>
  );
}
