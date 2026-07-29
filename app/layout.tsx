import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FFIs but better: BAML Bridge",
  description: "A 25-minute talk about a type-safe Python ↔ BAML bridge built over Rust FFIs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
