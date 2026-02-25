export interface OTPResponse {
  success: boolean;
  requestId?: string;
  message: string;
  expiresIn?: number;
}

const otpStore: Map<string, { code: string; expiresAt: number; verified: boolean }> = new Map();

export const requestOTP = async (phoneNumber: string, purpose: string): Promise<OTPResponse> => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const requestId = `OTP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(requestId, {
    code: otpCode,
    expiresAt,
    verified: false
  });

  console.log(`📱 OTP for ${purpose}: ${otpCode} (expires in 5 minutes)`);

  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    requestId,
    message: 'OTP sent successfully',
    expiresIn: 300
  };
};

export const verifyOTP = async (requestId: string, code: string): Promise<boolean> => {
  const otpData = otpStore.get(requestId);
  
  if (!otpData) return false;
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(requestId);
    return false;
  }

  const isValid = otpData.code === code;
  if (isValid) {
    otpData.verified = true;
    otpStore.set(requestId, otpData);
  }

  return isValid;
};

export const clearOTP = (requestId: string): void => {
  otpStore.delete(requestId);
};
