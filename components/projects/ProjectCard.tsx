import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { CATEGORY_LABEL } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CATEGORY_TONE = {
  quantum: "violet",
  "ml-ai": "cyan",
  "data-science": "warm",
} as const;

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} data-cursor-hover>
      <Card className="h-full hover:-translate-y-1 hover:shadow-[0_0_40px_-20px_var(--accent-cyan)]">
        <div className="flex items-start justify-between gap-3">
          <Badge tone={CATEGORY_TONE[project.category]}>
            {CATEGORY_LABEL[project.category]}
          </Badge>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-faint transition-colors group-hover:text-cyan" />
        </div>
        <h3 className="mt-4 font-display text-lg text-foreground">{project.title}</h3>
        <p className="mt-2 text-sm text-foreground-muted">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-surface-raised px-2 py-1 font-mono text-[11px] text-foreground-muted"
            >
              {tech}
            </span>
          ))}
        </div>
        {project.status || project.year ? (
          <p className="mt-4 font-mono text-xs text-foreground-faint">
            {project.status ?? project.year}
          </p>
        ) : null}
      </Card>
    </Link>
  );
}
