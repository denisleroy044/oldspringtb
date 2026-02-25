import { NextResponse } from 'next/server'
import { Resend } from 'resend';

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { email, otp, name } = await request.json()
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // For development - log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV] OTP:', otp, 'for:', email, 'Name:', name)
      return NextResponse.json({ 
        success: true, 
        messageId: 'dev-mode',
        message: 'OTP sent successfully (dev mode)' 
      })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Oldspring Trust <onboarding@resend.dev>',
      to: email,
      subject: 'Your Oldspring Trust Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              <p style="font-size: 16px;">Hello ${name || 'Valued Customer'},</p>
              <p style="font-size: 16px;">Your verification code is:</p>
              
              <div style="background: white; padding: 20px; text-align: center; font-size: 36px; letter-spacing: 8px; font-weight: bold; color: #013220; border-radius: 8px; margin: 25px 0; border: 2px solid #FFD700;">
                ${otp}
              </div>
              
              <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>. Never share this code with anyone.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999;">If you didn't request this code, please ignore this email.</p>
            </div>
            
            <!-- Footer -->
            <div style="background: #013220; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Oldspring Trust. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // Check for errors
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Success response - Resend returns data with id
    return NextResponse.json({ 
      success: true, 
      messageId: data?.id || 'unknown',
      message: 'OTP sent successfully' 
    });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
