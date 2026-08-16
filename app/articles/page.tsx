import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllArticles } from "@/lib/mdx";

export const metadata: Metadata = { title: "Articles" };

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <Container className="py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Writing"
          title="Articles"
          description="Notes on quantum computing, machine learning, and the research questions I'm chasing."
        />
      </Reveal>

      <div className="mt-12 space-y-6">
        {articles.map((article, i) => (
          <Reveal key={article.slug} delay={i * 0.06}>
            <Link href={`/articles/${article.slug}`} data-cursor-hover>
              <Card className="hover:-translate-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs text-foreground-faint">{article.date}</p>
                  {article.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <h3 className="mt-3 font-display text-xl text-foreground">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted">{article.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan">
                  Read <ArrowUpRight className="h-4 w-4" />
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
