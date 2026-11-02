import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";

export async function GET() {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { destination: true, tour: true },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, featured } = await req.json();
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }
    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured }),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing Review ID" }, { status: 400 });
    const deleted = await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted });
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
