export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'transaction' | 'login' | 'alert' | 'promo'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  read: boolean
  createdAt: string
  expiresAt?: string
  actionUrl?: string
  actionText?: string
  metadata?: {
    amount?: number
    account?: string
    transactionId?: string
    location?: string
    device?: string
  }
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  transactionAlerts: boolean
  loginAlerts: boolean
  promoAlerts: boolean
  securityAlerts: boolean
  marketingEmails: boolean
}
