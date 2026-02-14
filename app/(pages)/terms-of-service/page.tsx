import { Container } from "@/components/ui/Container";

export default function TermsOfServicePage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-medium tracking-tight mb-12">
          Terms of Service
        </h1>
        <div className="prose prose-invert max-w-3xl space-y-6 text-[var(--color-muted)]">
          <p>
            By accessing and using this website, you accept and agree to be
            bound by the terms and provisions of this agreement.
          </p>
          <h2 className="text-white text-[1.286rem] font-medium">Use of Content</h2>
          <p>
            All content on this website, including text, graphics, logos, and
            images, is the property of the site owner and is protected by
            copyright laws.
          </p>
          <h2 className="text-white text-[1.286rem] font-medium">Limitations</h2>
          <p>
            The site owner shall not be held liable for any damages arising from
            the use of this website.
          </p>
        </div>
      </Container>
    </main>
  );
}
