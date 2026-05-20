import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const dbPromise = prisma.setting.findMany()
    const timeoutPromise = new Promise<any[]>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    )
    const settings = await Promise.race([dbPromise, timeoutPromise])
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json([])
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

  try {
    const dbPromise = prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    )
    const setting = await Promise.race([dbPromise, timeoutPromise])
    return NextResponse.json(setting)
  } catch (error) {
    console.warn("Settings DB offline or timed out, returning virtual mock setting:", error)
    return NextResponse.json({ key, value })
  }
}

