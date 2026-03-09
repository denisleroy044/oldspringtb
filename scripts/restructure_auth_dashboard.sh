#!/bin/bash

# Script: restructure_auth_dashboard.sh
# Description: Restructure auth and dashboard with Prisma 6

echo "🏗️  Restructuring auth and dashboard..."

# 1. Create fresh auth pages directory
rm -rf src/app/auth
mkdir -p src/app/auth/login
mkdir -p src/app/auth/signup
mkdir -p src/app/auth/verify-otp
mkdir -p src/app/auth/forgot-password
mkdir -p src/app/auth/reset-password

# 2. Create fresh dashboard directory
rm -rf src/app/dashboard
mkdir -p src/app/dashboard
mkdir -p src/app/dashboard/profile
mkdir -p src/app/dashboard/accounts
mkdir -p src/app/dashboard/transactions
mkdir -p src/app/dashboard/cards
mkdir -p src/app/dashboard/transfers
mkdir -p src/app/dashboard/support

# 3. Create fresh components directory
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/dashboard

# 4. Create fresh lib directory
mkdir -p src/lib
mkdir -p src/context
mkdir -p src/middleware

# 5. Create Prisma client
cat > src/lib/prisma.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
EOF

# 6. Create Auth Context
cat > src/context/AuthContext.tsx << 'EOF'
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  accountType: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Login failed')
    }

    setUser(data.user)
    router.push('/dashboard')
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/auth/login')
  }

  const signup = async (data: any) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.error || 'Signup failed')
    }

    router.push('/auth/login?registered=true')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
EOF

# 7. Create API routes
mkdir -p src/app/api/auth/login
mkdir -p src/app/api/auth/signup
mkdir -p src/app/api/auth/me
mkdir -p src/app/api/auth/logout

# Login API
cat > src/app/api/auth/login/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password || '')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        isVerified: user.isVerified
      }
    })

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
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
EOF

# Signup API
cat > src/app/api/auth/signup/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password, accountType } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        accountType: accountType || 'personal',
        name: `${firstName} ${lastName}`,
        accounts: {
          create: {
            accountNumber: `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`,
            type: 'CHECKING',
            balance: 0,
            currency: 'USD'
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Account created successfully',
      userId: user.id
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF

# Me API
cat > src/app/api/auth/me/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true,
        isVerified: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
EOF

# Logout API
cat > src/app/api/auth/logout/route.ts << 'EOF'
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })
  
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/'
  })

  return response
}
EOF

# 8. Create middleware/proxy
cat > src/middleware.ts << 'EOF'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

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

  if (isPublicPath) {
    return NextResponse.next()
  }

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
EOF

# 9. Install jose for middleware
npm install jose

echo "✅ Auth and dashboard restructured!"
echo ""
echo "Next steps:"
echo "1. Run: npm install (if needed)"
echo "2. Run: npx prisma generate"
echo "3. Run: npm run dev"
echo "4. Visit: http://localhost:3000/auth/signup"