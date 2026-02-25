export interface Biller {
  id: string
  name: string
  category: 'utilities' | 'phone' | 'internet' | 'streaming' | 'insurance' | 'credit' | 'other'
  logo: string
  accountNumberPattern?: string
  paymentMethods: ('bank' | 'card')[]
}

export interface ScheduledBill {
  id: string
  userId: string
  billerId: string
  billerName: string
  billerLogo: string
  accountNumber: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  paymentMethod: 'bank' | 'card'
  autoPay: boolean
  reminderDays: number
  paidAt?: string
  createdAt: string
}

export interface BillPayment {
  id: string
  userId: string
  billId?: string
  billerName: string
  amount: number
  accountNumber: string
  status: 'pending' | 'completed' | 'failed'
  paymentMethod: 'bank' | 'card'
  transactionId?: string
  paidAt: string
}

export interface RecurringBill {
  id: string
  userId: string
  billerId: string
  billerName: string
  amount: number
  frequency: 'monthly' | 'quarterly' | 'yearly'
  dayOfMonth: number
  accountNumber: string
  active: boolean
  nextPaymentDate: string
}
