import nodemailer from 'nodemailer';

// Create transporter based on environment
const createTransporter = () => {
  // For development/testing - use ethereal.email (fake SMTP)
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_EMAIL || 'your-ethereal-email',
        pass: process.env.ETHEREAL_PASSWORD || 'your-ethereal-password'
      }
    });
  }

  // For production - use real SMTP (Gmail, SendGrid, etc.)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Generate OTP email template
export const generateOTPEmail = (otp: string, userName?: string): EmailOptions => {
  return {
    to: '', // Will be filled by caller
    subject: 'Your Oldspring Trust Verification Code',
    text: `Your verification code is: ${otp}. This code will expire in 10 minutes. Never share this code with anyone.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oldspring Trust Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #013220, #5F8B4C); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Oldspring Trust</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Since 1945</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background: #f9f9f9;">
            <h2 style="color: #013220; margin-top: 0;">Your Verification Code</h2>
            <p style="font-size: 16px;">Hello ${userName || 'Valued Customer'},</p>
            <p style="font-size: 16px;">Your verification code is:</p>
            
            <div style="background: white; padding: 20px; text-align: center; font-size: 36px; letter-spacing: 8px; font-weight: bold; color: #013220; border-radius: 8px; margin: 25px 0; border: 2px solid #FFD700;">
              ${otp}
            </div>
            
            <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>. Never share this code with anyone, including Oldspring Trust employees.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999;">If you didn't request this code, please ignore this email or contact our support team immediately at <a href="mailto:support@oldspring.com" style="color: #013220;">support@oldspring.com</a></p>
          </div>
          
          <!-- Footer -->
          <div style="background: #013220; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Oldspring Trust. All rights reserved.</p>
            <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 11px;">100 Bishopsgate, London</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send real email
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Oldspring Trust" <noreply@oldspring.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('📧 Email sent:', info.messageId);
    
    // For ethereal.email - log preview URL
    if (process.env.NODE_ENV === 'development' && info.messageId) {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};
