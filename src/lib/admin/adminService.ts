import { AdminUser, SystemStats, ManagedAccount, ManagedCard, ManagedBill, ManagedInvestment, AdminAction, SupportTicketSummary } from '@/types/admin'
import { User } from '@/lib/auth/authService'

// Re-export or define ManagedUser locally if needed
export interface ManagedUser extends User {
  accounts: ManagedAccount[]
  cards: ManagedCard[]
  bills: ManagedBill[]
  investments: ManagedInvestment[]
}

// Mock data store
let adminUsers: AdminUser[] = []
let systemStats: SystemStats = {
  totalUsers: 0,
  totalAccounts: 0,
  totalTransactions: 0,
  totalCards: 0,
  totalBills: 0,
  totalInvestments: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  pendingRequests: 0,
  supportTickets: 0,
  recentActivity: []
}
let managedUsers: ManagedUser[] = []
let adminActions: AdminAction[] = []
let supportTickets: SupportTicketSummary[] = []

export async function getAdminUsers(): Promise<AdminUser[]> {
  return adminUsers
}

export async function getSystemStats(): Promise<SystemStats> {
  return systemStats
}

export async function getManagedUsers(): Promise<ManagedUser[]> {
  return managedUsers
}

export async function getAdminActions(): Promise<AdminAction[]> {
  return adminActions
}

export async function getSupportTickets(): Promise<SupportTicketSummary[]> {
  return supportTickets
}

export async function updateManagedUser(userId: string, data: Partial<ManagedUser>): Promise<ManagedUser> {
  const index = managedUsers.findIndex(u => u.id === userId)
  if (index === -1) throw new Error('User not found')
  
  managedUsers[index] = { ...managedUsers[index], ...data }
  return managedUsers[index]
}

export async function deleteManagedUser(userId: string): Promise<boolean> {
  const index = managedUsers.findIndex(u => u.id === userId)
  if (index === -1) return false
  
  managedUsers.splice(index, 1)
  return true
}

export async function createAdminAction(action: Omit<AdminAction, 'id' | 'timestamp'>): Promise<AdminAction> {
  const newAction: AdminAction = {
    ...action,
    id: `action_${Date.now()}`,
    timestamp: new Date()
  }
  adminActions.push(newAction)
  return newAction
}
