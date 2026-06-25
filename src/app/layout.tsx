import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.scss";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-figtree",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-inter",
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
      <body className={`${figtree.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
