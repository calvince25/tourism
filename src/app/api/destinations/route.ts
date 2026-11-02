import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";
import { syncDestination, deleteChunks as deleteDestChunks } from "@/lib/ai/knowledgeSync";

async function syncDestBg(id: string) {
  try {
    await syncDestination(id);
  } catch (error) {
    console.warn("Dest sync error:", error);
  }
}

function revalidateDestinationPaths(countrySlug?: string | null, slug?: string | null) {
  revalidatePath("/destinations");
  revalidatePath("/sitemap");
  revalidatePath("/sitemap.xml");
  if (countrySlug) {
    revalidatePath(`/destinations/${countrySlug}`);
    if (slug) revalidatePath(`/destinations/${countrySlug}/${slug}`);
  }
}

export async function POST(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { faqs, attractions, ...rest } = data;
    const combinedContent =
      (rest.contentIntro || "") +
      (rest.contentWhyVisit || "") +
      (rest.contentWildlife || "") +
      (rest.contentCulture || "");
    const wordCount = combinedContent
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    const destination = await prisma.destination.create({
      data: {
        ...rest,
        totalWordCount: wordCount,
        faqs: faqs
          ? {
              create: faqs.map((faq: any) => ({
                question: faq.question,
                answer: faq.answer,
                sortOrder: faq.sortOrder || 0,
              })),
            }
          : undefined,
        attractions: attractions
          ? {
              create: attractions.map((attraction: any) => ({
                name: attraction.name,
                description: attraction.description,
                attractionType: attraction.attractionType || "Wildlife",
                photoId: attraction.photoId || null,
                sortOrder: attraction.sortOrder || 0,
              })),
            }
          : undefined,
      },
    });

    const country = await prisma.country.findUnique({
      where: { id: destination.countryId },
      select: { slug: true },
    });
    revalidateDestinationPaths(country?.slug, destination.slug);
    syncDestBg(destination.id);
    return NextResponse.json(destination);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, faqs, attractions, ...rest } = await req.json();
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "Destination ID is required" }, { status: 400 });
    }

    const previous = await prisma.destination.findUnique({
      where: { id },
      select: { slug: true, country: { select: { slug: true } } },
    });
    if (!previous) return NextResponse.json({ error: "Destination not found" }, { status: 404 });

    const combinedContent =
      (rest.contentIntro || "") +
      (rest.contentWhyVisit || "") +
      (rest.contentWildlife || "") +
      (rest.contentCulture || "");
    const wordCount = combinedContent
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    await prisma.$transaction([
      prisma.destinationFaq.deleteMany({ where: { destinationId: id } }),
      prisma.attraction.deleteMany({ where: { destinationId: id } }),
    ]);

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...rest,
        totalWordCount: wordCount,
        faqs: faqs
          ? {
              create: faqs.map((faq: any) => ({
                question: faq.question,
                answer: faq.answer,
                sortOrder: faq.sortOrder || 0,
              })),
            }
          : undefined,
        attractions: attractions
          ? {
              create: attractions.map((attraction: any) => ({
                name: attraction.name,
                description: attraction.description,
                attractionType: attraction.attractionType || "Wildlife",
                photoId: attraction.photoId || null,
                sortOrder: attraction.sortOrder || 0,
              })),
            }
          : undefined,
      },
    });

    const newCountrySlug = rest.countryId
      ? (await prisma.country.findUnique({ where: { id: rest.countryId }, select: { slug: true } }))?.slug
      : previous.country.slug;
    revalidateDestinationPaths(previous.country.slug, previous.slug);
    revalidateDestinationPaths(newCountrySlug, destination.slug);
    syncDestBg(id);
    return NextResponse.json(destination);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing destination id" }, { status: 400 });

    const destination = await prisma.destination.findUnique({
      where: { id },
      select: { slug: true, country: { select: { slug: true } } },
    });
    if (!destination) return NextResponse.json({ error: "Destination not found" }, { status: 404 });

    await prisma.tourDestination.deleteMany({ where: { destinationId: id } });
    await prisma.review.deleteMany({ where: { destinationId: id } });
    await prisma.destination.delete({ where: { id } });

    revalidateDestinationPaths(destination.country.slug, destination.slug);
    deleteDestChunks("destination", id).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Error deleting destination:", error);
    return NextResponse.json({ error: error.message || "Deletion failed" }, { status: 500 });
  }
}
