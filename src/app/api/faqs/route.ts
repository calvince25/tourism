import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";

export async function GET() {
  try {
    const session = await getContentManagerSession();
    const faqs = await prisma.faq.findMany({
      where: session ? undefined : { status: "ACTIVE" },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { question, answer, category } = await req.json();
    if (
      typeof question !== "string" || !question.trim() ||
      typeof answer !== "string" || !answer.trim() ||
      typeof category !== "string" || !category.trim()
    ) {
      return NextResponse.json({ error: "Question, answer, and category are required" }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        sortOrder: 0,
        status: "ACTIVE",
      },
    });
    revalidatePath("/faq");
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, question, answer, category, status } = await req.json();
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 });
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(category !== undefined && { category }),
        ...(status !== undefined && { status }),
      },
    });
    revalidatePath("/faq");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing FAQ ID" }, { status: 400 });
    const deleted = await prisma.faq.delete({ where: { id } });
    revalidatePath("/faq");
    return NextResponse.json({ success: true, deleted });
  } catch {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
