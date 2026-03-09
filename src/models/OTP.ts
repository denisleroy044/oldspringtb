import mongoose from 'mongoose';

export interface IOTP {
  email: string;
  code: string;
  purpose: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema<IOTP>({
  email: { 
    type: String, 
    required: true,
    index: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  purpose: { 
    type: String, 
    required: true,
    enum: ['ACCOUNT_OPENING', '2FA', 'PASSWORD_RESET']
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: 0 } // TTL index - auto-delete after expiry
  }
}, {
  timestamps: true
});

// Compound index for lookups
otpSchema.index({ email: 1, purpose: 1 });

export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);
