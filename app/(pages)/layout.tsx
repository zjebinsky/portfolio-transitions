"use client";

import { TransitionProvider } from "@/components/transition/transition-context";
import { TransitionLayout } from "@/components/transition/TransitionLayout";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { Agentation } from "agentation";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionProvider>
      <TransitionLayout>{children}</TransitionLayout>
      <DialRoot position="top-left" />
      <Agentation />
    </TransitionProvider>
  );
}
