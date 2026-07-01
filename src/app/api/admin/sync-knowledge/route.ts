import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncAllKnowledge } from "@/lib/ai/knowledgeSync";

export const maxDuration = 300; // 5 min — needed for large syncs

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const results = await syncAllKnowledge();
    return NextResponse.json({
      success: true,
      synced: results,
      message: `Synced ${results.tours} tours, ${results.destinations} destinations, ${results.faqs} FAQs, ${results.blogs} blog posts.`,
    });
  } catch (error: any) {
    console.error("Sync knowledge error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
