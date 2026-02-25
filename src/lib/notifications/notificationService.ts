import { Notification, NotificationPreferences } from '@/types/notifications'

// In-memory storage (use Redis/DB in production)
const notifications: Map<string, Notification[]> = new Map()
const userPreferences: Map<string, NotificationPreferences> = new Map()

// Default preferences
const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  transactionAlerts: true,
  loginAlerts: true,
  promoAlerts: false,
  securityAlerts: true,
  marketingEmails: false
}

export class NotificationService {
  
  // Get user notifications
  static getUserNotifications(userId: string): Notification[] {
    return notifications.get(userId) || []
  }

  // Get unread count
  static getUnreadCount(userId: string): number {
    const userNotifications = notifications.get(userId) || []
    return userNotifications.filter(n => !n.read).length
  }

  // Add notification
  static addNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    }

    const userNotifications = notifications.get(userId) || []
    userNotifications.unshift(newNotification)
    notifications.set(userId, userNotifications)

    // In production, also send push/email based on preferences
    this.sendNotification(userId, newNotification)

    return newNotification
  }

  // Mark as read
  static markAsRead(userId: string, notificationId: string): void {
    const userNotifications = notifications.get(userId) || []
    const notification = userNotifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      notifications.set(userId, userNotifications)
    }
  }

  // Mark all as read
  static markAllAsRead(userId: string): void {
    const userNotifications = notifications.get(userId) || []
    userNotifications.forEach(n => n.read = true)
    notifications.set(userId, userNotifications)
  }

  // Delete notification
  static deleteNotification(userId: string, notificationId: string): void {
    const userNotifications = notifications.get(userId) || []
    const filtered = userNotifications.filter(n => n.id !== notificationId)
    notifications.set(userId, filtered)
  }

  // Clear all notifications
  static clearAll(userId: string): void {
    notifications.set(userId, [])
  }

  // Get user preferences
  static getPreferences(userId: string): NotificationPreferences {
    return userPreferences.get(userId) || { ...defaultPreferences }
  }

  // Update preferences
  static updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): NotificationPreferences {
    const current = this.getPreferences(userId)
    const updated = { ...current, ...preferences }
    userPreferences.set(userId, updated)
    return updated
  }

  // Send notification (simulated)
  private static sendNotification(userId: string, notification: Notification): void {
    console.log(`📨 Notification sent to user ${userId}:`, notification)
    
    // In production, this would:
    // - Send push notification via Firebase/OneSignal
    // - Send email via SendGrid/Amazon SES
    // - Send SMS via Twilio
    // - WebSocket push for real-time updates
  }

  // Generate system notifications
  static generateSystemNotifications(userId: string): void {
    // Welcome notification for new users
    this.addNotification(userId, {
      title: '👋 Welcome to Oldspring Trust!',
      message: 'We\'re excited to have you on board. Explore our features and let us know if you need any help.',
      type: 'info',
      priority: 'medium'
    })

    // Security tip
    this.addNotification(userId, {
      title: '🔒 Security Tip',
      message: 'Enable two-factor authentication for enhanced account security.',
      type: 'warning',
      priority: 'medium',
      actionUrl: '/dashboard/account#security',
      actionText: 'Enable Now'
    })

    // Mobile app
    this.addNotification(userId, {
      title: '📱 Mobile Banking',
      message: 'Download our mobile app for banking on the go.',
      type: 'info',
      priority: 'low',
      actionUrl: '/mobile-app',
      actionText: 'Learn More'
    })
  }

  // Transaction notification
  static notifyTransaction(userId: string, type: 'credit' | 'debit', amount: number, description: string): void {
    this.addNotification(userId, {
      title: type === 'credit' ? '💰 Money Received' : '💸 Money Sent',
      message: `${type === 'credit' ? '+' : '-'}$${amount.toFixed(2)} - ${description}`,
      type: 'transaction',
      priority: 'high',
      metadata: {
        amount,
        transactionId: `tx_${Date.now()}`
      }
    })
  }

  // Login notification
  static notifyLogin(userId: string, device: string, location: string): void {
    this.addNotification(userId, {
      title: '🔐 New Login Detected',
      message: `Signed in from ${device} in ${location}`,
      type: 'login',
      priority: 'medium',
      metadata: { device, location }
    })
  }

  // Admin notification
  static notifyFromAdmin(userId: string, title: string, message: string, priority: NotificationPriority = 'medium'): void {
    this.addNotification(userId, {
      title,
      message,
      type: 'alert',
      priority,
      actionUrl: '/support',
      actionText: 'Contact Support'
    })
  }
}

// Initialize with sample data for demo users
export function initializeSampleNotifications(userId: string) {
  // Clear existing
  notifications.set(userId, [])

  // Add sample notifications
  const now = Date.now()
  const sampleNotifications: Omit<Notification, 'id' | 'createdAt' | 'read'>[] = [
    {
      title: '💳 Card Transaction',
      message: 'Your card was used for a purchase at Amazon - $49.99',
      type: 'transaction',
      priority: 'medium'
    },
    {
      title: '✅ Transfer Completed',
      message: 'Your transfer of $500 to John Doe has been completed',
      type: 'success',
      priority: 'high'
    },
    {
      title: '🔔 System Update',
      message: 'We\'ve added new security features to protect your account',
      type: 'info',
      priority: 'low'
    },
    {
      title: '⚠️ Unusual Activity',
      message: 'We detected a login from an unrecognized device',
      type: 'warning',
      priority: 'urgent'
    },
    {
      title: '💰 Dividend Payment',
      message: 'You received $25.50 in dividend payments',
      type: 'success',
      priority: 'medium'
    }
  ]

  sampleNotifications.forEach(notif => {
    NotificationService.addNotification(userId, notif)
  })
}
