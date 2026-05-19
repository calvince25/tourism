import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const results = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate slug filename
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const slug = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const datePath = new Date().toISOString().slice(0, 7).replace('-', '/')
      const dir = path.join(process.cwd(), 'public', 'uploads', datePath)

      await mkdir(dir, { recursive: true })

      // Process with sharp — generate 3 sizes + webp
      const baseFilename = `${slug}-${Date.now()}`

      const sizes = [
        { suffix: '-thumb', width: 320 },
        { suffix: '-medium', width: 800 },
        { suffix: '-large', width: 1920 },
      ]

      const urls: Record<string, string> = {}

      for (const size of sizes) {
        const outFile = `${baseFilename}${size.suffix}.webp`
        await sharp(buffer)
          .resize(size.width, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(dir, outFile))
        urls[size.suffix] = `/uploads/${datePath}/${outFile}`
      }

      // Get dimensions from original
      const meta = await sharp(buffer).metadata()

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
          uploadedById: (session.user as any).id,
        },
      })

      results.push(media)
    }

    return NextResponse.json({ success: true, media: results })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
