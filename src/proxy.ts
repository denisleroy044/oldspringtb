import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/jwt'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')?.value

  // Public paths that don't need authentication
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password']
  
  // If it's a public path, allow access
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const payload = await verifyJWT(token)
    
    if (!payload) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Handle admin routes
    if (path.startsWith('/admin')) {
      if (payload.role !== 'admin') {
        // Non-admin trying to access admin routes -> redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Admin accessing admin routes -> allow
      return NextResponse.next()
    }

    // Handle regular dashboard routes
    if (path.startsWith('/dashboard')) {
      if (payload.role === 'admin') {
        // Admin trying to access user dashboard -> redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      // Regular user accessing dashboard -> allow
      return NextResponse.next()
    }

    // For any other routes, allow if authenticated
    return NextResponse.next()

  } catch (error) {
    // Token verification failed
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|templates).*)'],
}
