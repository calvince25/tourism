import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id) {
      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: { featuredImage: true },
      });
      return NextResponse.json(post);
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { featuredImage: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Database offline" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, excerpt, content, status, featuredImageId } = await req.json();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        featuredImageId: featuredImageId || null,
        authorId: (session.user as any).id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, title, excerpt, content, status, featuredImageId } = await req.json();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        featuredImageId: featuredImageId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing post ID" }, { status: 400 });

    const deleted = await prisma.blogPost.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
