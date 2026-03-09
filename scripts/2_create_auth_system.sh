#!/bin/bash

# Script: 2_create_auth_system.sh
# Description: Create Auth Context and API routes

set -e

echo "🔐 Creating authentication system..."

# Create Auth Context
mkdir -p src/context

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
  twoFactorEnabled: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  signup: (data: any) => Promise<void>
  verifyOTP: (email: string, code: string, purpose: string) => Promise<any>
  resendOTP: (email: string, purpose: string) => Promise<void>
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
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    if (data.requiresTwoFactor) {
      sessionStorage.setItem('2fa_email', email)
      router.push('/auth/verify-otp?purpose=2FA')
      return
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
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Signup failed')
    }

    sessionStorage.setItem('signup_email', data.email)
    router.push('/auth/verify-otp?purpose=ACCOUNT_OPENING')
  }

  const verifyOTP = async (email: string, code: string, purpose: string) => {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Verification failed')
    }

    if (purpose === '2FA') {
      setUser(data.user)
      router.push('/dashboard')
    } else if (purpose === 'ACCOUNT_OPENING') {
      router.push('/auth/login?verified=true')
    }

    return data
  }

  const resendOTP = async (email: string, purpose: string) => {
    const response = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to resend code')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      signup,
      verifyOTP,
      resendOTP
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
EOF

# Create API routes
mkdir -p src/app/api/auth

# Signup API
cat > src/app/api/auth/signup/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTPEmail } from '@/lib/otp'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, accountType } = body

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        accountType,
        accounts: {
          create: {
            accountNumber: `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`,
            accountType: 'checking',
            balance: 0,
            currency: 'USD'
          }
        }
      }
    })

    // Generate and send OTP
    const otp = await generateOTP(email, 'ACCOUNT_OPENING')
    await sendOTPEmail(email, otp, 'ACCOUNT_OPENING')

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

# Login API
cat > src/app/api/auth/login/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTPEmail } from '@/lib/otp'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      const otp = await generateOTP(email, '2FA')
      await sendOTPEmail(email, otp, '2FA')
      
      return NextResponse.json({
        requiresTwoFactor: true,
        userId: user.id
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        firstName: user.firstName 
      },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '7d' }
    )

    const response = NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    })

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
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

# Verify OTP API
cat > src/app/api/auth/verify-otp/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code, purpose } = body

    // Find valid OTP
    const otp = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        purpose,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!otp) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      )
    }

    // Delete used OTP
    await prisma.oTP.delete({
      where: { id: otp.id }
    })

    if (purpose === 'ACCOUNT_OPENING') {
      await prisma.user.update({
        where: { email },
        data: { isVerified: true }
      })
      
      return NextResponse.json({ message: 'Email verified successfully' })
    }

    if (purpose === '2FA') {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          firstName: user.firstName 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const response = NextResponse.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType,
          isVerified: user.isVerified,
          twoFactorEnabled: user.twoFactorEnabled
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
    }

    return NextResponse.json({ message: 'OTP verified successfully' })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF

# Get current user API
cat > src/app/api/auth/me/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET!

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

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true,
        isVerified: true,
        twoFactorEnabled: true
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

echo "✅ Authentication system created!"
EOF