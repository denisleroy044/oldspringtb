import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// In-memory user storage (replace with real database in production)
let users: any[] = [
  {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    name: 'Test User',
    email: 'user@example.com',
    password: '$2a$10$YourHashedPasswordHere', // You'll need to create this
    role: 'USER',
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

    // Find user
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // For demo purposes - accept password123
    const isValidPassword = password === 'password123'
    
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
