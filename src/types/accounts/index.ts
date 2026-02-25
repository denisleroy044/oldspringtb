export type AccountType = 'checking' | 'savings' | 'money_market' | 'cd'

export interface BankAccount {
  id: string
  userId: string
  type: AccountType
  accountNumber: string
  accountName: string
  balance: number
  status: 'active' | 'pending' | 'closed' | 'frozen'
  interestRate?: number
  maturityDate?: string // For CDs
  termMonths?: number // For CDs
  monthlyFee?: number
  minimumBalance?: number
  transactionLimit?: number
  apy?: number // Annual Percentage Yield
  features: string[]
  createdAt: string
  lastTransactionAt: string
  isPrimary?: boolean
}

export interface AccountProduct {
  id: string
  type: AccountType
  name: string
  description: string
  interestRate: number
  minimumDeposit: number
  monthlyFee: number
  features: string[]
  requirements: string[]
  icon: string
  color: string
  gradient: string
}

export interface AccountTransaction {
  id: string
  accountId: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'interest' | 'fee'
  amount: number
  balance: number
  description: string
  createdAt: string
  status: 'completed' | 'pending' | 'failed'
}
