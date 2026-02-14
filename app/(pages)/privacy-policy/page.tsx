import { Container } from "@/components/ui/Container";

export default function PrivacyPolicyPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          Privacy Policy
        </h1>
        <div className="prose prose-invert max-w-3xl space-y-6 text-[var(--color-muted)]">
          <p>
            This privacy policy describes how your personal information is
            collected, used, and shared when you visit this website.
          </p>
          <h2 className="text-white text-xl font-medium">Information We Collect</h2>
          <p>
            We automatically collect certain information about your device,
            including your browser type, IP address, time zone, and some of the
            cookies installed on your device.
          </p>
          <h2 className="text-white text-xl font-medium">How We Use Your Information</h2>
          <p>
            We use the information collected to improve and optimize our site and
            to understand visitor usage patterns.
          </p>
          <h2 className="text-white text-xl font-medium">Contact</h2>
          <p>
            For more information about our privacy practices, please contact us
            via the contact page.
          </p>
        </div>
      </Container>
    </main>
  );
}
