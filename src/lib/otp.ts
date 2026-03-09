// In-memory OTP store (plain JavaScript object, not TypeScript type annotations in runtime)
const otpStore = new Map()

export function generateOTP(): string {
  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  console.log('\n🔑 [OTP GENERATED]:', code)
  return code
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

    console.log('\n' + '='.repeat(50))
    console.log('📧 OTP REQUEST')
    console.log('='.repeat(50))
    console.log(`📧 To: ${identifier}`)
    console.log(`📧 Purpose: ${purpose}`)
    console.log(`📧 Name: ${userName || 'Customer'}`)
    console.log(`🔑 Code: ${otp}`)
    console.log(`🆔 Request ID: ${requestId}`)
    console.log('='.repeat(50) + '\n')

    // For email
    if (identifier.includes('@')) {
      // Call our API route
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      fetch(`${baseUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: identifier, 
          otp,
          name: userName 
        })
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
  console.log('🔄 Resending OTP for:', identifier)
  otpStore.delete(requestId)
  const result = await requestOTP(identifier, 'resend', userName)
  return result
}
