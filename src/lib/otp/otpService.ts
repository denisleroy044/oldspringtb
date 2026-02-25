import { sendEmail, generateOTP, getOTPEmailTemplate } from './emailService';

interface OTPData {
  code: string;
  email: string;
  purpose: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

// Store OTPs in memory (in production, use Redis)
const otpStore: Map<string, OTPData> = new Map();

const MAX_ATTEMPTS = 3;
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

export async function requestOTP(email: string, purpose: string): Promise<{
  success: boolean;
  requestId?: string;
  message: string;
}> {
  try {
    // Generate OTP
    const otp = generateOTP();
    const requestId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store OTP
    otpStore.set(requestId, {
      code: otp,
      email,
      purpose,
      expiresAt: Date.now() + OTP_EXPIRY,
      attempts: 0,
      verified: false
    });

    // Send email
    const emailSent = await sendEmail({
      to: email,
      subject: `Your OTP for ${purpose}`,
      html: getOTPEmailTemplate(otp, purpose)
    });

    if (!emailSent) {
      return {
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      };
    }

    // Clean up old OTPs for this email
    for (const [id, data] of otpStore.entries()) {
      if (data.email === email && data.expiresAt < Date.now()) {
        otpStore.delete(id);
      }
    }

    return {
      success: true,
      requestId,
      message: 'OTP sent successfully to your email'
    };
  } catch (error) {
    console.error('OTP request error:', error);
    return {
      success: false,
      message: 'Failed to process OTP request'
    };
  }
}

export async function verifyOTP(
  requestId: string,
  code: string
): Promise<{
  success: boolean;
  message: string;
  email?: string;
}> {
  const otpData = otpStore.get(requestId);

  if (!otpData) {
    return {
      success: false,
      message: 'Invalid or expired OTP request'
    };
  }

  // Check if already verified
  if (otpData.verified) {
    return {
      success: false,
      message: 'OTP already verified'
    };
  }

  // Check expiry
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(requestId);
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.'
    };
  }

  // Check attempts
  if (otpData.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(requestId);
    return {
      success: false,
      message: 'Too many failed attempts. Please request a new OTP.'
    };
  }

  // Verify code
  if (otpData.code !== code) {
    otpData.attempts++;
    otpStore.set(requestId, otpData);
    
    const remainingAttempts = MAX_ATTEMPTS - otpData.attempts;
    return {
      success: false,
      message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
    };
  }

  // Success
  otpData.verified = true;
  otpStore.set(requestId, otpData);

  // Clean up after successful verification (optional)
  setTimeout(() => {
    otpStore.delete(requestId);
  }, 60000); // Remove after 1 minute

  return {
    success: true,
    message: 'OTP verified successfully',
    email: otpData.email
  };
}

export function isOTPVerified(requestId: string): boolean {
  const otpData = otpStore.get(requestId);
  return otpData?.verified || false;
}

export function clearOTP(requestId: string): void {
  otpStore.delete(requestId);
}
