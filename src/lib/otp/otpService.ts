import { sendEmail, generateOTPEmail } from './emailService';

// Mock OTP storage (in production, use Redis or database)
const otpStore: Map<string, { code: string; expires: Date; attempts: number }> = new Map();

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP for a user
export const requestOTP = async (
  identifier: string,
  purpose: string
): Promise<{ success: boolean; requestId?: string; message?: string }> => {
  try {
    // Generate OTP
    const otp = generateOTP();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store OTP with 10-minute expiration
    otpStore.set(requestId, {
      code: otp,
      expires: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0
    });

    // For email identifiers
    if (identifier.includes('@')) {
      const emailContent = generateOTPEmail(otp);
      emailContent.to = identifier;
      await sendEmail(emailContent);
    }
    // For phone numbers (SMS) - implement SMS service here
    else {
      console.log(`📱 SMS would be sent to ${identifier} with code: ${otp}`);
      // Integrate with SMS service like Twilio here
    }

    return {
      success: true,
      requestId,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP'
    };
  }
};

// Verify OTP
export const verifyOTP = async (
  requestId: string,
  code: string
): Promise<boolean> => {
  const otpData = otpStore.get(requestId);
  
  if (!otpData) {
    return false;
  }

  // Check if expired
  if (new Date() > otpData.expires) {
    otpStore.delete(requestId);
    return false;
  }

  // Check attempts (max 3 attempts)
  if (otpData.attempts >= 3) {
    otpStore.delete(requestId);
    return false;
  }

  // Increment attempts
  otpData.attempts++;

  // Verify code
  if (otpData.code === code) {
    otpStore.delete(requestId);
    return true;
  }

  return false;
};

// Resend OTP
export const resendOTP = async (
  requestId: string,
  identifier: string
): Promise<{ success: boolean; newRequestId?: string; message?: string }> => {
  // Delete old OTP
  otpStore.delete(requestId);
  
  // Request new OTP
  return requestOTP(identifier, 'resend');
};
