import { addUserNotification } from '@/lib/auth/authService'

// Define types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string
  role?: string
  kycStatus?: string
  isActive?: boolean
  createdAt?: string
  balance?: number
  accounts?: any[]
  transaction_count?: number
  total_deposits?: number
  pending_loans?: number
  pending_grants?: number
  transactions?: any[]
}

// In-memory storage for users (since loadUsers doesn't exist)
// This will be populated from your auth service when possible
let users: User[] = []

// Initialize with sample data
const sampleUsers: User[] = [
  {
    id: 'user_001',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    phone: '+1234567890',
    role: 'USER',
    kycStatus: 'verified',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 15250.50,
    accounts: [
      {
        id: 'acc_001',
        type: 'Checking Account',
        number: '****1234',
        balance: 15250.50,
        status: 'ACTIVE'
      }
    ],
    transaction_count: 12,
    total_deposits: 25000,
    pending_loans: 1,
    pending_grants: 0,
    transactions: [
      {
        id: 'tx_001',
        type: 'credit',
        amount: 3250.00,
        description: 'Salary Deposit',
        status: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tx_002',
        type: 'debit',
        amount: 15.99,
        description: 'Netflix Subscription',
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'user_002',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    phone: '+1234567891',
    role: 'USER',
    kycStatus: 'pending',
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 5000.00,
    accounts: [
      {
        id: 'acc_002',
        type: 'Checking Account',
        number: '****9012',
        balance: 5000.00,
        status: 'ACTIVE'
      }
    ],
    transaction_count: 5,
    total_deposits: 5000,
    pending_loans: 0,
    pending_grants: 1,
    transactions: [
      {
        id: 'tx_003',
        type: 'credit',
        amount: 500.00,
        description: 'Transfer from Savings',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ]
  }
]

// Initialize with sample data
users = [...sampleUsers]

// Get all users
export async function getRealUsers() {
  // In a real app, you would fetch from your database
  // For now, return the in-memory users
  return users
}

// Get user by ID
export async function getRealUserById(id: string) {
  return users.find(u => u.id === id) || null
}

// Update user balance
export async function updateRealUserBalance(userId: string, newBalance: number) {
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) return false
  
  // Update user balance
  users[userIndex] = {
    ...users[userIndex],
    balance: newBalance
  }
  
  // Add notification using the existing export
  try {
    await addUserNotification(userId, {
      title: '💰 Balance Updated',
      message: `Your account balance has been updated to $${newBalance.toLocaleString()}.`,
      type: 'info'
    })
  } catch (error) {
    console.error('Error adding notification:', error)
  }
  
  return true
}

// Add transaction to user
export async function addTransactionToUser(userId: string, transaction: any) {
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) return false
  
  // Initialize transactions array if it doesn't exist
  if (!users[userIndex].transactions) {
    users[userIndex].transactions = []
  }
  
  // Create new transaction
  const newTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...transaction,
    createdAt: new Date().toISOString()
  }
  
  // Add transaction
  users[userIndex].transactions.push(newTransaction)
  
  // Update balance
  if (transaction.type === 'credit') {
    users[userIndex].balance = (users[userIndex].balance || 0) + transaction.amount
  } else if (transaction.type === 'debit') {
    users[userIndex].balance = (users[userIndex].balance || 0) - transaction.amount
  }
  
  // Update transaction count
  users[userIndex].transaction_count = (users[userIndex].transaction_count || 0) + 1
  
  // Update total deposits for credits
  if (transaction.type === 'credit') {
    users[userIndex].total_deposits = (users[userIndex].total_deposits || 0) + transaction.amount
  }
  
  // Add notification
  try {
    await addUserNotification(userId, {
      title: transaction.type === 'credit' ? '📥 Funds Received' : '📤 Funds Sent',
      message: `${transaction.type === 'credit' ? 'Received' : 'Sent'} $${transaction.amount.toLocaleString()} - ${transaction.description}`,
      type: transaction.type === 'credit' ? 'success' : 'info'
    })
  } catch (error) {
    console.error('Error adding notification:', error)
  }
  
  return true
}

// Get all transactions
export async function getUserTransactions(userId?: string) {
  let allTransactions: any[] = []
  
  users.forEach(user => {
    if (user.transactions && Array.isArray(user.transactions)) {
      const userTransactions = user.transactions.map(tx => ({
        ...tx,
        userId: user.id,
        userEmail: user.email,
        userName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        userBalance: user.balance
      }))
      allTransactions = [...allTransactions, ...userTransactions]
    }
  })
  
  // Sort by date descending
  allTransactions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  if (userId) {
    return allTransactions.filter(t => t.userId === userId)
  }
  
  return allTransactions
}

// Add a new user (for testing)
export async function addUser(user: Partial<User>) {
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: user.email || `user${users.length + 1}@example.com`,
    firstName: user.firstName || 'New',
    lastName: user.lastName || 'User',
    name: user.name || `${user.firstName || 'New'} ${user.lastName || 'User'}`,
    role: 'USER',
    kycStatus: 'pending',
    isActive: true,
    createdAt: new Date().toISOString(),
    balance: 0,
    accounts: [],
    transaction_count: 0,
    total_deposits: 0,
    pending_loans: 0,
    pending_grants: 0,
    transactions: [],
    ...user
  }
  
  users.push(newUser)
  return newUser
}
