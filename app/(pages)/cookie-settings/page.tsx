import { Container } from "@/components/ui/Container";

export default function CookieSettingsPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-medium tracking-tight mb-12">
          Cookie Settings
        </h1>
        <div className="max-w-3xl space-y-6 text-[var(--color-muted)]">
          <p>
            This website uses cookies to ensure you get the best experience.
            You can manage your preferences below.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-white font-medium">Essential Cookies</h2>
                <p className="text-sm">Required for the website to function.</p>
              </div>
              <span className="text-sm text-[var(--color-muted)]">Always on</span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-white font-medium">Analytics Cookies</h2>
                <p className="text-sm">Help us understand how visitors use the site.</p>
              </div>
              <button className="px-4 py-1.5 rounded-full text-sm border border-[var(--color-border)] hover:border-white transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
