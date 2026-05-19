import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const settings = await prisma.setting.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { key, value } = await req.json()
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
    return NextResponse.json(setting)
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
