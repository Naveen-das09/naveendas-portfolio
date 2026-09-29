import { z } from "zod";

export const CATEGORIES = ["quantum", "ml-ai", "data-science"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  quantum: "Quantum Computing",
  "ml-ai": "Applied ML / AI",
  "data-science": "Data Science & MLOps",
};

export interface ProjectLinks {
  github?: string;
  demo?: string;
  paper?: string;
  research?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  category: Category;
  status?: string;
  year?: string;
  techStack: string[];
  links: ProjectLinks;
  featured?: boolean;
  image?: { src: string; alt: string };
}

export interface Publication {
  title: string;
  venue: string;
  status: "in-progress" | "submitted" | "published";
  year?: string;
  link?: string;
}

export interface EducationEntry {
  degree: string;
  institute: string;
  score?: string;
  year: string;
}

export interface ExperienceEntry {
  role: string;
  org: string;
  location?: string;
  period: string;
  bullets: string[];
}

export interface Achievement {
  title: string;
  detail?: string;
}

export interface Certification {
  title: string;
  issuer?: string;
}

export const articleFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export interface ArticleSummary extends ArticleFrontmatter {
  slug: string;
}
