import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getAllArticles, getCompiledArticle } from "@/lib/mdx";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getAllArticles().find((a) => a.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.summary };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const exists = getAllArticles().some((a) => a.slug === slug);
  if (!exists) notFound();

  const { frontmatter, content } = await getCompiledArticle(slug);

  return (
    <Container className="py-20">
      <Link
        href="/articles"
        data-cursor-hover
        className="flex items-center gap-1 text-sm text-foreground-muted hover:text-cyan"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <article className="mt-8 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs text-foreground-faint">{frontmatter.date}</p>
          {frontmatter.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">
          {frontmatter.title}
        </h1>
        <div className="mt-8">{content}</div>
      </article>
    </Container>
  );
}
