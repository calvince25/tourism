import { NextResponse } from "next/server";
import { getContentManagerSession } from "@/lib/authorization";
import { syncAllKnowledge } from "@/lib/ai/knowledgeSync";

export const maxDuration = 300;

export async function POST() {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await syncAllKnowledge();
    return NextResponse.json({
      success: true,
      synced: results,
      message: `Synced ${results.tours} tours, ${results.destinations} destinations, ${results.faqs} FAQs, ${results.blogs} blog posts.`,
    });
  } catch (error) {
    console.error("Sync knowledge error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Knowledge sync failed" },
      { status: 500 }
    );
  }
}
