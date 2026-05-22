import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
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

    const { name, code, description } = await req.json();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const country = await prisma.country.create({
      data: {
        name,
        slug,
        continent: "Africa",
        flagEmoji: code,
      },
    });
    return NextResponse.json(country);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, isActive } = await req.json();
    const updated = await prisma.country.update({
      where: { id },
      data: { active: isActive },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update country" }, { status: 500 });
  }
}
