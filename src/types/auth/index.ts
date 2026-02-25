export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string // In production, this would be hashed
  accountNumber: string
  accountName: string
  accountStatus: 'active' | 'suspended' | 'locked' | 'pending'
  accountType: 'personal' | 'business' | 'premium'
  balance: number
  avatar: string
  createdAt: string
  lastLogin: string
  isAdmin: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'transaction'
  read: boolean
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  message?: string
  token?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}
