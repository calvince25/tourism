import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        destination: true,
        tour: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Database offline" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status, featured } = await req.json();
    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing Review ID" }, { status: 400 });

    const deleted = await prisma.review.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
