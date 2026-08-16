import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { QNNExplainer } from "@/components/lab/qnn/QNNExplainer";

export const metadata: Metadata = {
  title: "Quantum Neural Networks — Lab",
  description:
    "A real, browser-run 2-qubit variational quantum circuit — watch it learn an XOR-shaped decision boundary using the parameter-shift rule.",
};

export default function QNNLabPage() {
  return (
    <Container className="py-20">
      <Badge tone="cyan">Interactive · Lab</Badge>
      <h1 className="mt-4 max-w-2xl font-display text-3xl text-foreground md:text-4xl">
        Watch a two-qubit circuit learn to classify data
      </h1>
      <p className="mt-4 max-w-2xl text-foreground-muted">
        A genuine variational quantum circuit — statevector-simulated in your
        browser, trained live with the parameter-shift rule — the same
        family of model behind my Hybrid Quantum-Classical Neural Network
        project.
      </p>

      <div className="mt-16">
        <QNNExplainer />
      </div>
    </Container>
  );
}
