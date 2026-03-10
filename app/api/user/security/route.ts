import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if security_settings table exists
    try {
      await query(`SELECT 1 FROM security_settings LIMIT 1`)
    } catch (tableError) {
      // Table doesn't exist, return default settings
      return NextResponse.json({ 
        settings: {
          twoFactorEnabled: false,
          twoFactorMethod: 'app',
          rememberMe: true,
          sessionTimeout: 30,
          maxSessions: 5,
          loginAlerts: true,
          suspiciousActivityAlerts: true,
          passwordLastChanged: null,
          passwordExpiryDays: 90
        }
      })
    }

    // Get security settings
    const result = await query(
      `SELECT 
        two_factor_enabled as "twoFactorEnabled",
        two_factor_method as "twoFactorMethod",
        remember_me as "rememberMe",
        session_timeout as "sessionTimeout",
        max_sessions as "maxSessions",
        login_alerts as "loginAlerts",
        suspicious_activity_alerts as "suspiciousActivityAlerts",
        password_last_changed as "passwordLastChanged",
        password_expiry_days as "passwordExpiryDays"
       FROM security_settings 
       WHERE user_id = $1`,
      [payload.userId]
    )

    if (result.rows.length === 0) {
      // Create default settings
      await query(
        `INSERT INTO security_settings (user_id) VALUES ($1)`,
        [payload.userId]
      )
      
      return NextResponse.json({ 
        settings: {
          twoFactorEnabled: false,
          twoFactorMethod: 'app',
          rememberMe: true,
          sessionTimeout: 30,
          maxSessions: 5,
          loginAlerts: true,
          suspiciousActivityAlerts: true,
          passwordLastChanged: null,
          passwordExpiryDays: 90
        }
      })
    }

    return NextResponse.json({ settings: result.rows[0] })
  } catch (error) {
    console.error('Error fetching security settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM security_settings LIMIT 1`)
    } catch (tableError) {
      // Create the table
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
    }

    // Check if settings exist
    const checkResult = await query(
      `SELECT id FROM security_settings WHERE user_id = $1`,
      [payload.userId]
    )

    if (checkResult.rows.length === 0) {
      // Insert new settings
      await query(
        `INSERT INTO security_settings (
          user_id, two_factor_enabled, two_factor_method, remember_me,
          session_timeout, max_sessions, login_alerts, suspicious_activity_alerts,
          password_expiry_days, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          payload.userId,
          data.twoFactorEnabled || false,
          data.twoFactorMethod || 'app',
          data.rememberMe !== false,
          data.sessionTimeout || 30,
          data.maxSessions || 5,
          data.loginAlerts !== false,
          data.suspiciousActivityAlerts !== false,
          data.passwordExpiryDays || 90
        ]
      )
    } else {
      // Update existing settings
      await query(
        `UPDATE security_settings SET
          two_factor_enabled = $1,
          two_factor_method = $2,
          remember_me = $3,
          session_timeout = $4,
          max_sessions = $5,
          login_alerts = $6,
          suspicious_activity_alerts = $7,
          password_expiry_days = $8,
          updated_at = NOW()
        WHERE user_id = $9`,
        [
          data.twoFactorEnabled || false,
          data.twoFactorMethod || 'app',
          data.rememberMe !== false,
          data.sessionTimeout || 30,
          data.maxSessions || 5,
          data.loginAlerts !== false,
          data.suspiciousActivityAlerts !== false,
          data.passwordExpiryDays || 90,
          payload.userId
        ]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating security settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
