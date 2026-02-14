import { Container } from "@/components/ui/Container";

const terms = [
  { term: "Design System", definition: "A collection of reusable components and guidelines for consistent design." },
  { term: "Motion Design", definition: "The art of applying animation principles to graphic and web design." },
  { term: "Interaction Design", definition: "Designing interactive products that respond to user behavior." },
  { term: "Typography", definition: "The art of arranging type to make language visible and legible." },
  { term: "Visual Hierarchy", definition: "The arrangement of elements to show their order of importance." },
  { term: "White Space", definition: "The empty space between and around elements that gives design breathing room." },
];

export default function GlossaryPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-16">
          Glossary
        </h1>
        <div className="max-w-3xl divide-y divide-[var(--color-border)]">
          {terms.map(({ term, definition }) => (
            <div key={term} className="py-6 first:pt-0">
              <dt className="text-xl font-medium mb-2">{term}</dt>
              <dd className="text-[var(--color-muted)]">{definition}</dd>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
