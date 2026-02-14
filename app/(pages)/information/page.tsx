import { Container } from "@/components/ui/Container";

export default function InformationPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          Information
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">
              About
            </h2>
            <p className="text-lg leading-relaxed">
              A digital designer focused on creating meaningful experiences
              through thoughtful design and creative technology.
            </p>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-[var(--color-muted)] mb-4">
              Expertise
            </h2>
            <ul className="space-y-2 text-lg">
              <li>UI/UX Design</li>
              <li>Motion Design</li>
              <li>Creative Development</li>
              <li>Brand Identity</li>
            </ul>
          </div>
        </div>
      </Container>
    </main>
  );
}
