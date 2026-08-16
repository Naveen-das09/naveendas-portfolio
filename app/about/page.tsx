import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProfilePhoto } from "@/components/about/ProfilePhoto";
import {
  achievements,
  certifications,
  education,
  experience,
  skillGroups,
  summary,
} from "@/lib/data/experience";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="py-20">
      <Reveal>
        <div className="flex flex-col-reverse items-start gap-8 md:flex-row md:items-center">
          <SectionHeading eyebrow="About" title="Naveen S Das" description={summary} />
          <ProfilePhoto />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-16">
          <h2 className="font-display text-xl text-foreground">Education</h2>
          <div className="mt-6 space-y-6 border-l border-border pl-6">
            {education.map((entry) => (
              <div key={entry.degree} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan" />
                <p className="font-mono text-xs text-foreground-faint">{entry.year}</p>
                <p className="mt-1 text-foreground">{entry.degree}</p>
                <p className="text-sm text-foreground-muted">
                  {entry.institute}
                  {entry.score ? ` · ${entry.score}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16">
          <h2 className="font-display text-xl text-foreground">Experience</h2>
          <div className="mt-6 space-y-8">
            {experience.map((job) => (
              <Card key={job.org}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg text-foreground">
                    {job.role} · {job.org}
                  </h3>
                  <p className="font-mono text-xs text-foreground-faint">{job.period}</p>
                </div>
                {job.location ? (
                  <p className="text-sm text-foreground-muted">{job.location}</p>
                ) : null}
                <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="text-cyan">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-16">
          <h2 className="font-display text-xl text-foreground">Skills</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <p className="font-mono text-xs uppercase tracking-wide text-foreground-faint">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-foreground">Achievements</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
              {achievements.map((a) => (
                <li key={a.title}>
                  <span className="text-foreground">{a.title}</span>
                  {a.detail ? ` — ${a.detail}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl text-foreground">Certifications</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
              {certifications.map((c) => (
                <li key={c.title}>
                  <span className="text-foreground">{c.title}</span>
                  {c.issuer ? ` — ${c.issuer}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
