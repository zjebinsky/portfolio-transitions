export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-auto px-6 md:px-12 lg:px-16"
      style={{ maxWidth: "var(--size-container)" }}
    >
      {children}
    </div>
  );
}
