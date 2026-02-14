import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-16">
          Digital Designer
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mb-24">
          Crafting digital experiences through design, motion, and code.
        </p>

        {/* Portfolio grid — placeholder for Cloudinary videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)]"
            >
              Project {i + 1}
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
