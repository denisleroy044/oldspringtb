export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  avatar?: string
  twoFactorEnabled: boolean
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

// Mock user data (in production, this would come from your database)
let currentUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@oldspring.com',
  role: 'USER',
  twoFactorEnabled: false,
  notificationPreferences: {
    email: true,
    push: true,
    sms: false
  }
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  // In production, this would update the database
  currentUser = { ...currentUser, ...data }
  return currentUser
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  console.log('Password changed:', { oldPassword, newPassword })
  return true
}

export async function toggleTwoFactor(enabled: boolean): Promise<boolean> {
  currentUser.twoFactorEnabled = enabled
  return enabled
}

export async function updateNotificationPreferences(prefs: any): Promise<any> {
  currentUser.notificationPreferences = prefs
  return prefs
}

export async function updateAvatar(file: File): Promise<{ url: string }> {
  // In production, this would upload to cloud storage
  return { url: '/avatars/default.png' }
}

export async function addUserNotification(userId: string, notification: any): Promise<void> {
  console.log('Notification added for user', userId, notification)
}
