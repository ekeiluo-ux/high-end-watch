import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.scss";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Men's Luxury Watches",
  description: "High-fidelity luxury watch collection homepage inspired by Wrist Aficionado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.variable}>{children}</body>
    </html>
  );
}
