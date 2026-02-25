// Email service for OTP verification
export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Mock email sending function (replace with real email service in production)
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  console.log('📧 Email sent:', options);
  // In production, integrate with a real email service like SendGrid, AWS SES, etc.
  return true;
};

// Generate OTP email template
export const generateOTPEmail = (otp: string, userName?: string): EmailOptions => {
  return {
    to: '', // Will be filled by caller
    subject: 'Your Oldspring Trust Verification Code',
    text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #013220, #5F8B4C); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Oldspring Trust</h1>
        </div>
        <div style="background: #f5f5f5; padding: 30px;">
          <h2 style="color: #013220;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #333;">Hello ${userName || 'Valued Customer'},</p>
          <p style="font-size: 16px; color: #333;">Your verification code is:</p>
          <div style="background: white; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #013220; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes. Never share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">If you didn't request this code, please ignore this email or contact support.</p>
        </div>
        <div style="background: #013220; padding: 15px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Oldspring Trust. All rights reserved.</p>
        </div>
      </div>
    `
  };
};
