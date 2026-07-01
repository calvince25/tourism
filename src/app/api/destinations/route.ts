import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { syncDestination, deleteChunks as deleteDestChunks } from '@/lib/ai/knowledgeSync'

async function syncDestBg(id: string) {
  try { await syncDestination(id); } catch (e) { console.warn('Dest sync error:', e); }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const { faqs, attractions, ...rest } = data
    
    // Calculate word count
    const combinedContent = (rest.contentIntro || "") + (rest.contentWhyVisit || "") + (rest.contentWildlife || "") + (rest.contentCulture || "")
    const wordCount = combinedContent.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter((w: string) => w.length > 0).length

    const destination = await prisma.destination.create({
      data: {
        ...rest,
        totalWordCount: wordCount,
        faqs: faqs ? {
          create: faqs.map((f: any) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder || 0
          }))
        } : undefined,
        attractions: attractions ? {
          create: attractions.map((a: any) => ({
            name: a.name,
            description: a.description,
            attractionType: a.attractionType || "Wildlife",
            photoId: a.photoId || null,
            sortOrder: a.sortOrder || 0
          }))
        } : undefined
      }
    })

    syncDestBg(destination.id);
    return NextResponse.json(destination)
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, faqs, attractions, ...rest } = await req.json()
    
    const combinedContent = (rest.contentIntro || "") + (rest.contentWhyVisit || "") + (rest.contentWildlife || "") + (rest.contentCulture || "")
    const wordCount = combinedContent.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter((w: string) => w.length > 0).length

    // Run delete and update in a transaction
    await prisma.$transaction([
      prisma.destinationFaq.deleteMany({ where: { destinationId: id } }),
      prisma.attraction.deleteMany({ where: { destinationId: id } }),
    ])

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...rest,
        totalWordCount: wordCount,
        faqs: faqs ? {
          create: faqs.map((f: any) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder || 0
          }))
        } : undefined,
        attractions: attractions ? {
          create: attractions.map((a: any) => ({
            name: a.name,
            description: a.description,
            attractionType: a.attractionType || "Wildlife",
            photoId: a.photoId || null,
            sortOrder: a.sortOrder || 0
          }))
        } : undefined
      }
    })

    syncDestBg(id);
    return NextResponse.json(destination)
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing destination id' }, { status: 400 })

    // Clean up dependent tables without cascade in DB schema
    await prisma.tourDestination.deleteMany({
      where: { destinationId: id }
    })

    await prisma.review.deleteMany({
      where: { destinationId: id }
    })

    // Attractions, DestinationGallery, and DestinationFaq are configured with onDelete: Cascade in prisma schema
    const deletedDestination = await prisma.destination.delete({
      where: { id }
    })

    deleteDestChunks('destination', id).catch(() => {});
    return NextResponse.json(deletedDestination)
  } catch (error: any) {
    console.error("API Error deleting destination:", error)
    return NextResponse.json({ error: error.message || 'Deletion failed' }, { status: 500 })
  }
}
