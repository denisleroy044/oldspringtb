import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password, accountType } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create full name
    const fullName = `${firstName} ${lastName}`

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        password: hashedPassword,
        phone,
        role: accountType === 'business' ? 'BUSINESS' : 'USER',
        twoFactorEnabled: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      }
    })

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    await prisma.oTPRequest.create({
      data: {
        code: otp,
        purpose: 'ACCOUNT_OPENING',
        expiresAt,
        userId: user.id,
        identifier: email,
      }
    })

    console.log('✅ User created successfully. OTP:', otp)

    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email.',
        user,
        requiresVerification: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
