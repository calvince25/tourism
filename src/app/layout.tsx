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
        <JsonLd type="organization" />
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
