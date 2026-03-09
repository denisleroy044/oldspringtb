import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    // Get user's current password
    const result = await query(
      `SELECT password FROM users WHERE id = $1`,
      [payload.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = result.rows[0]

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and updatedAt
    await query(
      `UPDATE users 
       SET password = $1, "updatedAt" = NOW() 
       WHERE id = $2`,
      [hashedPassword, payload.userId]
    )

    // Update security settings password last changed
    // First check if security_settings table exists
    try {
      // Check if record exists
      const checkResult = await query(
        `SELECT id FROM security_settings WHERE user_id = $1`,
        [payload.userId]
      )

      if (checkResult.rows.length > 0) {
        // Update existing record
        await query(
          `UPDATE security_settings 
           SET password_last_changed = NOW(), updated_at = NOW()
           WHERE user_id = $1`,
          [payload.userId]
        )
        console.log('Updated password_last_changed for user:', payload.userId)
      } else {
        // Insert new record
        await query(
          `INSERT INTO security_settings (user_id, password_last_changed, created_at, updated_at)
           VALUES ($1, NOW(), NOW(), NOW())`,
          [payload.userId]
        )
        console.log('Created security_settings with password_last_changed for user:', payload.userId)
      }
    } catch (error) {
      // Security settings table might not exist yet - create it
      console.log('Security settings table error:', error)
      try {
        await query(`
          CREATE TABLE IF NOT EXISTS security_settings (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            two_factor_enabled BOOLEAN DEFAULT false,
            two_factor_method TEXT,
            remember_me BOOLEAN DEFAULT true,
            session_timeout INTEGER DEFAULT 30,
            max_sessions INTEGER DEFAULT 5,
            login_alerts BOOLEAN DEFAULT true,
            suspicious_activity_alerts BOOLEAN DEFAULT true,
            password_last_changed TIMESTAMP,
            password_expiry_days INTEGER DEFAULT 90,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id)
          )
        `)
        
        // Now insert the record
        await query(
          `INSERT INTO security_settings (user_id, password_last_changed, created_at, updated_at)
           VALUES ($1, NOW(), NOW(), NOW())`,
          [payload.userId]
        )
        console.log('Created security_settings table and record for user:', payload.userId)
      } catch (createError) {
        console.error('Failed to create security_settings table:', createError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
