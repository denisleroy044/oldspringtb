export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'super_admin' | 'admin' | 'support' | 'analyst'
  permissions: string[]
  lastLogin?: string
  avatar?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalAccounts: number
  totalTransactions: number
  transactionVolume: number
  pendingTransactions: number
  totalCards: number
  activeCards: number
  blockedCards: number
  totalBills: number
  paidBills: number
  pendingBills: number
  supportTickets: number
  openTickets: number
  systemUptime: number
  lastBackup: string
  serverLoad: number
}

export interface ManagedUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'active' | 'suspended' | 'locked' | 'pending'
  accountType: 'personal' | 'business' | 'premium'
  createdAt: string
  lastLogin: string
  totalBalance: number
  accountCount: number
  cardCount: number
  reports?: number
  kycStatus: 'verified' | 'pending' | 'unverified'
}

export interface ManagedAccount {
  id: string
  userId: string
  userName: string
  accountNumber: string
  accountName: string
  type: 'checking' | 'savings' | 'money_market' | 'cd'
  balance: number
  status: 'active' | 'frozen' | 'closed'
  interestRate?: number
  maturityDate?: string
  createdAt: string
  lastTransaction: string
}

export interface ManagedCard {
  id: string
  userId: string
  userName: string
  cardNumber: string
  last4: string
  type: 'visa' | 'mastercard' | 'amex' | 'discover'
  status: 'active' | 'blocked' | 'expired'
  limit: number
  spent: number
  issuedAt: string
  expiryDate: string
}

export interface ManagedBill {
  id: string
  userId: string
  userName: string
  billerName: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'failed'
  autoPay: boolean
  paidAt?: string
}

export interface ManagedTransaction {
  id: string
  userId: string
  userName: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  description: string
  createdAt: string
  metadata?: any
}

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  subject: string
  category: 'account' | 'transaction' | 'card' | 'technical' | 'billing' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string
  messages: TicketMessage[]
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface TicketMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'user' | 'admin' | 'system'
  message: string
  attachments?: string[]
  createdAt: string
}

export interface AdminNotification {
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

export interface SystemAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  component: string
  message: string
  timestamp: string
  acknowledged: boolean
  acknowledgedBy?: string
}
