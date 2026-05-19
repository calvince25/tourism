import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const userCount = await prisma.user.count()
    const isFirst = userCount === 0

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: isFirst ? 'SUPER_ADMIN' : 'PENDING',
        status: isFirst ? 'ACTIVE' : 'PENDING',
        isFirstAdmin: isFirst,
      },
    })

    return NextResponse.json({
      success: true,
      isFirstAdmin: isFirst,
      message: isFirst
        ? 'Welcome, Super Admin! Your account is ready.'
        : 'Registration successful. Your account is awaiting authorization from the administrator.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
