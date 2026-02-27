import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        twoFactorEnabled: true,
        phone: true,
        avatar: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || '')
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    )

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate and send OTP for 2FA
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Store OTP in database
      await prisma.oTPRequest.create({
        data: {
          code: otp,
          purpose: '2FA',
          expiresAt,
          userId: user.id,
          identifier: user.email,
        }
      })

      // TODO: Send OTP via email/SMS
      // await sendOTP(user.email, otp)

      return NextResponse.json(
        { 
          requiresTwoFactor: true,
          userId: user.id,
          message: '2FA verification required'
        },
        { status: 200 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Create response with cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: userWithoutPassword,
        token 
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
