"use client";

import { usePathname } from "next/navigation";
import { LatticeBackground } from "@/components/layout/LatticeBackground";
import { EntanglementField } from "@/components/home/EntanglementField";

/**
 * Route-aware background chrome.
 *
 * The lattice is a CSS animation and runs everywhere, dimmed on lab pages so it
 * doesn't compete with their own canvases. The entanglement field gates itself
 * to the homepage (see EntanglementField) — it's mounted unconditionally here
 * and left to make that call, so the rule lives in exactly one place.
 */
export function BackgroundLayer() {
  const pathname = usePathname();
  const isLab = pathname.startsWith("/lab");

  return (
    <>
      <LatticeBackground dimmed={isLab} />
      <EntanglementField />
    </>
  );
}
