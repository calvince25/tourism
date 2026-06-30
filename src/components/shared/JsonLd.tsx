import React from "react";
import {
  buildSchemaGraph,
  generateOrganizationSchema,
  generateTravelAgencySchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateTouristDestinationSchema,
  generateTouristTripSchema,
  generateBlogPostingSchema,
  generateContactPageSchema,
  generateFAQPageSchema,
  generateAggregateRatingSchema,
  generateReviewSchema,
} from "@/lib/schema";
import { generateBreadcrumbSchema } from "@/lib/seo";

// ─── Type Definitions ────────────────────────────────────────────
type GlobalSchemaProps = {
  type: "global";
};

type WebPageSchemaProps = {
  type: "webPage";
  data: {
    name: string;
    description: string;
    url: string;
    breadcrumb?: { name: string; item: string }[];
  };
};

type TouristDestinationSchemaProps = {
  type: "touristDestination";
  data: {
    name: string;
    description: string;
    url: string;
    image?: string;
    country?: string;
    bestSeason?: string;
  };
};

type TouristTripSchemaProps = {
  type: "touristTrip";
  data: {
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
  };
};

type BlogPostingSchemaProps = {
  type: "blogPosting";
  data: {
    title: string;
    description: string;
    url: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    authorName?: string;
    category?: string;
  };
};

type ContactPageSchemaProps = {
  type: "contactPage";
};

type FaqSchemaProps = {
  type: "faq";
  data: { faqs: { question: string; answer: string }[] };
};

type BreadcrumbSchemaProps = {
  type: "breadcrumb";
  data: { items: { name: string; item: string }[] };
};

type JsonLdProps =
  | GlobalSchemaProps
  | WebPageSchemaProps
  | TouristDestinationSchemaProps
  | TouristTripSchemaProps
  | BlogPostingSchemaProps
  | ContactPageSchemaProps
  | FaqSchemaProps
  | BreadcrumbSchemaProps;

// ─── Component ───────────────────────────────────────────────────
export default function JsonLd(props: JsonLdProps) {
  let schema: Record<string, unknown> = {};

  switch (props.type) {
    case "global":
      // Injected once in layout.tsx — builds the connected knowledge graph root
      schema = buildSchemaGraph(
        generateOrganizationSchema(),
        generateTravelAgencySchema(),
        generateWebSiteSchema()
      );
      break;

    case "webPage":
      schema = buildSchemaGraph(
        generateWebPageSchema(props.data)
      );
      break;

    case "touristDestination":
      schema = buildSchemaGraph(
        generateTouristDestinationSchema(props.data)
      );
      break;

    case "touristTrip":
      schema = buildSchemaGraph(
        generateTouristTripSchema(props.data)
      );
      break;

    case "blogPosting":
      schema = buildSchemaGraph(
        generateBlogPostingSchema(props.data)
      );
      break;

    case "contactPage":
      schema = buildSchemaGraph(
        generateContactPageSchema()
      );
      break;

    case "faq":
      schema = buildSchemaGraph(
        generateFAQPageSchema(props.data.faqs)
      );
      break;

    case "breadcrumb": {
      schema = generateBreadcrumbSchema(props.data.items);
      break;
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
