import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email: string, otp: string, purpose: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Oldspring Trust <onboarding@resend.dev>', // Use this for testing
      to: email,
      subject: `Your ${purpose} Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #006F87;">Oldspring Trust</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #D9B648; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: 1px solid #7E9C76;" />
          <p style="color: #666; font-size: 12px;">© 2025 Oldspring Trust. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
