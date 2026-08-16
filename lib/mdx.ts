import fs from "node:fs";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import { articleFrontmatterSchema, type ArticleSummary } from "@/types";
import { mdxComponents } from "@/components/articles/MDXComponents";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function readArticleFile(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf8");
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllArticles(): ArticleSummary[] {
  const articles = getArticleSlugs().map((slug) => {
    const raw = readArticleFile(slug);
    const { data } = matter(raw);
    const frontmatter = articleFrontmatterSchema.parse(data);
    return { slug, ...frontmatter };
  });

  return articles
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getCompiledArticle(slug: string) {
  const raw = readArticleFile(slug);
  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source: raw,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    },
  });
  const validated = articleFrontmatterSchema.parse(frontmatter);
  return { slug, frontmatter: validated, content };
}
