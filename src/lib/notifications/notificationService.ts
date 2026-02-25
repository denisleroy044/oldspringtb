export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  priority: 'low' | 'medium' | 'high'
  read: boolean
  link?: string
  createdAt: Date
}

class NotificationService {
  private notifications: Notification[] = []

  // Get all notifications for a user
  getUserNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Get unread notifications count
  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length
  }

  // Add a notification
  addNotification(userId: string, data: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'read'>): Notification {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...data,
      read: false,
      createdAt: new Date()
    }
    this.notifications.push(notification)
    return notification
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: string): void {
    this.notifications
      .filter(n => n.userId === userId)
      .forEach(n => n.read = true)
  }

  // Delete a notification
  deleteNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      this.notifications.splice(index, 1)
    }
  }

  // Clear all notifications for a user
  clearAllNotifications(userId: string): void {
    this.notifications = this.notifications.filter(n => n.userId !== userId)
  }

  // Generate system notifications for a user
  generateSystemNotifications(userId: string): void {
    // Welcome notification for new users
    this.addNotification(userId, {
      title: '👋 Welcome to Oldspring Trust!',
      message: 'We\'re excited to have you on board. Explore our features and let us know if you need any help.',
      type: 'info',
      priority: 'medium'
    })

    // Security tip
    this.addNotification(userId, {
      title: '🔐 Enable Two-Factor Authentication',
      message: 'Protect your account by enabling 2FA in your security settings.',
      type: 'warning',
      priority: 'high'
    })

    // Feature announcement
    this.addNotification(userId, {
      title: '✨ New Feature: Real-time Market Data',
      message: 'Now you can track stocks, crypto, and ETFs in real-time with our new market dashboard.',
      type: 'info',
      priority: 'low'
    })
  }

  // Add a transaction notification
  addTransactionNotification(userId: string, transaction: { type: string; amount: number }): void {
    this.addNotification(userId, {
      title: `💰 ${transaction.type} Notification`,
      message: `A ${transaction.type.toLowerCase()} of $${transaction.amount.toFixed(2)} has been processed.`,
      type: transaction.type === 'credit' ? 'success' : 'info',
      priority: 'medium'
    })
  }

  // Add a security alert
  addSecurityAlert(userId: string, message: string): void {
    this.addNotification(userId, {
      title: '🔒 Security Alert',
      message,
      type: 'error',
      priority: 'high'
    })
  }
}

// Export a singleton instance
export const notificationService = new NotificationService()
