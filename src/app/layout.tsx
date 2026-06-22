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
  title: "ClinWeave — Clinical Decision Support",
  description:
    "Clinical decision-support for Ontario family physicians that connects longitudinal EMR history with today's encounter notes to surface relevant patterns, risks, and clinical context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen bg-[#f8fbf9] text-[#243a32]`}
      >
        <ComplianceBanner />
        <main className="pt-12">
          {children}
        </main>
      </body>
    </html>
  );
}
