import nodemailer from 'nodemailer'

// This file uses 'server-only' to ensure it's never imported on the client
import 'server-only'

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
})

const purposeLabels: Record<string, string> = {
  ACCOUNT_OPENING: 'Verify Your Email',
  '2FA': 'Login Verification Code',
  PASSWORD_RESET: 'Reset Your Password',
  TRANSFER: 'Transfer Verification',
  DEPOSIT: 'Deposit Verification',
  WITHDRAWAL: 'Withdrawal Verification',
}

export async function sendOtpEmail({
  to,
  firstName,
  otp,
  purpose,
}: {
  to: string
  firstName: string
  otp: string
  purpose: string
}): Promise<{ success: boolean; messageId?: string }> {
  const subject = purposeLabels[purpose] || 'Your Verification Code'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Oldspring Trust Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f9; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #006F87 0%, #7E9C76 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #D9B648; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px;">OLDSPRING TRUST</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Private Banking & Wealth Management</p>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #006F87; font-size: 18px; font-weight: 600; margin: 0 0 8px;">Dear ${firstName},</p>
                  <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                    ${purpose === 'ACCOUNT_OPENING' 
                      ? 'Thank you for choosing Oldspring Trust. Please verify your email address to complete your account registration.'
                      : purpose === '2FA'
                      ? 'We detected a login attempt to your account. Use the code below to complete your sign-in.'
                      : 'Please use the verification code below to complete your request.'}
                  </p>

                  <!-- OTP Code Box with Soft Gold border -->
                  <div style="background: #f8fafc; border: 2px solid #D9B648; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Verification Code</p>
                    <div style="display: inline-block; background: #ffffff; border-radius: 12px; padding: 15px 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                      <p style="color: #006F87; font-size: 42px; font-weight: 800; letter-spacing: 10px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; margin: 16px 0 0;">
                      ⏱️ This code expires in <strong style="color: #D9B648;">10 minutes</strong>
                    </p>
                  </div>

                  <!-- Security Notice -->
                  <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 30px 0;">
                    <p style="color: #006F87; font-size: 14px; font-weight: 600; margin: 0 0 8px;">🔒 Security Tip</p>
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                      Never share this code with anyone. Oldspring Trust employees will never ask for your verification code.
                    </p>
                  </div>

                  <!-- Divider -->
                  <div style="border-top: 1px solid #D9B64830; margin: 30px 0;"></div>

                  <!-- Footer Info -->
                  <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">
                    If you didn't request this code, please ignore this email or contact our support team at 
                    <a href="mailto:support@oldspringtrust.com" style="color: #D9B648; text-decoration: none; font-weight: 500;">support@oldspringtrust.com</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #006F87; padding: 30px; text-align: center;">
                  <p style="color: #D9B648; margin: 0 0 8px; font-size: 16px; font-weight: 500;">Oldspring Trust Bank</p>
                  <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">100 Bishopsgate, London EC2N 4AG</p>
                  <p style="color: rgba(255,255,255,0.4); margin: 16px 0 0; font-size: 11px;">
                    © ${new Date().getFullYear()} Oldspring Trust. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    console.log(`📧 Sending OTP email to ${to}...`)
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Oldspring Trust" <${process.env.SMTP_USER}>`,
      to,
      subject: `🔐 ${subject} - Oldspring Trust`,
      html,
    })
    
    console.log(`✅ OTP email sent successfully to ${to} (ID: ${info.messageId})`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error)
    return { success: false }
  }
}
