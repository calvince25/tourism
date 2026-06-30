import { SITE_URL, SITE_NAME } from "./seo";

/**
 * Connected Schema.org Knowledge Graph for WildpathAfrica.
 *
 * All schemas use @id references to build one connected graph
 * that search engines and AI systems can fully traverse.
 */

// ─── @id Constants ───────────────────────────────────────────────
export const IDS = {
  organization: `${SITE_URL}/#organization`,
  travelAgency: `${SITE_URL}/#travelAgency`,
  website: `${SITE_URL}/#website`,
  searchAction: `${SITE_URL}/#searchAction`,
  localBusiness: `${SITE_URL}/#localBusiness`,
} as const;

// ─── Helper ──────────────────────────────────────────────────────
function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

// ─── Organization ────────────────────────────────────────────────
export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": IDS.organization,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/assets/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      "WildpathAfrica is Kenya's premier boutique safari company offering bespoke wildlife safaris, beach holidays, and cultural experiences across Kenya.",
    foundingDate: "2016",
    founder: {
      "@type": "Person",
      name: "Cynthia",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254-704-059-438",
      contactType: "customer service",
      availableLanguage: ["English", "Swahili"],
    },
    sameAs: [
      "https://www.instagram.com/wildpathafrica",
      "https://www.facebook.com/share/1CRFai4pXV/",
      "https://www.tiktok.com/@wildpathafrica",
    ],
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
  };
}

// ─── Travel Agency ───────────────────────────────────────────────
export function generateTravelAgencySchema() {
  return {
    "@type": "TravelAgency",
    "@id": IDS.travelAgency,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Boutique travel agency specializing in bespoke Kenya safari tours, wildlife experiences, beach holidays, and cultural journeys.",
    image: `${SITE_URL}/assets/og-image.jpg`,
    telephone: "+254-704-059-438",
    email: "info@wildpathafrica.co.ke",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2921,
      longitude: 36.8219,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    parentOrganization: { "@id": IDS.organization },
  };
}

// ─── WebSite + SearchAction ──────────────────────────────────────
export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": IDS.website,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Plan your dream Kenya safari with WildpathAfrica. Expert-guided wildlife tours, beach holidays, and cultural experiences.",
    publisher: { "@id": IDS.organization },
    potentialAction: {
      "@type": "SearchAction",
      "@id": IDS.searchAction,
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tours?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

// ─── WebPage ─────────────────────────────────────────────────────
export function generateWebPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  breadcrumb?: { name: string; item: string }[];
}) {
  const schema: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${absoluteUrl(opts.url)}/#webpage`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    isPartOf: { "@id": IDS.website },
    about: { "@id": IDS.organization },
    inLanguage: "en-US",
  };

  if (opts.breadcrumb && opts.breadcrumb.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: opts.breadcrumb.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.item),
      })),
    };
  }

  return schema;
}

// ─── TouristDestination ──────────────────────────────────────────
export function generateTouristDestinationSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  country?: string;
  bestSeason?: string;
  latitude?: number;
  longitude?: number;
}) {
  const schema: Record<string, unknown> = {
    "@type": "TouristDestination",
    "@id": `${absoluteUrl(opts.url)}/#destination`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    touristType: ["Wildlife Safari", "Beach Holiday", "Cultural Experience"],
    isPartOf: { "@id": IDS.website },
  };

  if (opts.image) {
    schema.image = {
      "@type": "ImageObject",
      url: absoluteUrl(opts.image),
    };
  }

  if (opts.country) {
    schema.containedInPlace = {
      "@type": "Country",
      name: opts.country,
    };
  }

  if (opts.latitude && opts.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: opts.latitude,
      longitude: opts.longitude,
    };
  }

  return schema;
}

// ─── TouristTrip ─────────────────────────────────────────────────
export function generateTouristTripSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  priceUsd?: number;
  priceKes?: number;
  durationDays: number;
  destinations?: string[];
  difficulty?: string;
  highlights?: string[];
}) {
  const schema: Record<string, unknown> = {
    "@type": "TouristTrip",
    "@id": `${absoluteUrl(opts.url)}/#trip`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    touristType: "Wildlife Safari",
    provider: { "@id": IDS.travelAgency },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: opts.durationDays,
      description: `${opts.durationDays}-day guided safari tour`,
    },
  };

  if (opts.image) {
    schema.image = {
      "@type": "ImageObject",
      url: absoluteUrl(opts.image),
    };
  }

  if (opts.priceUsd) {
    schema.offers = {
      "@type": "Offer",
      price: opts.priceUsd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@id": IDS.travelAgency },
      url: absoluteUrl(opts.url),
    };
  }

  if (opts.destinations && opts.destinations.length > 0) {
    schema.subTrip = opts.destinations.map((dest) => ({
      "@type": "TouristTrip",
      name: dest,
    }));
  }

  return schema;
}

// ─── BlogPosting ─────────────────────────────────────────────────
export function generateBlogPostingSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  category?: string;
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(opts.url)}/#article`,
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.url),
    mainEntityOfPage: absoluteUrl(opts.url),
    isPartOf: { "@id": IDS.website },
    publisher: { "@id": IDS.organization },
    author: {
      "@type": "Person",
      name: opts.authorName || "WildpathAfrica Editorial Team",
    },
    image: opts.image
      ? { "@type": "ImageObject", url: absoluteUrl(opts.image) }
      : undefined,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    articleSection: opts.category || "Safari Guide",
    inLanguage: "en-US",
  };
}

// ─── ContactPage ─────────────────────────────────────────────────
export function generateContactPageSchema() {
  return {
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact/#contactpage`,
    name: "Contact WildpathAfrica",
    description:
      "Get in touch with WildpathAfrica for custom safari itineraries, booking inquiries, and travel advice for Kenya.",
    url: `${SITE_URL}/contact`,
    mainEntity: { "@id": IDS.travelAgency },
    isPartOf: { "@id": IDS.website },
  };
}

// ─── FAQPage ─────────────────────────────────────────────────────
export function generateFAQPageSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
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

// ─── AggregateRating ─────────────────────────────────────────────
export function generateAggregateRatingSchema(opts: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}) {
  return {
    "@type": "AggregateRating",
    ratingValue: opts.ratingValue,
    reviewCount: opts.reviewCount,
    bestRating: opts.bestRating || 5,
    worstRating: 1,
  };
}

// ─── Review ──────────────────────────────────────────────────────
export function generateReviewSchema(opts: {
  authorName: string;
  ratingValue: number;
  reviewBody: string;
  datePublished?: string;
}) {
  return {
    "@type": "Review",
    author: { "@type": "Person", name: opts.authorName },
    reviewRating: {
      "@type": "Rating",
      ratingValue: opts.ratingValue,
      bestRating: 5,
    },
    reviewBody: opts.reviewBody,
    ...(opts.datePublished && { datePublished: opts.datePublished }),
  };
}

// ─── Graph Builder ───────────────────────────────────────────────
/**
 * Combines multiple schema objects into a single @graph array.
 * This creates the connected knowledge graph that Google and AI
 * search engines use to understand the site.
 */
export function buildSchemaGraph(
  ...schemas: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.filter(Boolean),
  };
}
