// Simple in-memory database for development
// This file ONLY creates missing data structures
// It will NOT overwrite your existing database

export interface Transaction {
  id: string
  userId: string
  userEmail?: string
  userName?: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
  accountId?: string
  accountNumber?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  kycStatus: string
  isActive: boolean
  createdAt: string
  accounts: any[]
  transaction_count: number
  total_deposits: number
  pending_loans: number
  pending_grants: number
}

export interface Loan {
  id: string
  userId: string
  amount: number
  purpose: string
  status: string
  createdAt: string
}

export interface Grant {
  id: string
  userId: string
  amount: number
  purpose: string
  status: string
  createdAt: string
}

export interface Ticket {
  id: string
  userId: string
  subject: string
  status: string
  priority: string
  createdAt: string
}

export interface Chat {
  id: string
  userId: string
  status: string
  lastMessage: string
  lastMessageAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

// In-memory storage
let transactions: Transaction[] = []
let loans: Loan[] = []
let grants: Grant[] = []
let tickets: Ticket[] = []
let chats: Chat[] = []
let notifications: Notification[] = []

// Initialize with sample data for transactions
export function initializeDb() {
  if (transactions.length === 0) {
    // Add sample transactions for testing
    transactions.push({
      id: 'tx_001',
      userId: 'user_001',
      userEmail: 'john.doe@example.com',
      userName: 'John Doe',
      type: 'credit',
      amount: 3250.00,
      description: 'Salary Deposit',
      status: 'completed',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: 'acc_001',
      accountNumber: '****1234'
    })

    transactions.push({
      id: 'tx_002',
      userId: 'user_001',
      userEmail: 'john.doe@example.com',
      userName: 'John Doe',
      type: 'debit',
      amount: 15.99,
      description: 'Netflix Subscription',
      status: 'completed',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: 'acc_001',
      accountNumber: '****1234'
    })

    transactions.push({
      id: 'tx_003',
      userId: 'user_002',
      userEmail: 'jane.smith@example.com',
      userName: 'Jane Smith',
      type: 'credit',
      amount: 500.00,
      description: 'Transfer from Savings',
      status: 'pending',
      createdAt: new Date().toISOString(),
      accountId: 'acc_003',
      accountNumber: '****9012'
    })

    // Add sample loans
    loans.push({
      id: 'loan_001',
      userId: 'user_001',
      amount: 15000,
      purpose: 'Home Renovation',
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Add sample grants
    grants.push({
      id: 'grant_001',
      userId: 'user_002',
      amount: 5000,
      purpose: 'Small Business Startup',
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Add sample tickets
    tickets.push({
      id: 'ticket_001',
      userId: 'user_001',
      subject: 'Issue with online banking',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString()
    })

    // Add sample chats
    chats.push({
      id: 'chat_001',
      userId: 'user_002',
      status: 'active',
      lastMessage: 'I need help with my account',
      lastMessageAt: new Date().toISOString()
    })
  }
}

// Initialize on import
initializeDb()

// CRUD Operations - These will work alongside your existing database
export const db = {
  // Transactions
  getTransactions: () => transactions,
  
  getTransactionsByUserId: (userId: string) => transactions.filter(t => t.userId === userId),
  
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    transactions.push(newTransaction)
    return newTransaction
  },

  // Loans
  getLoans: () => loans,
  getPendingLoans: () => loans.filter(l => l.status === 'pending'),
  
  // Grants
  getGrants: () => grants,
  getPendingGrants: () => grants.filter(g => g.status === 'pending'),
  
  // Tickets
  getTickets: () => tickets,
  getOpenTickets: () => tickets.filter(t => t.status === 'open'),
  
  // Chats
  getChats: () => chats,
  getActiveChats: () => chats.filter(c => c.status === 'active'),
  
  // Notifications
  getNotifications: (userId?: string) => {
    if (userId) {
      return notifications.filter(n => n.userId === userId)
    }
    return notifications
  },
  
  // Users - This will try to get users from your existing system
  getUsers: () => {
    // Try to get users from global scope if they exist
    // @ts-ignore
    if (typeof global !== 'undefined' && global.__users) {
      // @ts-ignore
      return global.__users
    }
    return []
  },
  
  getUserById: (id: string) => {
    // @ts-ignore
    if (typeof global !== 'undefined' && global.__users) {
      // @ts-ignore
      return global.__users.find((u: any) => u.id === id)
    }
    return null
  }
}
