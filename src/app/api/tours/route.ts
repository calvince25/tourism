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
    const { itinerary, gallery, ...tourData } = data

    const tour = await prisma.$transaction(async (tx) => {
      const newTour = await tx.tour.create({
        data: tourData
      })

      if (itinerary && Array.isArray(itinerary)) {
        await tx.tourItineraryDay.createMany({
          data: itinerary.map((day: any, index: number) => ({
            tourId: newTour.id,
            dayNumber: index + 1,
            title: day.title,
            description: day.description || null,
            location: day.location || null,
            mealsIncluded: day.mealsIncluded || null,
            accommodation: day.accommodation || null,
            photoId: day.photoId || null,
            sortOrder: index
          }))
        })
      }

      if (gallery && Array.isArray(gallery)) {
        await tx.tourGallery.createMany({
          data: gallery.map((item: any, index: number) => ({
            tourId: newTour.id,
            mediaId: item.mediaId || item.id || item.media?.id,
            sortOrder: index
          }))
        })
      }

      return newTour
    })

    return NextResponse.json(tour)
  } catch (error: any) {
    console.error('Create tour API error:', error)
    return NextResponse.json({ error: error.message || 'Create failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const { id, itinerary, gallery, ...tourData } = data

    const tour = await prisma.$transaction(async (tx) => {
      const updatedTour = await tx.tour.update({
        where: { id },
        data: tourData
      })

      if (itinerary && Array.isArray(itinerary)) {
        await tx.tourItineraryDay.deleteMany({
          where: { tourId: id }
        })
        if (itinerary.length > 0) {
          await tx.tourItineraryDay.createMany({
            data: itinerary.map((day: any, index: number) => ({
              tourId: id,
              dayNumber: index + 1,
              title: day.title,
              description: day.description || null,
              location: day.location || null,
              mealsIncluded: day.mealsIncluded || null,
              accommodation: day.accommodation || null,
              photoId: day.photoId || null,
              sortOrder: index
            }))
          })
        }
      }

      if (gallery && Array.isArray(gallery)) {
        await tx.tourGallery.deleteMany({
          where: { tourId: id }
        })
        if (gallery.length > 0) {
          await tx.tourGallery.createMany({
            data: gallery.map((item: any, index: number) => ({
              tourId: id,
              mediaId: item.mediaId || item.id || item.media?.id,
              sortOrder: index
            }))
          })
        }
      }

      return updatedTour
    })

    return NextResponse.json(tour)
  } catch (error: any) {
    console.error('Update tour API error:', error)
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing tour id' }, { status: 400 })

    // Clean up dependent tables without cascade in DB schema
    await prisma.review.deleteMany({
      where: { tourId: id }
    })

    // TourDestination, TourItineraryDay, TourDeparture, TourGallery, and TourFaq are configured with onDelete: Cascade
    const deletedTour = await prisma.tour.delete({
      where: { id }
    })

    return NextResponse.json(deletedTour)
  } catch (error: any) {
    console.error("API Error deleting tour:", error)
    return NextResponse.json({ error: error.message || 'Deletion failed' }, { status: 500 })
  }
}
