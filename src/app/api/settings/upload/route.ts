import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToStorage, ensureMediaBucket, deleteFromStorage } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const settingKey = formData.get('key') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!settingKey) {
      return NextResponse.json({ error: 'No setting key provided' }, { status: 400 })
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const MAX_SIZE = 15 * 1024 * 1024 // 15MB

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 15MB)' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' }, { status: 400 })
    }

    // Ensure storage bucket exists
    await ensureMediaBucket()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate filename
    const slug = (file.name || settingKey)
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 50)
    const datePath = new Date().toISOString().slice(0, 7)
    const filename = `${settingKey}-${slug}-${Date.now()}.webp`
    const storagePath = `settings/${datePath}/${filename}`

    // Compress and convert to webp (max 1920px wide)
    const resizedBuffer = await sharp(buffer)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    // Upload to Supabase
    const fileUrl = await uploadToStorage(resizedBuffer, storagePath, 'image/webp')

    // Retrieve existing setting to clean up old storage file
    let existingValue = ''
    try {
      const existing = await prisma.setting.findUnique({ where: { key: settingKey } })
      if (existing?.value) existingValue = existing.value
    } catch (_) {}

    // Save to settings DB
    const setting = await prisma.setting.upsert({
      where: { key: settingKey },
      update: { value: fileUrl },
      create: { key: settingKey, value: fileUrl },
    })

    // Clean up old Supabase file if it was a storage URL
    if (existingValue && existingValue !== fileUrl && existingValue.includes('supabase.co/storage')) {
      deleteFromStorage(existingValue).catch((err) =>
        console.error('Error deleting old hero image from storage:', err)
      )
    }

    return NextResponse.json({ success: true, fileUrl, setting })
  } catch (error: any) {
    console.error('Settings upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
