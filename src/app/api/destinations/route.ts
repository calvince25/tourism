import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    
    // Calculate word count
    const combinedContent = (data.contentIntro || "") + (data.contentWhyVisit || "") + (data.contentWildlife || "") + (data.contentCulture || "")
    const wordCount = combinedContent.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(w => w.length > 0).length

    const destination = await prisma.destination.create({
      data: {
        ...data,
        totalWordCount: wordCount
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
    const { id, ...data } = await req.json()
    
    const combinedContent = (data.contentIntro || "") + (data.contentWhyVisit || "") + (data.contentWildlife || "") + (data.contentCulture || "")
    const wordCount = combinedContent.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(w => w.length > 0).length

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...data,
        totalWordCount: wordCount
      }
    })

    return NextResponse.json(destination)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}
