import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";
import { deleteFromStorage } from "@/lib/supabase";

export async function GET(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const media = await prisma.media.findMany({
      where: category && category !== "All" ? { category } : {},
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { name: true } } },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing media ID" }, { status: 400 });

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });

    const urlsToDelete = [media.fileUrl, media.thumbnailUrl, media.mediumUrl, media.largeUrl]
      .filter(Boolean) as string[];
    await Promise.allSettled(urlsToDelete.map((url) => deleteFromStorage(url)));
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
