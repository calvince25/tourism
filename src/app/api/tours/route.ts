import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    
    const tours = await prisma.tour.findMany({
      where: featured === 'true' ? { featured: true, status: 'PUBLISHED' } : {},
      include: { coverImage: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tours)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const tour = await prisma.tour.create({ data })
    return NextResponse.json(tour)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Create failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, ...data } = await req.json()
    const tour = await prisma.tour.update({
      where: { id },
      data
    })
    return NextResponse.json(tour)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}
