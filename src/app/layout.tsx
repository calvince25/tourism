import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "WildpathAfrica - Where Every Path Leads to Wonder",
  description: "Kenya's premier safari and tourism company, offering expert-guided wildlife safaris, beach holidays, and cultural experiences.",
  metadataBase: new URL("https://wildpathafrica.co.ke"),
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'WildpathAfrica',
  alternateName: 'Wildpath Africa',
  url: 'https://wildpathafrica.co.ke',
  logo: 'https://wildpathafrica.co.ke/logo.png',
  description: 'WildpathAfrica is Kenya\'s premier safari and tourism company, offering expert-guided wildlife safaris, beach holidays, mountain treks, and cultural experiences across Kenya\'s most iconic destinations.',
  telephone: '+254-700-000-000',
  email: 'info@wildpathafrica.co.ke',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  openingHours: 'Mo-Sa 08:00-19:00',
  currenciesAccepted: 'KES, USD',
  areaServed: { '@type': 'Country', name: 'Kenya' },
  sameAs: [
    'https://facebook.com/wildpathafrica',
    'https://instagram.com/wildpathafrica',
    'https://tiktok.com/@wildpathafrica',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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
