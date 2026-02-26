import { NextResponse } from 'next/server'

// In-memory user storage (same as login)
let users: any[] = [
  {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    name: 'Test User',
    email: 'user@example.com',
    password: 'hashed_password',
    role: 'USER',
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password, accountType } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      password: 'hashed_' + password, // In production, use bcrypt
      role: accountType === 'business' ? 'BUSINESS' : 'USER',
      twoFactorEnabled: false,
      accountType,
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
