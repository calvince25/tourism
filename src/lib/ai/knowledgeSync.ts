/**
 * Knowledge sync pipeline.
 * Converts Prisma records → rich text → embeddings → vector store.
 * Called automatically when admin creates/updates/deletes content.
 */

import { prisma } from "@/lib/prisma";
import { upsertChunk, deleteChunks } from "./vectorStore";

export { deleteChunks };

// ─── Tours ────────────────────────────────────────────────────────────────────

export async function syncTour(tourId: string): Promise<void> {
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: {
      itinerary: { orderBy: { dayNumber: "asc" } },
      destinations: { include: { destination: { select: { name: true } } } },
      faqs: { orderBy: { sortOrder: "asc" } },
      coverImage: { select: { fileUrl: true, altText: true } },
    },
  });

  if (!tour || tour.status !== "PUBLISHED") {
    // Remove from knowledge base if unpublished or deleted
    await deleteChunks("tour", tourId);
    return;
  }

  const priceText =
    tour.priceKes
      ? `from KES ${tour.priceKes.toLocaleString()} / USD ${tour.priceUsd?.toLocaleString() ?? "contact us"}`
      : "contact us for pricing";

  const destinations = tour.destinations
    .map((d) => d.destination.name)
    .join(", ");

  const highlights = Array.isArray(tour.highlights)
    ? (tour.highlights as string[]).join(", ")
    : "";

  const itineraryText = tour.itinerary
    .map(
      (d) =>
        `Day ${d.dayNumber}: ${d.title}${d.location ? ` at ${d.location}` : ""}${d.description ? ` — ${d.description.slice(0, 200)}` : ""}`
    )
    .join("\n");

  const faqText = tour.faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const content = [
    `TOUR: ${tour.name}`,
    `Duration: ${tour.durationDays} days${tour.durationNights ? `, ${tour.durationNights} nights` : ""}`,
    `Price: ${priceText}`,
    `Destinations: ${destinations}`,
    `Group size: ${tour.groupSizeMin}–${tour.groupSizeMax} people`,
    `Difficulty: ${tour.difficulty}`,
    tour.travelStyle ? `Travel style: ${tour.travelStyle}` : "",
    tour.shortDescription ? `\nOverview: ${tour.shortDescription}` : "",
    highlights ? `\nHighlights: ${highlights}` : "",
    itineraryText ? `\nItinerary:\n${itineraryText}` : "",
    faqText ? `\nFAQs:\n${faqText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await upsertChunk({
    id: `tour-${tourId}`,
    content,
    source_type: "tour",
    source_id: tourId,
    metadata: {
      type: "tour",
      id: tour.id,
      name: tour.name,
      slug: tour.slug,
      durationDays: tour.durationDays,
      priceKes: tour.priceKes,
      priceUsd: tour.priceUsd,
      destinations,
      coverImageUrl: tour.coverImage?.fileUrl ?? null,
      travelStyle: tour.travelStyle,
    },
  });
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function syncDestination(destinationId: string): Promise<void> {
  const dest = await prisma.destination.findUnique({
    where: { id: destinationId },
    include: {
      country: { select: { name: true, slug: true } },
      attractions: { select: { name: true, attractionType: true } },
      faqs: { orderBy: { sortOrder: "asc" } },
      heroImage: { select: { fileUrl: true } },
    },
  });

  if (!dest || dest.status !== "PUBLISHED") {
    await deleteChunks("destination", destinationId);
    return;
  }

  const attractions = dest.attractions
    .map((a) => `${a.name}${a.attractionType ? ` (${a.attractionType})` : ""}`)
    .join(", ");

  const faqText = dest.faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const content = [
    `DESTINATION: ${dest.name}, ${dest.country.name}`,
    dest.shortTeaser ? `Summary: ${dest.shortTeaser}` : "",
    dest.bestSeason ? `Best time to visit: ${dest.bestSeason}` : "",
    dest.language ? `Language: ${dest.language}` : "",
    dest.currency ? `Currency: ${dest.currency}` : "",
    dest.visaRequired !== null
      ? `Visa required: ${dest.visaRequired ? "Yes" : "No"}${dest.visaNotes ? ` — ${dest.visaNotes}` : ""}`
      : "",
    attractions ? `Attractions: ${attractions}` : "",
    dest.contentIntro
      ? `\nAbout: ${dest.contentIntro.replace(/<[^>]*>/g, " ").slice(0, 600)}`
      : "",
    dest.contentWhyVisit
      ? `\nWhy visit: ${dest.contentWhyVisit.replace(/<[^>]*>/g, " ").slice(0, 400)}`
      : "",
    dest.contentWildlife
      ? `\nWildlife: ${dest.contentWildlife.replace(/<[^>]*>/g, " ").slice(0, 400)}`
      : "",
    faqText ? `\nFAQs:\n${faqText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await upsertChunk({
    id: `destination-${destinationId}`,
    content,
    source_type: "destination",
    source_id: destinationId,
    metadata: {
      type: "destination",
      id: dest.id,
      name: dest.name,
      slug: dest.slug,
      countryName: dest.country.name,
      countrySlug: dest.country.slug,
      heroImageUrl: dest.heroImage?.fileUrl ?? null,
    },
  });
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function syncFaq(faqId: string): Promise<void> {
  const faq = await prisma.faq.findUnique({ where: { id: faqId } });

  if (!faq || faq.status !== "ACTIVE") {
    await deleteChunks("faq", faqId);
    return;
  }

  const content = `FAQ — ${faq.category}\nQ: ${faq.question}\nA: ${faq.answer}`;

  await upsertChunk({
    id: `faq-${faqId}`,
    content,
    source_type: "faq",
    source_id: faqId,
    metadata: {
      type: "faq",
      id: faq.id,
      category: faq.category,
      question: faq.question,
    },
  });
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function syncBlogPost(postId: string): Promise<void> {
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    include: { author: { select: { name: true } }, featuredImage: { select: { fileUrl: true } } },
  });

  if (!post || post.status !== "PUBLISHED") {
    await deleteChunks("blog", postId);
    return;
  }

  const plainContent = post.content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);

  const content = [
    `BLOG: ${post.title}`,
    post.category ? `Category: ${post.category}` : "",
    post.excerpt ? `Summary: ${post.excerpt}` : "",
    `Content: ${plainContent}`,
  ]
    .filter(Boolean)
    .join("\n");

  await upsertChunk({
    id: `blog-${postId}`,
    content,
    source_type: "blog",
    source_id: postId,
    metadata: {
      type: "blog",
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author?.name ?? null,
      featuredImageUrl: post.featuredImage?.fileUrl ?? null,
    },
  });
}

// ─── Full Re-sync ─────────────────────────────────────────────────────────────

export async function syncAllKnowledge(): Promise<{
  tours: number;
  destinations: number;
  faqs: number;
  blogs: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let tours = 0,
    destinations = 0,
    faqs = 0,
    blogs = 0;

  const [allTours, allDestinations, allFaqs, allPosts] = await Promise.all([
    prisma.tour.findMany({ where: { status: "PUBLISHED" }, select: { id: true } }),
    prisma.destination.findMany({ where: { status: "PUBLISHED" }, select: { id: true } }),
    prisma.faq.findMany({ where: { status: "ACTIVE" }, select: { id: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { id: true } }),
  ]);

  for (const t of allTours) {
    try { await syncTour(t.id); tours++; } catch (e: any) { errors.push(`tour ${t.id}: ${e.message}`); }
  }
  for (const d of allDestinations) {
    try { await syncDestination(d.id); destinations++; } catch (e: any) { errors.push(`dest ${d.id}: ${e.message}`); }
  }
  for (const f of allFaqs) {
    try { await syncFaq(f.id); faqs++; } catch (e: any) { errors.push(`faq ${f.id}: ${e.message}`); }
  }
  for (const p of allPosts) {
    try { await syncBlogPost(p.id); blogs++; } catch (e: any) { errors.push(`blog ${p.id}: ${e.message}`); }
  }

  return { tours, destinations, faqs, blogs, errors };
}
