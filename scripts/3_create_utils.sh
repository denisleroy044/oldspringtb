#!/bin/bash

# Script: 3_create_utils.sh
# Description: Create utility functions and middleware

set -e

echo "🛠️ Creating utility functions and middleware..."

# Create lib directory
mkdir -p src/lib

# Prisma client
cat > src/lib/prisma.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

# OTP utilities
cat > src/lib/otp.ts << 'EOF'
import { prisma } from './prisma'

export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function generateOTP(email: string, purpose: string): Promise<string> {
  // Delete any existing OTPs for this email and purpose
  await prisma.oTP.deleteMany({
    where: {
      email,
      purpose
    }
  })

  const code = generateOTPCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.oTP.create({
    data: {
      email,
      code,
      purpose,
      expiresAt
    }
  })

  return code
}

export async function sendOTPEmail(email: string, code: string, purpose: string) {
  // In development, just log the code
  if (process.env.NODE_ENV === 'development') {
    console.log(`📧 OTP for ${email} (${purpose}): ${code}`)
    return
  }

  // In production, send actual email
  // Implement your email sending logic here
  console.log(`Sending OTP ${code} to ${email}`)
}
EOF

# Create middleware
cat > src/middleware.ts << 'EOF'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-otp',
    '/about',
    '/borrow',
    '/save',
    '/invest',
    '/insure',
    '/learn-and-plan',
    '/payments',
    '/business-banking',
    '/credit-cards',
    '/faqs',
    '/customer-support',
    '/giving-back',
    '/news',
    '/privacy-policy',
    '/careers'
  ]

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/templates') ||
    request.nextUrl.pathname.includes('.')
  )

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if it's a dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
EOF

echo "✅ Utilities and middleware created!"
EOF