import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = new Date(Date.now() + 600000) // 10 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry,
      }
    })

    // TODO: Send OTP email
    // await sendOTPEmail(email, otp)

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
