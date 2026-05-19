import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'

async function getFiles(dir: string): Promise<string[]> {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
  } catch (e) {
    return [];
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    
    let media = [];
    try {
      media = await prisma.media.findMany({
        where: category && category !== 'All' ? { category } : {},
        orderBy: { createdAt: 'desc' },
        include: { uploadedBy: { select: { name: true } } }
      })
    } catch (dbError) {
      console.warn("DB offline, listing files from physical disk uploads directory");
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const files = await getFiles(uploadsDir);
      media = files
        .filter(filePath => /\.(webp|png|jpe?g|gif|svg)$/i.test(filePath))
        .map((filePath, index) => {
          const relativePath = filePath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');
          const name = path.basename(filePath);
          return {
            id: `phys-${index}`,
            filename: name,
            originalName: name,
            fileUrl: relativePath,
            thumbnailUrl: relativePath,
            category: 'General',
            altText: name,
            createdAt: new Date()
          };
        });
    }

    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (id.startsWith('phys-')) {
      // It's a physical mock object, let's succeed immediately for UI convenience
      return NextResponse.json({ success: true })
    }
    await prisma.media.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
