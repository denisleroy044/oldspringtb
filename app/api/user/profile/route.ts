import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await req.json()

    console.log('Updating profile for user:', payload.userId)
    console.log('Data:', data)

    // First, check if the columns exist by trying a simple update
    try {
      await query(
        `UPDATE users SET
          "firstName" = $1,
          "lastName" = $2,
          email = $3,
          phone = $4,
          "updatedAt" = NOW()
        WHERE id = $5`,
        [
          data.firstName,
          data.lastName,
          data.email,
          data.phone,
          payload.userId
        ]
      )
      console.log('Basic profile update successful')
    } catch (basicError) {
      console.error('Basic update failed:', basicError)
      throw basicError
    }

    // Try to update address fields if they exist
    try {
      await query(
        `UPDATE users SET
          address_line1 = $1,
          address_line2 = $2,
          city = $3,
          state = $4,
          postal_code = $5,
          country = $6,
          date_of_birth = $7
        WHERE id = $8`,
        [
          data.addressLine1 || null,
          data.addressLine2 || null,
          data.city || null,
          data.state || null,
          data.postalCode || null,
          data.country || 'US',
          data.dateOfBirth || null,
          payload.userId
        ]
      )
      console.log('Address fields updated successfully')
    } catch (addressError) {
      console.log('Address fields may not exist yet:', addressError)
      // If address fields don't exist, we'll add them
      try {
        await query(
          `ALTER TABLE users 
           ADD COLUMN IF NOT EXISTS address_line1 TEXT,
           ADD COLUMN IF NOT EXISTS address_line2 TEXT,
           ADD COLUMN IF NOT EXISTS city TEXT,
           ADD COLUMN IF NOT EXISTS state TEXT,
           ADD COLUMN IF NOT EXISTS postal_code TEXT,
           ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US',
           ADD COLUMN IF NOT EXISTS date_of_birth DATE,
           ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`
        )
        console.log('Added missing columns to users table')
        
        // Retry the update
        await query(
          `UPDATE users SET
            address_line1 = $1,
            address_line2 = $2,
            city = $3,
            state = $4,
            postal_code = $5,
            country = $6,
            date_of_birth = $7
          WHERE id = $8`,
          [
            data.addressLine1 || null,
            data.addressLine2 || null,
            data.city || null,
            data.state || null,
            data.postalCode || null,
            data.country || 'US',
            data.dateOfBirth || null,
            payload.userId
          ]
        )
      } catch (alterError) {
        console.error('Failed to add columns:', alterError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
