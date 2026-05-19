import type { Metadata } from "next";

export interface SEOMetadataInput {
  title: string;
  description: string;
  path?: string; // e.g. "/about" or "tours/classic-safari"
  ogImage?: string;
  type?: "website" | "article";
}

/**
 * Standardizes metadata configuration across the entire site.
 * - Enforces title length (50-60 characters) and format: "[Primary Keyword] | GrowthLab Limited"
 * - Enforces description length (140-160 characters)
 * - Computes absolute canonical URLs
 * - Configures Open Graph and Twitter Card tags
 */
export function generateSEOMetadata({
  title,
  description,
  path = "",
  ogImage,
  type = "website",
}: SEOMetadataInput): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wildpathafrica.co.ke";
  
  // Standardize trailing slash and format path
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${cleanPath}`.replace(/\/$/, ""); // Strip trailing slash for consistency

  const defaultOgImage = `${siteUrl}/assets/og-image.jpg`;
  const finalOgImage = ogImage || defaultOgImage;

  // Title formatting: should be between 50 and 60 chars.
  const brandSuffix = " | GrowthLab Limited";
  let metaTitle = title.trim();

  // If the title doesn't already contain the brand, append it
  if (!metaTitle.toLowerCase().includes("growthlab")) {
    metaTitle = `${metaTitle}${brandSuffix}`;
  }

  // Ensure title is between 50-60 characters
  if (metaTitle.length < 50) {
    const filler = " - Expert Safari Tours & Holidays";
    const potentialTitle = `${title.trim()}${filler}${brandSuffix}`;
    if (potentialTitle.length >= 50 && potentialTitle.length <= 60) {
      metaTitle = potentialTitle;
    } else {
      // Pad title if it's still too short
      metaTitle = metaTitle.padEnd(50, " ");
    }
  }
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + "...";
  }

  // Description formatting: should be between 140 and 160 chars.
  let metaDesc = description.trim();
  if (metaDesc.length < 140) {
    const filler = " Experience authentic African travel with GrowthLab Limited's custom-built rental collection, automation systems, and tour platforms.";
    metaDesc = `${metaDesc}${filler}`.trim();
  }
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + "...";
  } else if (metaDesc.length < 140) {
    metaDesc = metaDesc.padEnd(140, " ");
  }

  return {
    title: metaTitle,
    description: metaDesc,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "WildpathAfrica",
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [finalOgImage],
      creator: "@GrowthLabLtd",
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wildpathafrica.co.ke";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : `${siteUrl}${item.item.startsWith("/") ? "" : "/"}${item.item}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
