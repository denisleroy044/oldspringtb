import { NextRequest, NextResponse } from 'next/server'
import { sendOtpEmail } from '@/lib/server/email.server'

export async function POST(req: NextRequest) {
  try {
    const { email, otp, name, purpose } = await req.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }
    
    // Send real email using server-only utility
    const result = await sendOtpEmail({
      to: email,
      firstName: name || 'Customer',
      otp,
      purpose: purpose || 'ACCOUNT_OPENING',
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  }
}
