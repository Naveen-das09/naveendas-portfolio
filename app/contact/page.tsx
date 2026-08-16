import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { Mail, Download } from "lucide-react";
import { site } from "@/lib/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          description="Open to ML/software engineering roles and PhD / MS-by-Research opportunities in quantum computing, quantum machine learning, and applied AI. Reach out — I usually reply within a day or two."
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button href={`mailto:${site.email}`} external>
            <Mail className="h-4 w-4" /> {site.email}
          </Button>
          <Button href={site.github} variant="outline" external>
            <GitHubIcon className="h-4 w-4" /> GitHub
          </Button>
          <Button href={site.linkedin} variant="outline" external>
            <LinkedInIcon className="h-4 w-4" /> LinkedIn
          </Button>
          <Button href={site.resumeHref} variant="outline" external>
            <Download className="h-4 w-4" /> Download Resume
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-16 max-w-lg text-sm text-foreground-muted">
          Based in {site.location}. Email is the fastest way to reach me.
        </p>
      </Reveal>
    </Container>
  );
}
