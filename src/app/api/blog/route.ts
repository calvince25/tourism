import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";

export async function GET(req: Request) {
  try {
    const session = await getContentManagerSession();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: { featuredImage: true },
      });
      if (!post || (post.status !== "PUBLISHED" && !session)) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    const posts = await prisma.blogPost.findMany({
      where: session ? undefined : { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: { featuredImage: true },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getContentManagerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, excerpt, content, status, featuredImageId } = await req.json();
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Post title is required" }, { status: 400 });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    let authorId = (session.user as { id?: string }).id;
    if (authorId === "mock-admin") {
      const exists = await prisma.user.findUnique({ where: { id: "mock-admin" } });
      if (!exists) authorId = undefined;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        excerpt,
        content,
        status,
        featuredImageId: featuredImageId || null,
        authorId,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    if (post.status === "PUBLISHED") revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getContentManagerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, title, excerpt, content, status, featuredImageId } = await req.json();
    if (typeof id !== "string" || !id || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Post ID and title are required" }, { status: 400 });
    }

    const previous = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true, status: true, publishedAt: true },
    });
    if (!previous) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const publishedAt = status === "PUBLISHED"
      ? previous.status === "PUBLISHED" && previous.publishedAt
        ? previous.publishedAt
        : new Date()
      : null;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        featuredImageId: featuredImageId || null,
        publishedAt,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/blog/${previous.slug}`);
    if (post.status === "PUBLISHED") revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
