import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BlochExplainer } from "@/components/lab/bloch/BlochExplainer";

export const metadata: Metadata = {
  title: "Bloch Sphere & Qubit Gates",
  description:
    "Click through X, Y, Z, H, S, and T and watch a single qubit's state vector move on an interactive 3D Bloch sphere.",
};

export default function BlochSpherePage() {
  return (
    <Container className="py-20">
      <Badge tone="warm">Interactive · Lab</Badge>
      <h1 className="mt-4 max-w-2xl font-display text-3xl text-foreground md:text-4xl">
        Bloch Sphere &amp; Qubit Gates
      </h1>
      <p className="mt-4 max-w-2xl text-foreground-muted">
        A qubit&apos;s state is a point on a sphere. Click a gate and watch it move.
      </p>
      <div className="mt-16">
        <BlochExplainer />
      </div>
    </Container>
  );
}
