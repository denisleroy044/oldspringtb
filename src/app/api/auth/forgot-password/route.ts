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

    // @ts-ignore - Temporary fix for TypeScript
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive reset instructions.' },
        { status: 200 }
      )
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    // @ts-ignore - Temporary fix for TypeScript
    await prisma.oTPRequest.create({
      data: {
        code: resetToken,
        purpose: 'PASSWORD_RESET',
        expiresAt: resetTokenExpiry,
        userId: user.id,
        identifier: email,
      }
    })

    // @ts-ignore - Temporary fix for TypeScript
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUEST',
        details: 'Password reset requested',
        status: 'SUCCESS'
      }
    })

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive reset instructions.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
