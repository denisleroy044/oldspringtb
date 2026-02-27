import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Find valid reset token
    const resetRequest = await prisma.oTPRequest.findFirst({
      where: {
        code: token,
        purpose: 'PASSWORD_RESET',
        expiresAt: {
          gt: new Date()
        },
        isVerified: false,
        attempts: {
          lt: 3
        }
      },
      include: {
        user: true
      }
    })

    if (!resetRequest) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: {
        password: hashedPassword,
      }
    })

    // Mark token as verified
    await prisma.oTPRequest.update({
      where: { id: resetRequest.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: resetRequest.userId,
        action: 'PASSWORD_RESET',
        details: 'Password reset completed',
        status: 'SUCCESS'
      }
    })

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
