import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('current_user')?.value
  const isAdmin = currentUser ? JSON.parse(currentUser).isAdmin : false
  const path = request.nextUrl.pathname

  // Public paths
  if (path === '/auth/login' || path === '/auth/signup' || path === '/') {
    return NextResponse.next()
  }

  // Protect admin routes
  if (path.startsWith('/admin')) {
    if (!currentUser || !isAdmin) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Protect dashboard routes
  if (path.startsWith('/dashboard')) {
    if (!currentUser) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*']
}
