require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('📧 Testing Gmail SMTP connection...');
  console.log('📧 User:', process.env.SMTP_USER);
  console.log('📧 Password length:', process.env.SMTP_PASS?.length);
  console.log('📧 Password (first 4 chars):', process.env.SMTP_PASS?.substring(0, 4) + '...');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Add timeouts to prevent hanging
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
  });

  try {
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Try sending a test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Oldspring Trust Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: '✅ Test Email from Oldspring Trust',
      text: 'If you receive this email, your SMTP configuration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #1a3a5c, #2E8B57); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #c9a84c; margin: 0;">Oldspring Trust</h1>
          </div>
          <div style="padding: 30px 20px; background: #f9f9f9;">
            <h2 style="color: #1a3a5c;">Email Configuration Test</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Great news! Your email configuration is working properly. Users will now receive OTP codes and notifications.
            </p>
            <div style="background: #e8f5e9; border-left: 4px solid #2E8B57; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #1a3a5c; font-weight: bold;">✅ SMTP Configuration Successful</p>
              <p style="margin: 5px 0 0; color: #555; font-size: 14px;">Your Gmail App Password is working correctly.</p>
            </div>
          </div>
          <div style="background: #1a3a5c; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: white; margin: 0; font-size: 12px;">© 2026 Oldspring Trust • This is a test email</p>
          </div>
        </div>
      `,
    });
    
    console.log('✅ Test email sent! Message ID:', info.messageId);
    console.log('📧 Check your inbox at', process.env.SMTP_USER);
    console.log('   (Check spam folder if not in inbox)');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Verify your App Password is correct (16 characters, no spaces)');
    console.log('   2. Make sure 2-Factor Authentication is enabled on your Google account');
    console.log('   3. Check if Google has blocked the app at https://myaccount.google.com/security');
    console.log('   4. Try generating a new App Password at https://myaccount.google.com/apppasswords');
    console.log('   5. If using VPN, try disabling it temporarily');
  }
}

testEmail();
