import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp/otpService'
import { signJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId, code, purpose, requestId } = await req.json()
    
    // Verify OTP
    const isValid = await verifyOTP(requestId || userId, code)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 })
    }
    
    // Get user from database
    const userRes = await query(
      `SELECT id, email, "firstName", "lastName", role, "twoFactorEnabled", "emailVerified" 
       FROM users WHERE id = $1`,
      [userId]
    )
    
    const user = userRes.rows[0]
    
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }
    
    // Update email verification status if this is account opening
    if (purpose === 'ACCOUNT_OPENING') {
      await query(
        'UPDATE users SET "emailVerified" = true WHERE id = $1',
        [userId]
      )
    }
    
    // Generate JWT token
    const token = await signJWT({ 
      userId: user.id, 
      email: user.email, 
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role 
    })
    
    const res = NextResponse.json({ 
      success: true, 
      role: user.role,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled
      }
    })
    
    res.cookies.set('auth-token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      maxAge: 60 * 60 * 24 * 7, 
      path: '/' 
    })
    
    return res
  } catch (e) {
    console.error('[verify-otp]', e)
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 })
  }
}
