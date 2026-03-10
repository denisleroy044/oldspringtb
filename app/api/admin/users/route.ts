import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/neon-adapter'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Fetching users...')
    const users = await db.getUsers()
    console.log(`✅ Found ${users.length} users`)
    
    // Log first user for debugging
    if (users.length > 0) {
      console.log('Sample user:', JSON.stringify(users[0], null, 2))
    }
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, updates } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('📝 Updating user:', userId, updates)
    
    // Update user in database
    const result = await db.updateUser(userId, updates)

    return NextResponse.json({ 
      success: true,
      user: result 
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
