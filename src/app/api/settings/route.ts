import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteFromStorage } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const settings = await prisma.setting.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let key = ''
  let value = ''
  try {
    const body = await req.json()
    key = body.key
    value = body.value
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
  }

  // Retrieve existing value to clean up replaced media from Supabase Storage
  let existingValue = ''
  try {
    const existing = await prisma.setting.findUnique({ where: { key } })
    if (existing?.value) existingValue = existing.value
  } catch (e) {
    console.warn('Could not retrieve existing setting before upsert:', e)
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    // Clean up old Supabase Storage file if the setting value was a storage URL
    if (
      existingValue &&
      existingValue !== value &&
      existingValue.includes('supabase.co/storage')
    ) {
      deleteFromStorage(existingValue).catch((err) =>
        console.error('Error deleting old storage media:', err)
      )
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json(
      {
        error: 'Failed to save setting',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
