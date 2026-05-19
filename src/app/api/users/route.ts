import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Database offline" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    const deleted = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
