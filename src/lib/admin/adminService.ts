import { 
  AdminUser, 
  SystemStats, 
  ManagedUser, 
  ManagedAccount,
  ManagedCard,
  ManagedBill,
  ManagedTransaction,
  SupportTicket,
  AdminNotification,
  SystemAlert 
} from '@/types/admin'
import { loadUsers, saveUsers, addUserNotification } from '@/lib/auth/authService'
import { loadUserAccounts } from '@/lib/accounts/accountService'
import { loadScheduledBills } from '@/lib/bills/billService'

// Mock admin user
export const getAdminUser = (): AdminUser => {
  return {
    id: 'admin1',
    email: 'admin@oldspring.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'super_admin',
    permissions: ['all'],
    lastLogin: new Date().toISOString(),
    avatar: '/assets/img/avatars/admin-avatar.png'
  }
}

// Get system stats
export const getSystemStats = (): SystemStats => {
  const users = loadUsers()
  let totalAccounts = 0
  let totalCards = 0
  let totalBills = 0
  let paidBills = 0
  let pendingBills = 0
  let totalTransactions = 0
  let transactionVolume = 0

  users.forEach(user => {
    const accounts = loadUserAccounts(user.id)
    totalAccounts += accounts.length
    
    // Mock cards count (in real app, would come from card service)
    totalCards += accounts.length // Simplified
    
    const bills = loadScheduledBills(user.id)
    totalBills += bills.length
    paidBills += bills.filter(b => b.status === 'paid').length
    pendingBills += bills.filter(b => b.status === 'pending').length
  })

  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.accountStatus === 'active').length,
    newUsersToday: 0, // Would calculate from createdAt dates
    totalAccounts,
    totalTransactions: 12345, // Mock data
    transactionVolume: 9876543.21,
    pendingTransactions: 43,
    totalCards,
    activeCards: Math.floor(totalCards * 0.8),
    blockedCards: Math.floor(totalCards * 0.1),
    totalBills,
    paidBills,
    pendingBills,
    supportTickets: 12,
    openTickets: 5,
    systemUptime: 99.98,
    lastBackup: new Date().toISOString(),
    serverLoad: 42
  }
}

// Get all users with details
export const getAllUsers = (): ManagedUser[] => {
  const users = loadUsers()
  
  return users.map(user => {
    const accounts = loadUserAccounts(user.id)
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.accountStatus,
      accountType: user.accountType,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      totalBalance,
      accountCount: accounts.length,
      cardCount: accounts.length, // Simplified
      kycStatus: 'verified' // Mock data
    }
  })
}

// Get user details by ID
export const getUserDetails = (userId: string): {
  user: ManagedUser,
  accounts: ManagedAccount[],
  cards: ManagedCard[],
  bills: ManagedBill[],
  transactions: ManagedTransaction[]
} => {
  const users = loadUsers()
  const user = users.find(u => u.id === userId)
  if (!user) throw new Error('User not found')

  const accounts = loadUserAccounts(userId)
  const bills = loadScheduledBills(userId)

  const managedAccounts: ManagedAccount[] = accounts.map(acc => ({
    id: acc.id,
    userId: acc.userId,
    userName: `${user.firstName} ${user.lastName}`,
    accountNumber: acc.accountNumber,
    accountName: acc.accountName,
    type: acc.type,
    balance: acc.balance,
    status: acc.status,
    interestRate: acc.interestRate,
    maturityDate: acc.maturityDate,
    createdAt: acc.createdAt,
    lastTransaction: acc.lastTransactionAt
  }))

  const managedBills: ManagedBill[] = bills.map(bill => ({
    id: bill.id,
    userId: bill.userId,
    userName: `${user.firstName} ${user.lastName}`,
    billerName: bill.billerName,
    amount: bill.amount,
    dueDate: bill.dueDate,
    status: bill.status,
    autoPay: bill.autoPay,
    paidAt: bill.paidAt
  }))

  // Mock cards
  const managedCards: ManagedCard[] = accounts.map((acc, index) => ({
    id: `card_${index}`,
    userId: acc.userId,
    userName: `${user.firstName} ${user.lastName}`,
    cardNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
    last4: Math.floor(1000 + Math.random() * 9000).toString(),
    type: 'visa',
    status: 'active',
    limit: 10000,
    spent: Math.floor(Math.random() * 5000),
    issuedAt: acc.createdAt,
    expiryDate: '05/28'
  }))

  // Mock transactions
  const managedTransactions: ManagedTransaction[] = [
    {
      id: 'tx1',
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      type: 'deposit',
      amount: 1500.00,
      status: 'completed',
      description: 'Salary deposit',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx2',
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      type: 'transfer',
      amount: 250.00,
      status: 'completed',
      description: 'Transfer to savings',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.accountStatus,
      accountType: user.accountType,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
      accountCount: accounts.length,
      cardCount: accounts.length,
      kycStatus: 'verified'
    },
    accounts: managedAccounts,
    cards: managedCards,
    bills: managedBills,
    transactions: managedTransactions
  }
}

// Update user
export const updateUser = (userId: string, updates: Partial<ManagedUser>): ManagedUser => {
  const users = loadUsers()
  const index = users.findIndex(u => u.id === userId)
  
  if (index === -1) throw new Error('User not found')
  
  users[index] = { ...users[index], ...updates }
  saveUsers(users)
  
  return getAllUsers().find(u => u.id === userId)!
}

// Update user status
export const updateUserStatus = (userId: string, status: ManagedUser['status'], reason?: string): void => {
  const users = loadUsers()
  const index = users.findIndex(u => u.id === userId)
  
  if (index !== -1) {
    users[index].accountStatus = status
    saveUsers(users)
    
    addUserNotification(userId, {
      title: `Account ${status}`,
      message: `Your account has been ${status}. ${reason ? `Reason: ${reason}` : ''}`,
      type: status === 'active' ? 'success' : 'warning'
    })
  }
}

// Freeze/unfreeze account
export const toggleAccountFreeze = (userId: string, accountId: string, freeze: boolean): void => {
  const accounts = loadUserAccounts(userId)
  const account = accounts.find(a => a.id === accountId)
  
  if (account) {
    account.status = freeze ? 'frozen' : 'active'
    // Save accounts back to storage
    localStorage.setItem(`accounts_${userId}`, JSON.stringify(accounts))
    
    addUserNotification(userId, {
      title: freeze ? '🔒 Account Frozen' : '🔓 Account Unfrozen',
      message: `Your account ${account.accountName} has been ${freeze ? 'frozen' : 'unfrozen'}.`,
      type: freeze ? 'warning' : 'info'
    })
  }
}

// Block/unblock card
export const toggleCardBlock = (userId: string, cardId: string, block: boolean): void => {
  addUserNotification(userId, {
    title: block ? '💳 Card Blocked' : '💳 Card Unblocked',
    message: `Your card has been ${block ? 'blocked' : 'unblocked'}.`,
    type: block ? 'warning' : 'info'
  })
}

// Get all support tickets
export const getSupportTickets = (): SupportTicket[] => {
  return [
    {
      id: 'ticket1',
      userId: '1',
      userName: 'John Doe',
      subject: 'Cannot access my account',
      category: 'technical',
      status: 'open',
      priority: 'high',
      description: 'I keep getting an error when trying to login',
      messages: [
        {
          id: 'msg1',
          senderId: '1',
          senderName: 'John Doe',
          senderType: 'user',
          message: 'I cannot login to my account. It says "Invalid credentials" even though I know my password is correct.',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ticket2',
      userId: '2',
      userName: 'Jane Smith',
      subject: 'Transaction failed',
      category: 'transaction',
      status: 'in_progress',
      priority: 'medium',
      description: 'My transfer of $500 failed',
      messages: [
        {
          id: 'msg2',
          senderId: '2',
          senderName: 'Jane Smith',
          senderType: 'user',
          message: 'I tried to transfer $500 but it says insufficient funds. I have enough money.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'msg3',
          senderId: 'admin1',
          senderName: 'Support Agent',
          senderType: 'admin',
          message: 'I\'m looking into this now. Can you confirm your account number?',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

// Update ticket
export const updateTicket = (ticketId: string, status: SupportTicket['status'], message?: string): SupportTicket => {
  const tickets = getSupportTickets()
  const ticket = tickets.find(t => t.id === ticketId)
  
  if (ticket) {
    ticket.status = status
    ticket.updatedAt = new Date().toISOString()
    
    if (message) {
      ticket.messages.push({
        id: `msg_${Date.now()}`,
        senderId: 'admin1',
        senderName: 'Support Agent',
        senderType: 'admin',
        message,
        createdAt: new Date().toISOString()
      })
    }
    
    if (status === 'resolved') {
      ticket.resolvedAt = new Date().toISOString()
    }
  }
  
  return ticket!
}

// Send bulk notification
export const sendBulkNotification = (
  notification: Omit<AdminNotification, 'id' | 'createdAt' | 'status'>,
  adminId: string
): AdminNotification => {
  const newNotification: AdminNotification = {
    ...notification,
    id: `notif_${Date.now()}`,
    status: 'sent',
    createdAt: new Date().toISOString()
  }

  // Send to target users
  const users = loadUsers()
  let targetUsers: string[] = []

  if (notification.targetType === 'all') {
    targetUsers = users.map(u => u.id)
  } else if (notification.targetType === 'specific' && notification.targetUserIds) {
    targetUsers = notification.targetUserIds
  }

  targetUsers.forEach(userId => {
    addUserNotification(userId, {
      title: notification.title,
      message: notification.message,
      type: notification.type === 'critical' ? 'warning' : 
             notification.type === 'promo' ? 'info' : notification.type
    })
  })

  return newNotification
}

// Get system alerts
export const getSystemAlerts = (): SystemAlert[] => {
  return [
    {
      id: 'alert1',
      severity: 'low',
      component: 'Database',
      message: 'Database backup completed successfully',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      acknowledged: true,
      acknowledgedBy: 'admin'
    },
    {
      id: 'alert2',
      severity: 'medium',
      component: 'API Gateway',
      message: 'Increased latency detected (235ms)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: false
    },
    {
      id: 'alert3',
      severity: 'high',
      component: 'Authentication Service',
      message: 'Multiple failed login attempts detected',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      acknowledged: false
    }
  ]
}

// Acknowledge alert
export const acknowledgeAlert = (alertId: string, adminId: string): void => {
  console.log(`Alert ${alertId} acknowledged by ${adminId}`)
}
