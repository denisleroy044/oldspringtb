import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email, purpose } = await request.json()

    if (!email || !purpose) {
      return NextResponse.json(
        { error: 'Email and purpose are required' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create a new OTP request in the OTPRequest model
    await prisma.oTPRequest.create({
      data: {
        code: otp,
        purpose: purpose,
        expiresAt,
        userId: user.id,
        identifier: email,
      }
    })

    // TODO: Send OTP via email
    // await sendOTPEmail(email, otp, purpose)

    console.log(`📧 New OTP generated for ${email}: ${otp}`)

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
