import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContentManagerSession } from "@/lib/authorization";
import { deleteFromStorage } from "@/lib/supabase";

const PUBLIC_SETTING_KEYS = [
  "social_instagram",
  "social_facebook",
  "social_tiktok",
  "social_youtube",
];

export async function GET() {
  try {
    const session = await getContentManagerSession();
    const settings = await prisma.setting.findMany({
      where: session ? undefined : { key: { in: PUBLIC_SETTING_KEYS } },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await getContentManagerSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let key = "";
  let value = "";
  try {
    const body = await req.json();
    key = body.key;
    value = body.value;
    if (typeof key !== "string" || !key || typeof value !== "string") {
      return NextResponse.json({ error: "A setting key and string value are required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  let existingValue = "";
  try {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (existing?.value) existingValue = existing.value;
  } catch (error) {
    console.warn("Could not retrieve existing setting before upsert:", error);
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    if (existingValue && existingValue !== value && existingValue.includes("supabase.co/storage")) {
      deleteFromStorage(existingValue).catch((error) =>
        console.error("Error deleting old storage media:", error)
      );
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Failed to save setting", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
