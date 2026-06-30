import type { Metadata } from "next";

/**
 * Canonical production URL — hardcoded to prevent env-var leaks
 * from Vercel previews or local development.
 */
export const SITE_URL = "https://www.wildpathafrica.co.ke";
export const SITE_NAME = "WildpathAfrica";
export const TWITTER_HANDLE = "@wildpathafrica";

export interface SEOMetadataInput {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Generates consistent, complete metadata for any page.
 * - Absolute canonical URLs with www
 * - Open Graph + Twitter Card tags
 * - Proper brand suffix
 * - No GrowthLab references
 */
export function generateSEOMetadata({
  title,
  description,
  path = "",
  ogImage,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: SEOMetadataInput): Metadata {
  // Build absolute canonical URL — no double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath}`.replace(/\/$/, "");

  // Default OG image
  const defaultOgImage = `${SITE_URL}/assets/og-image.jpg`;
  const finalOgImage = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
    : defaultOgImage;

  // Brand suffix
  const brandSuffix = ` | ${SITE_NAME}`;
  let metaTitle = title.trim();

  // Append brand if not already present
  if (!metaTitle.toLowerCase().includes("wildpathafrica") && !metaTitle.toLowerCase().includes("wildpath")) {
    metaTitle = `${metaTitle}${brandSuffix}`;
  }

  // Cap title at 60 characters for SEO
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + "...";
  }

  // Clean description — cap at 160 characters
  let metaDesc = description.trim();
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + "...";
  }

  // If description is too short, extend with relevant brand text
  if (metaDesc.length < 120) {
    const filler = " Discover Kenya's finest safari tours, wildlife experiences, and beach holidays with WildpathAfrica.";
    metaDesc = `${metaDesc}${filler}`.trim();
    if (metaDesc.length > 160) {
      metaDesc = metaDesc.substring(0, 157) + "...";
    }
  }

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDesc,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: title.trim(),
        },
      ],
      locale: "en_US",
      type: type === "article" ? "article" : "website",
      ...(type === "article" && publishedTime && { publishedTime }),
      ...(type === "article" && modifiedTime && { modifiedTime }),
      ...(type === "article" && authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [finalOgImage],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };

  return metadata;
}

/**
 * Generate BreadcrumbList schema.org structured data.
 */
export function generateBreadcrumbSchema(
  items: { name: string; item: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http")
        ? item.item
        : `${SITE_URL}${item.item.startsWith("/") ? "" : "/"}${item.item}`,
    })),
  };
}

/**
 * Generate FAQPage schema.org structured data.
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
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
