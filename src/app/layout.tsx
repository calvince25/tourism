import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Toaster } from "react-hot-toast";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = generateSEOMetadata({
  title: "WildpathAfrica - Where Every Path Leads to Wonder",
  description: "Kenya's premier safari and tourism company, offering expert-guided wildlife safaris, beach holidays, and cultural experiences.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd type="global" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased bg-navy text-white`}>
        <Toaster position="top-right" />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
