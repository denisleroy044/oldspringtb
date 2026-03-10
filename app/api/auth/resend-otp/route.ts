import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requestOTP } from '@/lib/otp/otpService'

const rateLimitMap = new Map<string, number[]>()

export async function POST(req: NextRequest) {
  try {
    const { userId, purpose, requestId } = await req.json()
    
    // Rate limiting
    const now = Date.now()
    const attempts = (rateLimitMap.get(userId) || []).filter(t => now - t < 600_000)
    
    if (attempts.length >= 3) {
      return NextResponse.json({ error: 'Too many requests. Please wait before retrying.' }, { status: 429 })
    }
    
    rateLimitMap.set(userId, [...attempts, now])
    
    // Get user from database
    const userRes = await query(
      'SELECT email, "firstName", "lastName" FROM users WHERE id = $1',
      [userId]
    )
    
    const user = userRes.rows[0]
    
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }
    
    // Generate and send new OTP
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
    const otpResult = await requestOTP(user.email, purpose, fullName || 'User')
    
    return NextResponse.json({ 
      success: true, 
      requestId: otpResult.requestId 
    })
  } catch {
    return NextResponse.json({ error: 'Failed to resend code.' }, { status: 500 })
  }
}
