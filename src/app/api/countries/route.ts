import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";

export async function GET() {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
      include: { coverImage: true },
    });
    return NextResponse.json(countries);
  } catch {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, code, continent, coverImageId } = await req.json();
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Country name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const country = await prisma.country.create({
      data: {
        name: name.trim(),
        slug,
        continent: continent || "Africa",
        flagEmoji: code || null,
        coverImageId: coverImageId || null,
      },
      include: { coverImage: true },
    });
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${country.slug}`);
    return NextResponse.json(country);
  } catch (error) {
    console.error("Create country error:", error);
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, isActive, coverImageId } = await req.json();
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
    }

    const updateData: { active?: boolean; coverImageId?: string | null } = {};
    if (isActive !== undefined) updateData.active = Boolean(isActive);
    if (coverImageId !== undefined) updateData.coverImageId = coverImageId || null;

    const updated = await prisma.country.update({
      where: { id },
      data: updateData,
      include: { coverImage: true },
    });
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${updated.slug}`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update country error:", error);
    return NextResponse.json({ error: "Failed to update country" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "Country ID is required" }, { status: 400 });
    }

    const country = await prisma.country.findUnique({ where: { id }, select: { slug: true } });
    if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });

    const destinationsCount = await prisma.destination.count({ where: { countryId: id } });
    if (destinationsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete country: It has associated destinations. Please delete the destinations first." },
        { status: 400 }
      );
    }

    await prisma.country.delete({ where: { id } });
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${country.slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete country error:", error);
    return NextResponse.json({ error: "Failed to delete country" }, { status: 500 });
  }
}
