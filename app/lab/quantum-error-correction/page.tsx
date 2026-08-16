import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { QECExplainer } from "@/components/lab/qec/QECExplainer";

export const metadata: Metadata = {
  title: "Quantum Error Correction — Lab",
  description:
    "An interactive, step-by-step visualization of how the surface code detects and corrects qubit errors.",
};

export default function QECLabPage() {
  return (
    <Container className="py-20">
      <Badge tone="violet">Interactive · Lab</Badge>
      <h1 className="mt-4 max-w-2xl font-display text-3xl text-foreground md:text-4xl">
        How does a quantum computer correct its own errors?
      </h1>
      <p className="mt-4 max-w-2xl text-foreground-muted">
        A simplified, step-through visualization of the surface code — built
        alongside my M.Tech thesis on why neural QEC decoders do or don&apos;t
        generalize across code distance and code family.
      </p>

      <div className="mt-16">
        <QECExplainer />
      </div>
    </Container>
  );
}
