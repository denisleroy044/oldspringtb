export interface OTPRequest {
  phoneNumber: string;
  purpose: 'transfer' | 'card' | 'login' | 'transaction';
  expiresAt: Date;
}

export interface OTPVerification {
  code: string;
  requestId: string;
  verified: boolean;
}
