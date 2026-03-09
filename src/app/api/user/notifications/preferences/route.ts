import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if table exists
    try {
      await query(`SELECT 1 FROM notification_preferences LIMIT 1`)
    } catch (tableError) {
      // Table doesn't exist, return default preferences
      return NextResponse.json({ 
        preferences: {
          emailNotifications: true,
          emailTransactions: true,
          emailPromotions: false,
          emailSecurity: true,
          emailNewsletter: false,
          pushNotifications: true,
          pushTransactions: true,
          pushSecurity: true,
          pushReminders: true,
          smsNotifications: false,
          smsTransactions: false,
          smsSecurity: true,
          inAppNotifications: true,
          inAppTransactions: true,
          inAppSecurity: true,
          inAppPromotions: false,
          marketingEmails: false,
          shareData: false
        }
      })
    }

    // Get user preferences
    const result = await query(
      `SELECT 
        email_notifications as "emailNotifications",
        email_transactions as "emailTransactions",
        email_promotions as "emailPromotions",
        email_security as "emailSecurity",
        email_newsletter as "emailNewsletter",
        push_notifications as "pushNotifications",
        push_transactions as "pushTransactions",
        push_security as "pushSecurity",
        push_reminders as "pushReminders",
        sms_notifications as "smsNotifications",
        sms_transactions as "smsTransactions",
        sms_security as "smsSecurity",
        in_app_notifications as "inAppNotifications",
        in_app_transactions as "inAppTransactions",
        in_app_security as "inAppSecurity",
        in_app_promotions as "inAppPromotions",
        marketing_emails as "marketingEmails",
        share_data as "shareData"
       FROM notification_preferences 
       WHERE user_id = $1`,
      [payload.userId]
    )

    if (result.rows.length === 0) {
      // Create default preferences
      await query(
        `INSERT INTO notification_preferences (user_id) VALUES ($1)`,
        [payload.userId]
      )
      
      return NextResponse.json({ 
        preferences: {
          emailNotifications: true,
          emailTransactions: true,
          emailPromotions: false,
          emailSecurity: true,
          emailNewsletter: false,
          pushNotifications: true,
          pushTransactions: true,
          pushSecurity: true,
          pushReminders: true,
          smsNotifications: false,
          smsTransactions: false,
          smsSecurity: true,
          inAppNotifications: true,
          inAppTransactions: true,
          inAppSecurity: true,
          inAppPromotions: false,
          marketingEmails: false,
          shareData: false
        }
      })
    }

    return NextResponse.json({ preferences: result.rows[0] })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ 
      preferences: {
        emailNotifications: true,
        emailTransactions: true,
        emailPromotions: false,
        emailSecurity: true,
        emailNewsletter: false,
        pushNotifications: true,
        pushTransactions: true,
        pushSecurity: true,
        pushReminders: true,
        smsNotifications: false,
        smsTransactions: false,
        smsSecurity: true,
        inAppNotifications: true,
        inAppTransactions: true,
        inAppSecurity: true,
        inAppPromotions: false,
        marketingEmails: false,
        shareData: false
      }
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await req.json()

    // Check if table exists
    try {
      await query(`SELECT 1 FROM notification_preferences LIMIT 1`)
    } catch (tableError) {
      // Create the table
      await query(`
        CREATE TABLE IF NOT EXISTS notification_preferences (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          email_notifications BOOLEAN DEFAULT true,
          email_transactions BOOLEAN DEFAULT true,
          email_promotions BOOLEAN DEFAULT false,
          email_security BOOLEAN DEFAULT true,
          email_newsletter BOOLEAN DEFAULT false,
          push_notifications BOOLEAN DEFAULT true,
          push_transactions BOOLEAN DEFAULT true,
          push_security BOOLEAN DEFAULT true,
          push_reminders BOOLEAN DEFAULT true,
          sms_notifications BOOLEAN DEFAULT false,
          sms_transactions BOOLEAN DEFAULT false,
          sms_security BOOLEAN DEFAULT true,
          in_app_notifications BOOLEAN DEFAULT true,
          in_app_transactions BOOLEAN DEFAULT true,
          in_app_security BOOLEAN DEFAULT true,
          in_app_promotions BOOLEAN DEFAULT false,
          marketing_emails BOOLEAN DEFAULT false,
          share_data BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id)
        )
      `)
    }

    // Check if preferences exist
    const checkResult = await query(
      `SELECT id FROM notification_preferences WHERE user_id = $1`,
      [payload.userId]
    )

    if (checkResult.rows.length === 0) {
      // Insert new preferences
      await query(
        `INSERT INTO notification_preferences (
          user_id,
          email_notifications, email_transactions, email_promotions, email_security, email_newsletter,
          push_notifications, push_transactions, push_security, push_reminders,
          sms_notifications, sms_transactions, sms_security,
          in_app_notifications, in_app_transactions, in_app_security, in_app_promotions,
          marketing_emails, share_data,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())`,
        [
          payload.userId,
          data.emailNotifications ?? true,
          data.emailTransactions ?? true,
          data.emailPromotions ?? false,
          data.emailSecurity ?? true,
          data.emailNewsletter ?? false,
          data.pushNotifications ?? true,
          data.pushTransactions ?? true,
          data.pushSecurity ?? true,
          data.pushReminders ?? true,
          data.smsNotifications ?? false,
          data.smsTransactions ?? false,
          data.smsSecurity ?? true,
          data.inAppNotifications ?? true,
          data.inAppTransactions ?? true,
          data.inAppSecurity ?? true,
          data.inAppPromotions ?? false,
          data.marketingEmails ?? false,
          data.shareData ?? false
        ]
      )
    } else {
      // Update existing preferences
      await query(
        `UPDATE notification_preferences SET
          email_notifications = $1,
          email_transactions = $2,
          email_promotions = $3,
          email_security = $4,
          email_newsletter = $5,
          push_notifications = $6,
          push_transactions = $7,
          push_security = $8,
          push_reminders = $9,
          sms_notifications = $10,
          sms_transactions = $11,
          sms_security = $12,
          in_app_notifications = $13,
          in_app_transactions = $14,
          in_app_security = $15,
          in_app_promotions = $16,
          marketing_emails = $17,
          share_data = $18,
          updated_at = NOW()
        WHERE user_id = $19`,
        [
          data.emailNotifications ?? true,
          data.emailTransactions ?? true,
          data.emailPromotions ?? false,
          data.emailSecurity ?? true,
          data.emailNewsletter ?? false,
          data.pushNotifications ?? true,
          data.pushTransactions ?? true,
          data.pushSecurity ?? true,
          data.pushReminders ?? true,
          data.smsNotifications ?? false,
          data.smsTransactions ?? false,
          data.smsSecurity ?? true,
          data.inAppNotifications ?? true,
          data.inAppTransactions ?? true,
          data.inAppSecurity ?? true,
          data.inAppPromotions ?? false,
          data.marketingEmails ?? false,
          data.shareData ?? false,
          payload.userId
        ]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
