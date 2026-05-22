import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteFromStorage } from '@/lib/supabase'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const media = await prisma.media.findMany({
      where: category && category !== 'All' ? { category } : {},
      orderBy: { createdAt: 'desc' },
      include: { uploadedBy: { select: { name: true } } },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Media GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing media ID' }, { status: 400 })

    // Get the media record to find its storage URLs
    const media = await prisma.media.findUnique({ where: { id } })
    if (!media) return NextResponse.json({ error: 'Media not found' }, { status: 404 })

    // Delete all size variants from Supabase Storage
    const urlsToDelete = [media.fileUrl, media.thumbnailUrl, media.mediumUrl, media.largeUrl]
      .filter(Boolean) as string[]

    await Promise.allSettled(urlsToDelete.map((url) => deleteFromStorage(url)))

    // Delete DB record
    await prisma.media.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Media DELETE error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
