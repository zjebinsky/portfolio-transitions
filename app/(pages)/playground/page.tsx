"use client";

import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";

const PlaygroundCanvas = dynamic(
  () => import("@/components/playground/PlaygroundCanvas"),
  { ssr: false }
);

export default function PlaygroundPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-medium tracking-tight mb-12">
          Playground
        </h1>
        <p className="text-[var(--color-muted)] mb-8">
          Interactive experiments with Three.js. Drag to orbit.
        </p>
      </Container>
      <div className="w-full h-[60vh] md:h-[70vh]">
        <PlaygroundCanvas />
      </div>
    </main>
  );
}
