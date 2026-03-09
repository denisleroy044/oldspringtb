// In-memory OTP store (in production, use database)
const otpStore = new Map<string, { code: string; expires: Date; attempts: number }>()

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function requestOTP(
  identifier: string,
  purpose: string,
  userName?: string
): Promise<{ success: boolean; requestId?: string; message?: string; error?: string }> {
  try {
    const otp = generateOTP()
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    
    otpStore.set(requestId, {
      code: otp,
      expires: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0
    })

    console.log('\n' + '🔐'.repeat(30))
    console.log('🔐 OTP GENERATED')
    console.log('🔐'.repeat(30))
    console.log(`📧 To: ${identifier}`)
    console.log(`📋 Purpose: ${purpose}`)
    console.log(`👤 Name: ${userName || 'Customer'}`)
    console.log(`🔑 Code: ${otp}`)
    console.log(`🆔 Request ID: ${requestId}`)
    console.log('🔐'.repeat(30) + '\n')

    // Call server API to send email (server-side only)
    if (typeof window === 'undefined') {
      // Server-side: import and use nodemailer directly
      const { sendOtpEmail } = await import('@/lib/server/email.server')
      await sendOtpEmail({
        to: identifier,
        firstName: userName || 'Customer',
        otp,
        purpose,
      })
    } else {
      // Client-side: call API route
      fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, otp, name: userName, purpose }),
      }).catch(err => console.error('Background email error:', err))
    }

    return {
      success: true,
      requestId,
      message: 'OTP sent successfully'
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return { success: false, error: 'Failed to send OTP' }
  }
}

export async function verifyOTP(
  requestId: string,
  code: string
): Promise<boolean> {
  const otpData = otpStore.get(requestId)
  
  if (!otpData) {
    console.log('❌ OTP verification failed: No request ID found')
    return false
  }

  // Check if expired
  if (new Date() > otpData.expires) {
    console.log('❌ OTP verification failed: Code expired')
    otpStore.delete(requestId)
    return false
  }

  // Check attempts (max 3 attempts)
  if (otpData.attempts >= 3) {
    console.log('❌ OTP verification failed: Too many attempts')
    otpStore.delete(requestId)
    return false
  }

  // Increment attempts
  otpData.attempts++

  // Verify code
  const isValid = otpData.code === code
  console.log(`🔐 OTP verification: ${isValid ? '✅ SUCCESS' : '❌ FAILED'} (Attempt ${otpData.attempts}/3)`)
  
  if (isValid) {
    otpStore.delete(requestId)
    return true
  }

  return false
}

export async function resendOTP(
  requestId: string,
  identifier: string,
  userName?: string
): Promise<{ success: boolean; newRequestId?: string; error?: string }> {
  otpStore.delete(requestId)
  const result = await requestOTP(identifier, 'resend', userName)
  return result
}
