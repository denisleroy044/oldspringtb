export interface Bill {
  id: string
  userId: string
  billerName: string
  accountNumber: string
  amount: number
  dueDate: string
  category: string
  status: 'pending' | 'paid' | 'overdue' | 'scheduled' | 'cancelled'
  autoPay: boolean
  paymentMethod?: 'card' | 'bank'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BillPayment {
  id: string
  userId: string
  billId: string
  billerName: string
  amount: number
  accountNumber: string
  status: 'completed' | 'pending' | 'failed'
  paymentMethod: 'card' | 'bank'
  paidAt: string
}

// Mock data store
let bills: Bill[] = []
let payments: BillPayment[] = []

// Load bills from localStorage or use default
const loadBills = (userId: string): Bill[] => {
  // In a real app, this would be an API call
  const defaultBills: Bill[] = [
    {
      id: '1',
      userId,
      billerName: 'Electric Company',
      accountNumber: '****1234',
      amount: 145.67,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Utilities',
      status: 'pending',
      autoPay: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      userId,
      billerName: 'Water Works',
      accountNumber: '****5678',
      amount: 89.50,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Utilities',
      status: 'pending',
      autoPay: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      userId,
      billerName: 'Internet Provider',
      accountNumber: '****9012',
      amount: 79.99,
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Internet',
      status: 'overdue',
      autoPay: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  return defaultBills
}

export const getUserBills = (userId: string): Bill[] => {
  return loadBills(userId)
}

export const getBillById = (billId: string): Bill | undefined => {
  return bills.find(b => b.id === billId)
}

export const createBill = (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Bill => {
  const newBill: Bill = {
    ...bill,
    id: `bill_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  bills.push(newBill)
  return newBill
}

export const updateBill = (billId: string, updates: Partial<Bill>): Bill | undefined => {
  const index = bills.findIndex(b => b.id === billId)
  if (index === -1) return undefined
  
  bills[index] = { ...bills[index], ...updates, updatedAt: new Date().toISOString() }
  return bills[index]
}

export const deleteBill = (billId: string): boolean => {
  const index = bills.findIndex(b => b.id === billId)
  if (index === -1) return false
  
  bills.splice(index, 1)
  return true
}

export const payBill = (billId: string, paymentMethod: 'card' | 'bank'): BillPayment | undefined => {
  const bill = bills.find(b => b.id === billId)
  if (!bill) return undefined
  
  // Create payment record
  const payment: BillPayment = {
    id: `payment_${Date.now()}`,
    userId: bill.userId,
    billId: bill.id,
    billerName: bill.billerName,
    amount: bill.amount,
    accountNumber: bill.accountNumber,
    status: 'completed',
    paymentMethod,
    paidAt: new Date().toISOString()
  }
  
  payments.push(payment)
  
  // Update bill status
  bill.status = 'paid'
  bill.updatedAt = new Date().toISOString()
  
  return payment
}

export const getBillPayments = (billId: string): BillPayment[] => {
  return payments.filter(p => p.billId === billId)
}

export const getUserPayments = (userId: string): BillPayment[] => {
  return payments.filter(p => p.userId === userId)
}

export const scheduleBill = (bill: Omit<Bill, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Bill => {
  const newBill: Bill = {
    ...bill,
    id: `scheduled_${Date.now()}`,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  bills.push(newBill)
  return newBill
}

export const cancelScheduledBill = (billId: string): boolean => {
  const bill = bills.find(b => b.id === billId)
  if (!bill || bill.status !== 'scheduled') return false
  
  bill.status = 'cancelled'
  bill.updatedAt = new Date().toISOString()
  return true
}

// Mock function to load scheduled bills
const loadScheduledBills = (userId: string): Bill[] => {
  return bills.filter(b => b.userId === userId)
}

export const getBillHistory = (userId: string): BillPayment[] => {
  const userBills = loadScheduledBills(userId)
  return userBills
    .filter(b => b.status === 'paid' && b.updatedAt)
    .map(b => ({
      id: `payment_${b.id}`,
      userId: b.userId,
      billId: b.id,
      billerName: b.billerName,
      amount: b.amount,
      accountNumber: b.accountNumber,
      status: 'completed' as const,
      paymentMethod: b.paymentMethod || 'bank',
      paidAt: b.updatedAt
    }))
}

export const getUpcomingBills = (userId: string): Bill[] => {
  const userBills = loadScheduledBills(userId)
  return userBills.filter(b => b.status === 'pending' || b.status === 'scheduled')
}

export const getOverdueBills = (userId: string): Bill[] => {
  const userBills = loadScheduledBills(userId)
  return userBills.filter(b => b.status === 'overdue')
}
