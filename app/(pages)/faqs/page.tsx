import { Container } from "@/components/ui/Container";

const faqs = [
  {
    question: "What services do you offer?",
    answer: "UI/UX design, motion design, creative development, and brand identity.",
  },
  {
    question: "What is your design process?",
    answer: "Discovery, research, ideation, prototyping, testing, and refinement.",
  },
  {
    question: "Do you take freelance projects?",
    answer: "Yes — feel free to reach out via the contact page to discuss your project.",
  },
  {
    question: "What tools do you use?",
    answer: "Figma, After Effects, Blender, and modern web technologies like React and Three.js.",
  },
];

export default function FAQsPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-medium tracking-tight mb-16">
          FAQs
        </h1>
        <div className="max-w-3xl divide-y divide-[var(--color-border)]">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="py-6 first:pt-0">
              <h2 className="text-[1.286rem] font-medium mb-2">{question}</h2>
              <p className="text-[var(--color-muted)]">{answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
