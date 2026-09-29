import type { MetadataRoute } from "next";
import { researchEntries } from "@/lib/data/research";
import { projects } from "@/lib/data/projects";
import { getAllArticles } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naveendas.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/research",
    "/lab",
    "/lab/quantum-error-correction",
    "/articles",
    "/contact",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  const articleRoutes = getAllArticles().map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.date,
  }));

  return [...staticRoutes, ...projectRoutes, ...researchEntries.map((entry) => ({ url: `${base}/research/${entry.slug}` })), ...articleRoutes];
}
