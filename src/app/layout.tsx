import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ComplianceBanner } from "@/components/ComplianceBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Continuity Copilot — Clinical Decision Support",
  description:
    "AI-assisted clinical decision-support dashboard for Ontario Family Physicians. Ingests OntarioMD CDS XML exports and free-hand notes to surface critical diagnostic links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        <ComplianceBanner />
        <main className="pt-12">
          {children}
        </main>
      </body>
    </html>
  );
}
