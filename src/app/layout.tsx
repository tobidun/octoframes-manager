import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#0c0c0f] text-[#e4e4e7] min-h-screen`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
