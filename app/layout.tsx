import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueMontreal = localFont({
  src: "./fonts/PPNeueMontreal-Medium.ttf",
  variable: "--font-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Digital designer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={neueMontreal.variable}>
      <body className={neueMontreal.className}>{children}</body>
    </html>
  );
}
