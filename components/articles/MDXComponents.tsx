import type { MDXComponents } from "mdx/types";
import {
  CodeDistanceFigure,
  CodeFamilyFigure,
  EEGWaveFigure,
  PullQuote,
} from "@/components/articles/Diagrams";

export const mdxComponents: MDXComponents = {
  CodeDistanceFigure,
  CodeFamilyFigure,
  EEGWaveFigure,
  PullQuote,
  h1: (props) => (
    <h1 className="mt-10 font-display text-3xl text-foreground" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-10 font-display text-2xl text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 font-display text-xl text-foreground" {...props} />
  ),
  p: (props) => <p className="mt-4 leading-relaxed text-foreground-muted" {...props} />,
  a: (props) => (
    <a className="text-cyan underline underline-offset-4 hover:text-violet" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-foreground-muted" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-cyan pl-4 italic text-foreground-muted"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-sm text-cyan"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-foreground"
      {...props}
    />
  ),
};
