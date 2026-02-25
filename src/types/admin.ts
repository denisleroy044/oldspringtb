export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'super_admin' | 'admin' | 'support' | 'analyst'
  permissions: string[]
  lastLogin?: string
  avatar?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalTransactions: number
  transactionVolume: number
  pendingTransactions: number
  totalCards: number
  activeCards: number
  blockedCards: number
  systemUptime: number
  lastBackup: string
  serverLoad: number
}

export interface FullUserProfile {
  id: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    ssn: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  accountInfo: {
    username: string
    accountNumber: string
    accountType: 'personal' | 'business' | 'premium'
    accountStatus: 'active' | 'suspended' | 'locked' | 'pending' | 'closed'
    createdAt: string
    lastLogin: string
    lastLoginIp: string
    loginAttempts: number
    twoFactorEnabled: boolean
  }
  financialInfo: {
    personalBalance: number
    checkingBalance: number
    savingsBalance: number
    totalBalance: number
    creditLimit: number
    availableCredit: number
    monthlySpending: number
    monthlyIncome: number
  }
  cards: UserCard[]
  recentTransactions: UserTransaction[]
  security: {
    lastPasswordChange: string
    securityQuestions: boolean
    trustedDevices: TrustedDevice[]
    loginHistory: LoginRecord[]
  }
  preferences: {
    language: string
    currency: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  kycStatus: 'verified' | 'pending' | 'unverified' | 'rejected'
  riskScore: number
  notes: AdminNote[]
}

export interface UserCard {
  id: string
  type: 'visa' | 'mastercard' | 'amex'
  last4: string
  expiry: string
  status: 'active' | 'blocked' | 'expired'
  limit: number
  spent: number
  issuedAt: string
}

export interface UserTransaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed' | 'flagged'
  category: string
  merchant: string
  accountFrom: string
  accountTo: string
  metadata?: any
}

export interface TrustedDevice {
  id: string
  deviceName: string
  deviceType: string
  browser: string
  os: string
  ip: string
  location: string
  lastUsed: string
  trusted: boolean
}

export interface LoginRecord {
  id: string
  timestamp: string
  ip: string
  location: string
  device: string
  browser: string
  success: boolean
  twoFactorUsed: boolean
}

export interface AdminNote {
  id: string
  adminId: string
  adminName: string
  content: string
  createdAt: string
  type: 'note' | 'warning' | 'flag'
}

export interface BulkNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'critical' | 'promo'
  targetType: 'all' | 'specific' | 'segment'
  targetUserIds?: string[]
  targetSegment?: {
    accountType?: string[]
    status?: string[]
    minBalance?: number
    maxBalance?: number
    lastActive?: string
  }
  scheduledFor?: string
  expiresAt?: string
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  stats?: {
    sent: number
    opened: number
    clicked: number
  }
  createdAt: string
  createdBy: string
}

export interface AdminTransaction {
  id: string
  userId: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  category: string
  accountType: 'personal' | 'checking' | 'savings'
  status: 'completed' | 'pending' | 'failed'
  createdBy: string
  createdAt: string
  notes?: string
}
