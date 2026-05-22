import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

const deleteMediaFiles = async (fileUrl: string) => {
  try {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
    const baseUploadPath = path.join(process.cwd(), 'public');
    const largePath = path.join(baseUploadPath, fileUrl);
    const mediumPath = path.join(baseUploadPath, fileUrl.replace(/-large\.webp$/, '-medium.webp'));
    const thumbPath = path.join(baseUploadPath, fileUrl.replace(/-large\.webp$/, '-thumb.webp'));
    for (const filepath of [largePath, mediumPath, thumbPath]) {
      try { await unlink(filepath); } catch (err: any) {
        if (err.code !== 'ENOENT') console.error(`Failed to delete file ${filepath}:`, err);
      }
    }
  } catch (error) {
    console.error(`Error in deleteMediaFiles for URL ${fileUrl}:`, error);
  }
};

export async function GET(req: Request) {
  try {
    const settings = await prisma.setting.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let key = ''
  let value = ''
  try {
    const body = await req.json()
    key = body.key
    value = body.value
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
  }

  // Retrieve existing value to clean up replaced media if necessary
  let existingValue = '';
  try {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (existing?.value) existingValue = existing.value;
  } catch (e) {
    console.warn("Could not retrieve existing setting before upsert:", e);
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    // Clean up old file if replaced
    if (existingValue && existingValue !== value && existingValue.startsWith('/uploads/')) {
      deleteMediaFiles(existingValue).catch(err => console.error("Error deleting old media files:", err));
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Failed to save setting', message: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
