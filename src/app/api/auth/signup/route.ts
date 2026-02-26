import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Mock user database (replace with real database in production)
let users: any[] = []

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      password: hashedPassword,
      role: 'USER',
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(newUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
