import { Biller, ScheduledBill, BillPayment, RecurringBill } from '@/types/bills'
import { addUserNotification } from '@/lib/auth/authService'

// Mock billers
export const billers: Biller[] = [
  {
    id: 'biller1',
    name: 'Electric Company',
    category: 'utilities',
    logo: '⚡',
    accountNumberPattern: 'Account number on your bill',
    paymentMethods: ['bank', 'card']
  },
  {
    id: 'biller2',
    name: 'Water Works',
    category: 'utilities',
    logo: '💧',
    accountNumberPattern: 'Customer ID on your bill',
    paymentMethods: ['bank']
  },
  {
    id: 'biller3',
    name: 'Gas Supply Co',
    category: 'utilities',
    logo: '🔥',
    accountNumberPattern: 'Account number',
    paymentMethods: ['bank', 'card']
  },
  {
    id: 'biller4',
    name: 'Verizon Wireless',
    category: 'phone',
    logo: '📱',
    accountNumberPattern: 'Phone number',
    paymentMethods: ['bank', 'card']
  },
  {
    id: 'biller5',
    name: 'AT&T',
    category: 'phone',
    logo: '📞',
    accountNumberPattern: 'Account number',
    paymentMethods: ['bank', 'card']
  },
  {
    id: 'biller6',
    name: 'Comcast Xfinity',
    category: 'internet',
    logo: '🌐',
    accountNumberPattern: 'Account number',
    paymentMethods: ['bank']
  },
  {
    id: 'biller7',
    name: 'Netflix',
    category: 'streaming',
    logo: '🎬',
    accountNumberPattern: 'Email address',
    paymentMethods: ['card']
  },
  {
    id: 'biller8',
    name: 'Spotify',
    category: 'streaming',
    logo: '🎵',
    accountNumberPattern: 'Username',
    paymentMethods: ['card']
  },
  {
    id: 'biller9',
    name: 'State Farm Insurance',
    category: 'insurance',
    logo: '🛡️',
    accountNumberPattern: 'Policy number',
    paymentMethods: ['bank', 'card']
  },
  {
    id: 'biller10',
    name: 'Capital One',
    category: 'credit',
    logo: '💳',
    accountNumberPattern: 'Credit card number',
    paymentMethods: ['bank']
  }
]

// Load scheduled bills from localStorage
export const loadScheduledBills = (userId: string): ScheduledBill[] => {
  if (typeof window === 'undefined') return []
  
  const key = `bills_${userId}`
  const stored = localStorage.getItem(key)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

// Save scheduled bills
export const saveScheduledBills = (userId: string, bills: ScheduledBill[]) => {
  if (typeof window === 'undefined') return
  const key = `bills_${userId}`
  localStorage.setItem(key, JSON.stringify(bills))
}

// Schedule a new bill
export const scheduleBill = (
  userId: string,
  billerId: string,
  accountNumber: string,
  amount: number,
  dueDate: string,
  paymentMethod: 'bank' | 'card',
  autoPay: boolean = false,
  reminderDays: number = 3
): ScheduledBill => {
  const biller = billers.find(b => b.id === billerId)
  if (!biller) throw new Error('Biller not found')

  const newBill: ScheduledBill = {
    id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    billerId,
    billerName: biller.name,
    billerLogo: biller.logo,
    accountNumber,
    amount,
    dueDate,
    status: 'pending',
    paymentMethod,
    autoPay,
    reminderDays,
    createdAt: new Date().toISOString()
  }

  const bills = loadScheduledBills(userId)
  bills.push(newBill)
  saveScheduledBills(userId, bills)

  // Set reminder notification
  const dueDateObj = new Date(dueDate)
  const reminderDate = new Date(dueDateObj)
  reminderDate.setDate(reminderDate.getDate() - reminderDays)

  // Add notification
  addUserNotification(userId, {
    title: '📅 Bill Scheduled',
    message: `Your ${biller.name} bill of $${amount.toFixed(2)} has been scheduled for ${new Date(dueDate).toLocaleDateString()}`,
    type: 'info'
  })

  return newBill
}

// Pay a bill
export const payBill = (
  userId: string,
  billId: string,
  userBalance: number
): { success: boolean; newBalance: number; message: string } => {
  const bills = loadScheduledBills(userId)
  const billIndex = bills.findIndex(b => b.id === billId)

  if (billIndex === -1) {
    return { success: false, newBalance: userBalance, message: 'Bill not found' }
  }

  const bill = bills[billIndex]

  if (bill.status === 'paid') {
    return { success: false, newBalance: userBalance, message: 'Bill already paid' }
  }

  if (userBalance < bill.amount) {
    return { success: false, newBalance: userBalance, message: 'Insufficient funds' }
  }

  // Update bill status
  bills[billIndex].status = 'paid'
  bills[billIndex].paidAt = new Date().toISOString()
  saveScheduledBills(userId, bills)

  const newBalance = userBalance - bill.amount

  // Add notification
  addUserNotification(userId, {
    title: '✅ Bill Paid',
    message: `Your payment of $${bill.amount.toFixed(2)} to ${bill.billerName} was successful.`,
    type: 'success'
  })

  return {
    success: true,
    newBalance,
    message: 'Bill paid successfully'
  }
}

// Cancel scheduled bill
export const cancelBill = (userId: string, billId: string): boolean => {
  const bills = loadScheduledBills(userId)
  const filtered = bills.filter(b => b.id !== billId)
  saveScheduledBills(userId, filtered)

  addUserNotification(userId, {
    title: '❌ Bill Cancelled',
    message: 'Your scheduled bill has been cancelled.',
    type: 'info'
  })

  return true
}

// Toggle auto-pay
export const toggleAutoPay = (userId: string, billId: string): ScheduledBill | null => {
  const bills = loadScheduledBills(userId)
  const billIndex = bills.findIndex(b => b.id === billId)

  if (billIndex === -1) return null

  bills[billIndex].autoPay = !bills[billIndex].autoPay
  saveScheduledBills(userId, bills)

  addUserNotification(userId, {
    title: bills[billIndex].autoPay ? '🔄 Auto-Pay Enabled' : '⏸️ Auto-Pay Disabled',
    message: `Auto-pay for ${bills[billIndex].billerName} has been ${bills[billIndex].autoPay ? 'enabled' : 'disabled'}.`,
    type: 'info'
  })

  return bills[billIndex]
}

// Get upcoming bills
export const getUpcomingBills = (userId: string): ScheduledBill[] => {
  const bills = loadScheduledBills(userId)
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  return bills
    .filter(b => b.status === 'pending')
    .filter(b => {
      const dueDate = new Date(b.dueDate)
      return dueDate <= thirtyDaysFromNow
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

// Get bill payment history
export const getBillHistory = (userId: string): BillPayment[] => {
  const bills = loadScheduledBills(userId)
  return bills
    .filter(b => b.status === 'paid' && b.paidAt)
    .map(b => ({
      id: `payment_${b.id}`,
      userId: b.userId,
      billId: b.id,
      billerName: b.billerName,
      amount: b.amount,
      accountNumber: b.accountNumber,
      status: 'completed',
      paymentMethod: b.paymentMethod,
      paidAt: b.paidAt || b.dueDate
    }))
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
}
