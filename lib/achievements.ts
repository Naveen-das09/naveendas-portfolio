export type AchievementId =
  | "explorer"
  | "researcher"
  | "lab-regular"
  | "bookworm"
  | "full-circuit"
  | "secret-signal";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  hint: string;
  tone: "cyan" | "violet" | "warm";
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "explorer",
    title: "Explorer",
    description: "Viewed every project in the portfolio.",
    hint: "Browse through all the projects.",
    tone: "cyan",
  },
  {
    id: "researcher",
    title: "Researcher",
    description: "Read the featured research thesis.",
    hint: "Check out the research page.",
    tone: "violet",
  },
  {
    id: "lab-regular",
    title: "Lab Regular",
    description: "Tried both interactive quantum lab demos.",
    hint: "Visit the Lab and open both explainers.",
    tone: "warm",
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Opened every article.",
    hint: "Read through the articles.",
    tone: "cyan",
  },
  {
    id: "full-circuit",
    title: "Full Circuit",
    description: "Visited every section of the site.",
    hint: "Explore About, Projects, Research, Lab, Articles, and Contact.",
    tone: "violet",
  },
  {
    id: "secret-signal",
    title: "Secret Signal",
    description: "Found a hidden signal.",
    hint: "Some signals aren't on any map.",
    tone: "warm",
  },
];

const NAV_SECTIONS = ["/about", "/projects", "/research", "/lab", "/articles", "/contact"];

export interface AchievementInputs {
  visited: Set<string>;
  projectSlugs: string[];
  researchSlugs: string[];
  articleSlugs: string[];
  secretFound: boolean;
}

export function computeUnlocked({
  visited,
  projectSlugs,
  researchSlugs,
  articleSlugs,
  secretFound,
}: AchievementInputs): Set<AchievementId> {
  const unlocked = new Set<AchievementId>();

  if (projectSlugs.length > 0 && projectSlugs.every((s) => visited.has(`/projects/${s}`))) {
    unlocked.add("explorer");
  }
  if (researchSlugs.length > 0 && researchSlugs.every((s) => visited.has(`/research/${s}`))) {
    unlocked.add("researcher");
  }
  if (
    visited.has("/lab/quantum-error-correction") &&
    visited.has("/lab/quantum-neural-network")
  ) {
    unlocked.add("lab-regular");
  }
  if (articleSlugs.length > 0 && articleSlugs.every((s) => visited.has(`/articles/${s}`))) {
    unlocked.add("bookworm");
  }
  if (NAV_SECTIONS.every((section) => visited.has(section))) {
    unlocked.add("full-circuit");
  }
  if (secretFound) {
    unlocked.add("secret-signal");
  }

  return unlocked;
}
