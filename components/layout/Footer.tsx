import Link from "next/link";
import { site, navLinks } from "@/lib/data/site";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { Container } from "@/components/ui/Container";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg text-foreground">{site.name}</p>
          <p className="mt-2 text-sm text-foreground-muted">{site.tagline}</p>
          <div className="mt-5 flex items-center gap-4">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              data-cursor-hover
              className="text-foreground-muted transition-colors hover:text-cyan"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              data-cursor-hover
              className="text-foreground-muted transition-colors hover:text-cyan"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              data-cursor-hover
              className="text-foreground-muted transition-colors hover:text-cyan"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className="mt-10 border-t border-border pt-6">
        <p className="font-mono text-xs text-foreground-faint">
          Built with Next.js. © {new Date().getFullYear()} {site.name}.
        </p>
      </Container>
    </footer>
  );
}
