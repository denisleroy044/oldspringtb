export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string
  role: 'USER' | 'ADMIN'
  kycStatus: 'pending' | 'verified' | 'rejected'
  isActive: boolean
  createdAt: Date | string
  updatedAt?: Date | string
  balance: number
  accounts?: Account[]
  transactions?: Transaction[]
  transaction_count?: number
  total_deposits?: number
  pending_loans?: number
  pending_grants?: number
  metadata?: Record<string, any>
}

export interface Account {
  id: string
  userId: string
  type: string
  number: string
  balance: number
  currency: string
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN'
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface Transaction {
  id: string
  userId: string
  accountId?: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  reference?: string
  metadata?: Record<string, any>
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface TransactionWithUser extends Transaction {
  userEmail?: string
  userName?: string
  userBalance?: number
  accountNumber?: string
}

export interface DatabaseStats {
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  totalVolume: number
  pendingLoans: number
  pendingGrants: number
  openTickets: number
  activeChats: number
}
