import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // Public paths that don't require authentication
  const publicPaths = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-otp',
    '/',
    '/about',
    '/services',
    '/contact',
    '/news',
    '/learn',
    '/bank',
    '/save',
    '/borrow',
    '/invest',
    '/insurance',
    '/payments',
    '/api/auth',
  ]

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Allow public paths without token
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for token on protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    // Verify token using jsonwebtoken
    jwt.verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/protected/:path*',
  ]
}
