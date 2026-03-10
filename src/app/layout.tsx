import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabRecord AI – Generate Lab Record Books in Minutes",
  description: "AI-powered tool for generating lab reports and analyzing experiment data. Automates engineering and science lab record books.",
  keywords: "lab record generator, engineering lab record, lab report generator, labrecord ai",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "LabRecord AI",
    description: "Generate lab record books automatically",
    url: "https://labrecord.cloud",
    siteName: "LabRecord AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LabRecord AI",
    description: "Generate lab record books instantly",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LabRecord AI",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "url": "https://labrecord.cloud",
              "description": "AI tool for generating engineering lab record books."
            }),
          }}
        />
      </body>
    </html>
  );
}
