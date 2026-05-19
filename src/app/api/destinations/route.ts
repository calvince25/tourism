import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    return NextResponse.json(destination)
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}
