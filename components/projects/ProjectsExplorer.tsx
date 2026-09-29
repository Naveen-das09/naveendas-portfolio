"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Project } from "@/types";
import { CATEGORIES, CATEGORY_LABEL } from "@/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function ProjectsExplorer({
  projects,
  initialCategory,
}: {
  projects: Project[];
  initialCategory?: Category;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | "all">(initialCategory ?? "all");

  const filtered = useMemo(
    () => (category === "all" ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  );

  function select(next: Category | "all") {
    setCategory(next);
    const query = next === "all" ? "" : `?category=${next}`;
    router.replace(`/projects${query}`, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        <FilterPill active={category === "all"} onClick={() => select("all")}>
          All
        </FilterPill>
        {CATEGORIES.map((c) => (
          <FilterPill key={c} active={category === c} onClick={() => select(c)}>
            {CATEGORY_LABEL[c]}
          </FilterPill>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.06, 0.3)}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      data-cursor-hover
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors",
        active
          ? "border-cyan text-cyan"
          : "border-border-strong text-foreground-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
