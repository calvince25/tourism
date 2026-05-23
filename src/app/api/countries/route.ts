import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
      include: { coverImage: true },
    });
    return NextResponse.json(countries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, code, continent, coverImageId } = await req.json();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const country = await prisma.country.create({
      data: {
        name,
        slug,
        continent: continent || "Africa",
        flagEmoji: code || null,
        coverImageId: coverImageId || null,
      },
      include: { coverImage: true },
    });
    return NextResponse.json(country);
  } catch (error) {
    console.error("Create country error:", error);
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isActive, coverImageId } = await req.json();

    const updateData: any = {};
    if (isActive !== undefined) updateData.active = isActive;
    if (coverImageId !== undefined) updateData.coverImageId = coverImageId;

    const updated = await prisma.country.update({
      where: { id },
      data: updateData,
      include: { coverImage: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update country error:", error);
    return NextResponse.json({ error: "Failed to update country" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();

    // Check if country has destinations
    const destinationsCount = await prisma.destination.count({
      where: { countryId: id }
    });

    if (destinationsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete country: It has associated destinations. Please delete the destinations first." },
        { status: 400 }
      );
    }

    await prisma.country.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete country error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete country" }, { status: 500 });
  }
}
