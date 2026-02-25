// Admin data service with localStorage persistence

export interface User {
  id: string
  name: string
  email: string
  phone: string
  balance: number
  status: 'active' | 'suspended' | 'locked' | 'pending'
  accountType: 'personal' | 'business' | 'premium'
  createdAt: string
  lastLogin: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  notifications: Notification[]
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
  createdBy: string
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

// Initialize default users
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    balance: 54750.80,
    status: 'active',
    accountType: 'premium',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: new Date().toISOString(),
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    },
    notifications: []
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    balance: 128450.25,
    status: 'active',
    accountType: 'business',
    createdAt: '2024-02-20T14:20:00Z',
    lastLogin: new Date().toISOString(),
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001'
    },
    notifications: []
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '+1 (555) 456-7890',
    balance: 3250.50,
    status: 'suspended',
    accountType: 'personal',
    createdAt: '2024-03-10T11:15:00Z',
    lastLogin: new Date().toISOString(),
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    },
    notifications: []
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    phone: '+1 (555) 234-5678',
    balance: 89230.00,
    status: 'active',
    accountType: 'premium',
    createdAt: '2024-04-05T09:45:00Z',
    lastLogin: new Date().toISOString(),
    address: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    },
    notifications: []
  },
  {
    id: '5',
    name: 'William Brown',
    email: 'william.b@example.com',
    phone: '+1 (555) 876-5432',
    balance: 1250.75,
    status: 'locked',
    accountType: 'personal',
    createdAt: '2024-05-12T13:50:00Z',
    lastLogin: new Date().toISOString(),
    address: {
      street: '654 Maple Ave',
      city: 'Seattle',
      state: 'WA',
      zip: '98101'
    },
    notifications: []
  }
]

// Initialize default transactions
const defaultTransactions: Transaction[] = [
  {
    id: 'tx1',
    userId: '1',
    userName: 'John Doe',
    type: 'debit',
    amount: 49.99,
    description: 'Amazon.com purchase',
    status: 'completed',
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'tx2',
    userId: '1',
    userName: 'John Doe',
    type: 'credit',
    amount: 3500.00,
    description: 'Salary deposit',
    status: 'completed',
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'tx3',
    userId: '2',
    userName: 'Jane Smith',
    type: 'debit',
    amount: 1250.00,
    description: 'Wire transfer',
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  }
]

// Load data from localStorage or use defaults
export const loadUsers = (): User[] => {
  if (typeof window === 'undefined') return defaultUsers
  
  const stored = localStorage.getItem('admin_users')
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem('admin_users', JSON.stringify(defaultUsers))
  return defaultUsers
}

export const loadTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return defaultTransactions
  
  const stored = localStorage.getItem('admin_transactions')
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem('admin_transactions', JSON.stringify(defaultTransactions))
  return defaultTransactions
}

// Save data to localStorage
export const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_users', JSON.stringify(users))
}

export const saveTransactions = (transactions: Transaction[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_transactions', JSON.stringify(transactions))
}

// User management functions
export const updateUser = (userId: string, updates: Partial<User>): User => {
  const users = loadUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index === -1) throw new Error('User not found')
  
  users[index] = { ...users[index], ...updates }
  saveUsers(users)
  
  // Dispatch event for real-time updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: users[index] }))
  }
  
  return users[index]
}

export const updateUserStatus = (userId: string, status: User['status']): User => {
  return updateUser(userId, { status })
}

export const addNotification = (userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Notification => {
  const users = loadUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex === -1) throw new Error('User not found')
  
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    read: false,
    createdAt: new Date().toISOString()
  }
  
  if (!users[userIndex].notifications) {
    users[userIndex].notifications = []
  }
  
  users[userIndex].notifications.unshift(newNotification)
  saveUsers(users)
  
  // Dispatch event for real-time notifications
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('newNotification', { detail: newNotification }))
  }
  
  return newNotification
}

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const transactions = loadTransactions()
  const users = loadUsers()
  
  const newTransaction: Transaction = {
    ...transaction,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  
  transactions.unshift(newTransaction)
  saveTransactions(transactions)
  
  // Update user balance
  const userIndex = users.findIndex(u => u.id === transaction.userId)
  if (userIndex !== -1) {
    const newBalance = transaction.type === 'credit' 
      ? users[userIndex].balance + transaction.amount
      : users[userIndex].balance - transaction.amount
    
    users[userIndex].balance = newBalance
    saveUsers(users)
    
    // Add notification for the user
    addNotification(transaction.userId, {
      title: transaction.type === 'credit' ? '💰 Money Received' : '💸 Money Sent',
      message: `${transaction.type === 'credit' ? '+' : '-'}$${transaction.amount.toFixed(2)} - ${transaction.description}`,
      type: 'transaction'
    })
  }
  
  return newTransaction
}

export const getUserNotifications = (userId: string): Notification[] => {
  const users = loadUsers()
  const user = users.find(u => u.id === userId)
  return user?.notifications || []
}

export const markNotificationAsRead = (userId: string, notificationId: string) => {
  const users = loadUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex === -1) return
  
  const notifIndex = users[userIndex].notifications.findIndex(n => n.id === notificationId)
  if (notifIndex !== -1) {
    users[userIndex].notifications[notifIndex].read = true
    saveUsers(users)
  }
}

// Get unread notification count for a user
export const getUnreadCount = (userId: string): number => {
  const users = loadUsers()
  const user = users.find(u => u.id === userId)
  return user?.notifications?.filter(n => !n.read).length || 0
}

// Stats functions
export const getSystemStats = () => {
  const users = loadUsers()
  const transactions = loadTransactions()
  
  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    lockedUsers: users.filter(u => u.status === 'locked').length,
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    totalBalance: users.reduce((sum, u) => sum + u.balance, 0)
  }
}
