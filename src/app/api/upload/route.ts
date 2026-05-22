import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToStorage, ensureMediaBucket } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    // Ensure the storage bucket exists (cached after first call)
    await ensureMediaBucket()

    const results = []
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds the 10MB limit (${file.name})` },
          { status: 400 }
        )
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate slug filename
      const slug = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .substring(0, 50)
      const datePath = new Date().toISOString().slice(0, 7) // e.g. "2026-05"
      const baseFilename = `${slug}-${Date.now()}`

      const sizes = [
        { suffix: '-thumb', width: 320 },
        { suffix: '-medium', width: 800 },
        { suffix: '-large', width: 1920 },
      ]

      // Parallelize all resizes + uploads for maximum speed
      const uploadResults = await Promise.all(
        sizes.map(async (size) => {
          const filename = `${baseFilename}${size.suffix}.webp`
          const storagePath = `${datePath}/${filename}`

          const resizedBuffer = await sharp(buffer)
            .resize(size.width, null, { withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer()

          const url = await uploadToStorage(resizedBuffer, storagePath, 'image/webp')
          return { suffix: size.suffix, url }
        })
      )

      // Build URL map from parallel results
      const urls: Record<string, string> = {}
      for (const { suffix, url } of uploadResults) {
        urls[suffix] = url
      }

      // Get dimensions from original
      const meta = await sharp(buffer).metadata()

      // Get uploader ID (skip mock IDs)
      let uploadedById = (session?.user as any)?.id as string | undefined
      if (!uploadedById || uploadedById === 'mock-admin') {
        uploadedById = undefined
      }

      const media = await prisma.media.create({
        data: {
          filename: baseFilename,
          originalName: file.name,
          filePath: urls['-large'],
          fileUrl: urls['-large'],
          thumbnailUrl: urls['-thumb'],
          mediumUrl: urls['-medium'],
          largeUrl: urls['-large'],
          fileType: 'webp',
          fileSize: buffer.length,
          width: meta.width,
          height: meta.height,
          uploadedById,
        },
      })

      results.push(media)
    }

    return NextResponse.json({ success: true, media: results })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

