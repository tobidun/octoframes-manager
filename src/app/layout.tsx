import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Octoframes Studio Manager",
  description: "Professional studio management system by Octoframes",
};

import { Navbar } from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${quicksand.variable} ${quicksand.className} bg-[#0c0c0f] text-[#e4e4e7] min-h-screen font-sans`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
