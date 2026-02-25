export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  twoFactorEnabled: boolean
  createdAt: Date
  lastLogin?: Date
  accountCount?: number
}

export interface SystemStats {
  totalUsers: number
  totalAccounts: number
  totalTransactions: number
  totalCards: number
  totalBills: number
  totalInvestments: number
  totalDeposits: number
  totalWithdrawals: number
  pendingRequests: number
  supportTickets: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
    userId?: string
    userName?: string
  }>
}

export interface ManagedUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  twoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
  accounts: ManagedAccount[]
  cards: ManagedCard[]
  bills: ManagedBill[]
  investments: ManagedInvestment[]
}

export interface ManagedAccount {
  id: string
  name: string
  type: string
  balance: number
  accountNumber: string
  status: string
  createdAt: Date
  transactionCount?: number
}

export interface ManagedCard {
  id: string
  type: string
  brand: string
  lastFour: string
  status: string
  expiryMonth: number
  expiryYear: number
  createdAt: Date
}

export interface ManagedBill {
  id: string
  company: string
  amount: number
  dueDate: Date
  status: string
  autoPay: boolean
  createdAt: Date
}

export interface ManagedInvestment {
  id: string
  symbol: string
  name: string
  type: string
  quantity: number
  currentPrice: number
  totalValue: number
  createdAt: Date
}

export interface AdminAction {
  id: string
  adminId: string
  adminName: string
  action: string
  targetType: string
  targetId: string
  details: string
  timestamp: Date
}

export interface SupportTicketSummary {
  id: string
  userId: string
  userName: string
  subject: string
  status: string
  priority: string
  createdAt: Date
  lastUpdated: Date
}
