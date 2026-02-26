import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Mock user database (in production, use a real database)
// This should match the users from signup
let users: any[] = [
  {
    id: 'admin_1',
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@oldspring.com',
    password: '$2a$10$YourHashedPasswordHere', // You'll need to hash this properly
    role: 'ADMIN',
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    // Note: In production, you'd compare with hashed password
    // For now, we'll do a simple check
    const isValidPassword = password === 'password123' || await bcrypt.compare(password, user.password).catch(() => false)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userWithoutPassword 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
