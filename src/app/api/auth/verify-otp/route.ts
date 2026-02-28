import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, otp, purpose } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Find valid OTP in OTPRequest model
    const validOTP = await prisma.oTPRequest.findFirst({
      where: {
        userId: user.id,
        code: otp,
        purpose: purpose || 'ACCOUNT_OPENING',
        expiresAt: {
          gt: new Date()
        },
        isVerified: false,
        attempts: {
          lt: 3
        }
      }
    })

    if (!validOTP) {
      // Increment attempts on any matching OTP
      await prisma.oTPRequest.updateMany({
        where: {
          userId: user.id,
          purpose: purpose || 'ACCOUNT_OPENING',
          expiresAt: {
            gt: new Date()
          }
        },
        data: {
          attempts: {
            increment: 1
          }
        }
      })

      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.oTPRequest.update({
      where: { id: validOTP.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'VERIFY_OTP',
        details: `OTP verified for purpose: ${purpose || 'ACCOUNT_OPENING'}`,
        status: 'SUCCESS'
      }
    })

    return NextResponse.json(
      { message: 'OTP verified successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
