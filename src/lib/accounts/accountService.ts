// Account service for bank account management

export interface BankAccount {
  id: string
  userId: string
  accountNumber: string
  accountType: 'checking' | 'savings' | 'credit' | 'investment'
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'closed'
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface AccountTransaction {
  id: string
  accountId: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  reference?: string
  counterparty?: string
  category?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

// Mock data
const mockAccounts: BankAccount[] = [
  {
    id: 'acc1',
    userId: '1',
    accountNumber: '****1234',
    accountType: 'checking',
    balance: 5280.42,
    currency: 'USD',
    status: 'active',
    name: 'Primary Checking',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'acc2',
    userId: '1',
    accountNumber: '****5678',
    accountType: 'savings',
    balance: 12750.89,
    currency: 'USD',
    status: 'active',
    name: 'High-Yield Savings',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-03-20')
  }
]

const mockTransactions: AccountTransaction[] = [
  {
    id: 'tx1',
    accountId: 'acc1',
    type: 'deposit',
    amount: 1500.00,
    currency: 'USD',
    description: 'Salary deposit',
    status: 'completed',
    category: 'income',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'tx2',
    accountId: 'acc1',
    type: 'withdrawal',
    amount: 250.00,
    currency: 'USD',
    description: 'ATM withdrawal',
    status: 'completed',
    category: 'cash',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  }
]

// Get all accounts for a user
export const getUserAccounts = async (userId: string): Promise<BankAccount[]> => {
  return mockAccounts.filter(acc => acc.userId === userId)
}

// Get a specific account by ID
export const getAccountById = async (accountId: string): Promise<BankAccount | null> => {
  return mockAccounts.find(acc => acc.id === accountId) || null
}

// Get transactions for an account
export const getAccountTransactions = async (
  accountId: string,
  limit: number = 50,
  offset: number = 0
): Promise<AccountTransaction[]> => {
  return mockTransactions
    .filter(tx => tx.accountId === accountId)
    .slice(offset, offset + limit)
}

// Transfer between accounts
export const transferBetweenAccounts = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; transaction?: AccountTransaction; error?: string }> => {
  try {
    const fromAccount = mockAccounts.find(acc => acc.id === fromAccountId)
    const toAccount = mockAccounts.find(acc => acc.id === toAccountId)

    if (!fromAccount || !toAccount) {
      return { success: false, error: 'Account not found' }
    }

    if (fromAccount.balance < amount) {
      return { success: false, error: 'Insufficient funds' }
    }

    // Create withdrawal transaction
    const withdrawalTx: AccountTransaction = {
      id: `tx${Date.now()}`,
      accountId: fromAccountId,
      type: 'transfer',
      amount: -amount,
      currency: 'USD',
      description: `Transfer to ${toAccount.name}`,
      status: 'completed',
      counterparty: toAccount.name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Create deposit transaction
    const depositTx: AccountTransaction = {
      id: `tx${Date.now() + 1}`,
      accountId: toAccountId,
      type: 'transfer',
      amount: amount,
      currency: 'USD',
      description: `Transfer from ${fromAccount.name}`,
      status: 'completed',
      counterparty: fromAccount.name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Update balances
    fromAccount.balance -= amount
    toAccount.balance += amount

    mockTransactions.push(withdrawalTx, depositTx)

    return { success: true, transaction: withdrawalTx }
  } catch (error) {
    return { success: false, error: 'Transfer failed' }
  }
}

// Create a new account
export const createAccount = async (
  userId: string,
  accountType: BankAccount['accountType'],
  name: string
): Promise<BankAccount> => {
  const newAccount: BankAccount = {
    id: `acc${Date.now()}`,
    userId,
    accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
    accountType,
    balance: 0,
    currency: 'USD',
    status: 'active',
    name,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  mockAccounts.push(newAccount)
  return newAccount
}

// Close an account
export const closeAccount = async (accountId: string): Promise<boolean> => {
  const account = mockAccounts.find(acc => acc.id === accountId)
  if (account) {
    account.status = 'closed'
    account.updatedAt = new Date()
    return true
  }
  return false
}
