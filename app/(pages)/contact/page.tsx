import { Container } from "@/components/ui/Container";

export default function ContactPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          Contact
        </h1>
        <div className="max-w-xl">
          <p className="text-lg text-[var(--color-muted)] mb-12">
            Open to new projects and collaborations. Let&apos;s create something
            together.
          </p>
          <div className="space-y-6">
            <a
              href="mailto:hello@example.com"
              className="block text-2xl hover:opacity-70 transition-opacity"
            >
              hello@example.com
            </a>
            <div className="flex gap-8 text-[var(--color-muted)]">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
