import React from "react";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo";

type OrganizationProps = {
  name?: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
};

type LocalBusinessProps = {
  name: string;
  description: string;
  url: string;
  image?: string;
  addressLocality: string;
  addressRegion?: string;
  addressCountry: string;
  telephone?: string;
  priceRange?: string;
};

type ServiceProps = {
  name: string;
  description: string;
  providerName?: string;
  providerUrl?: string;
  serviceType?: string;
  areaServed?: string;
};

type FaqProps = {
  faqs: { question: string; answer: string }[];
};

type BreadcrumbProps = {
  items: { name: string; item: string }[];
};

type JsonLdProps =
  | { type: "organization"; data?: OrganizationProps }
  | { type: "localBusiness"; data: LocalBusinessProps }
  | { type: "service"; data: ServiceProps }
  | { type: "faq"; data: FaqProps }
  | { type: "breadcrumb"; data: BreadcrumbProps };

export default function JsonLd(props: JsonLdProps) {
  let schema: Record<string, any> = {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wildpathafrica.co.ke";

  if (props.type === "organization") {
    // Fulfill requirement: "Add Organization schema globally across the website using GrowthLab Limited’s business information"
    schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: props.data?.name || "GrowthLab Limited",
      url: props.data?.url || "https://www.growthlab.co.ke",
      logo: props.data?.logo || "https://www.growthlab.co.ke/logo.png",
      description: "GrowthLab Limited is a premium digital agency specializing in secure software engineering, automation systems, property management platforms, and web design solutions.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressRegion: "Nairobi County",
        addressCountry: "KE",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: props.data?.contactPoint?.telephone || "+254-704-059-438",
        contactType: props.data?.contactPoint?.contactType || "customer service",
      },
      sameAs: [
        "https://www.growthlab.co.ke",
        "https://facebook.com/growthlabltd",
        "https://instagram.com/growthlabltd",
      ],
    };
  } else if (props.type === "localBusiness") {
    const { data } = props;
    schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: data.name,
      description: data.description,
      url: data.url,
      image: data.image || `${siteUrl}/assets/og-image.jpg`,
      telephone: data.telephone || "+254-704-059-438",
      priceRange: data.priceRange || "$$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: data.addressLocality,
        addressRegion: data.addressRegion || "Nairobi County",
        addressCountry: data.addressCountry,
      },
    };
  } else if (props.type === "service") {
    const { data } = props;
    schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: data.name,
      description: data.description,
      provider: {
        "@type": "LocalBusiness",
        name: data.providerName || "GrowthLab Limited",
        url: data.providerUrl || "https://www.growthlab.co.ke",
      },
      serviceType: data.serviceType || "Business Optimization Services",
      areaServed: {
        "@type": "Country",
        name: data.areaServed || "Kenya",
      },
    };
  } else if (props.type === "faq") {
    schema = generateFAQSchema(props.data.faqs);
  } else if (props.type === "breadcrumb") {
    schema = generateBreadcrumbSchema(props.data.items);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
