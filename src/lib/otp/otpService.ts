import { sendEmail, generateOTPEmail } from './emailService';

// In production, use Redis or database
const otpStore: Map<string, { code: string; expires: Date; attempts: number }> = new Map();

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP for a user
export const requestOTP = async (
  identifier: string,
  purpose: string
): Promise<{ success: boolean; requestId?: string; message?: string; error?: string }> => {
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

    // Send via email
    if (identifier.includes('@')) {
      const emailContent = generateOTPEmail(otp, purpose === '2fa' ? 'User' : undefined);
      emailContent.to = identifier;
      
      const result = await sendEmail(emailContent);
      
      if (!result.success) {
        otpStore.delete(requestId);
        return { 
          success: false, 
          error: result.error || 'Failed to send email'
        };
      }
      
      console.log(`✅ OTP sent to ${identifier} for ${purpose}`);
    } 
    // Send via SMS (if you have Twilio set up)
    else if (identifier.match(/^\+?[1-9]\d{1,14}$/)) {
      // Implement SMS sending here with Twilio
      console.log(`📱 SMS would be sent to ${identifier} with code: ${otp}`);
      // await sendSMS(identifier, `Your Oldspring Trust verification code is: ${otp}`);
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
      error: 'Failed to send OTP'
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
): Promise<{ success: boolean; newRequestId?: string; error?: string }> => {
  // Delete old OTP
  otpStore.delete(requestId);
  
  // Request new OTP
  return requestOTP(identifier, 'resend');
};
