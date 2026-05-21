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
    
    // We replace '-large.webp' with each suffix respectively to delete all responsive versions
    const largePath = path.join(baseUploadPath, fileUrl);
    const mediumPath = path.join(baseUploadPath, fileUrl.replace('-large.webp', '-medium.webp'));
    const thumbPath = path.join(baseUploadPath, fileUrl.replace('-large.webp', '-thumb.webp'));
    
    const filesToDelete = [largePath, mediumPath, thumbPath];
    
    for (const filepath of filesToDelete) {
      try {
        await unlink(filepath);
        console.log(`Successfully deleted orphaned file: ${filepath}`);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error(`Failed to delete file ${filepath}:`, err);
        }
      }
    }
  } catch (error) {
    console.error(`Error in deleteMediaFiles for URL ${fileUrl}:`, error);
  }
};

export async function GET(req: Request) {
  try {
    const dbPromise = prisma.setting.findMany()
    const timeoutPromise = new Promise<any[]>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    )
    const settings = await Promise.race([dbPromise, timeoutPromise])
    return NextResponse.json(settings)
  } catch (error) {
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
    const getDbPromise = prisma.setting.findUnique({ where: { key } });
    const getTimeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    const existing = await Promise.race([getDbPromise, getTimeoutPromise]);
    if (existing) {
      existingValue = existing.value;
    }
  } catch (e) {
    console.warn("Could not retrieve existing setting before upsert:", e);
  }

  try {
    const dbPromise = prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    )
    const setting = await Promise.race([dbPromise, timeoutPromise])

    // If upsert succeeded and we replaced an old uploads URL, clean up the files
    if (existingValue && existingValue !== value && existingValue.startsWith('/uploads/')) {
      deleteMediaFiles(existingValue).catch(err => console.error("Error deleting old media files:", err));
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.warn("Settings DB offline or timed out, returning virtual mock setting:", error);
    
    // Still clean up settings locally if the DB fails but front-end updates
    if (existingValue && existingValue !== value && existingValue.startsWith('/uploads/')) {
      deleteMediaFiles(existingValue).catch(err => console.error("Error deleting old media files:", err));
    }

    return NextResponse.json({ key, value })
  }
}

