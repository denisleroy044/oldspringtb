require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('📧 Testing email configuration...');
  console.log('📧 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('📧 SMTP_USER:', process.env.SMTP_USER);
  console.log('📧 SMTP_PASS length:', process.env.SMTP_PASS?.length);
  console.log('📧 SMTP_PASS first 4 chars:', process.env.SMTP_PASS?.substring(0, 4) + '...');

  // Test Gmail SMTP directly
  if (process.env.SMTP_PASS && process.env.SMTP_PASS.length > 10) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      console.log('🔄 Testing Gmail SMTP...');
      await transporter.verify();
      console.log('✅ Gmail SMTP connection successful!');
      
      // Send test email
      const info = await transporter.sendMail({
        from: `"Oldspring Trust" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: '✅ Test Email from Oldspring Trust',
        text: 'Your email configuration is working!',
      });
      console.log('✅ Test email sent! Check your inbox.');
    } catch (error) {
      console.log('❌ Gmail SMTP failed:', error.message);
    }
  }

  // Test Resend if API key exists
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('🔄 Testing Resend...');
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: 'Oldspring Trust <onboarding@resend.dev>',
        to: [process.env.SMTP_USER || 'test@example.com'],
        subject: '✅ Test Email from Resend',
        html: '<p>Your Resend configuration is working!</p>',
      });

      if (error) {
        console.log('❌ Resend failed:', error.message);
      } else {
        console.log('✅ Resend test email sent! ID:', data?.id);
      }
    } catch (error) {
      console.log('❌ Resend error:', error.message);
    }
  }
}

testEmail();
