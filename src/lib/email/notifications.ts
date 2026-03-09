import { Pool } from 'pg'
import nodemailer from 'nodemailer'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function getAdminEmail() {
  try {
    const result = await pool.query(
      'SELECT value FROM public.settings WHERE key = $1',
      ['admin_email']
    );
    return result.rows[0]?.value || 'admin@oldspringtrust.com';
  } catch (error) {
    console.error('Error getting admin email:', error);
    return 'admin@oldspringtrust.com';
  }
}

export async function sendEmailNotification({
  type,
  recipientEmail,
  subject,
  message,
  metadata = {}
}: {
  type: string;
  recipientEmail: string;
  subject: string;
  message: string;
  metadata?: any;
}) {
  try {
    // Save to database
    const result = await pool.query(
      `INSERT INTO public.email_notifications 
       (type, "recipientEmail", subject, message, metadata, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id`,
      [type, recipientEmail, subject, message, metadata]
    );

    const notificationId = result.rows[0].id;

    // Send email if SMTP configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Oldspring Trust" <noreply@oldspringtrust.com>',
          to: recipientEmail,
          subject: subject,
          html: message
        });

        // Update status to sent
        await pool.query(
          'UPDATE public.email_notifications SET status = $1, "sentAt" = NOW() WHERE id = $2',
          ['sent', notificationId]
        );
      } catch (error: any) {
        // Update status to failed
        await pool.query(
          'UPDATE public.email_notifications SET status = $1, error = $2 WHERE id = $3',
          ['failed', error.message, notificationId]
        );
        throw error;
      }
    }

    return { success: true, notificationId };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error };
  }
}

export async function notifyAdmin({
  type,
  subject,
  message,
  metadata = {}
}: {
  type: string;
  subject: string;
  message: string;
  metadata?: any;
}) {
  const adminEmail = await getAdminEmail();
  return sendEmailNotification({
    type,
    recipientEmail: adminEmail,
    subject: `[Admin] ${subject}`,
    message,
    metadata
  });
}
