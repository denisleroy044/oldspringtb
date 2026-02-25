import { BankAccount, AccountProduct, AccountTransaction } from '@/types/accounts'
import { addUserNotification } from '@/lib/auth/authService'

// Account products available for opening
export const accountProducts: AccountProduct[] = [
  {
    id: 'checking_basic',
    type: 'checking',
    name: 'Basic Checking',
    description: 'Everyday checking account with no monthly fee',
    interestRate: 0.01,
    minimumDeposit: 25,
    monthlyFee: 0,
    features: [
      'No monthly maintenance fee',
      'Free debit card',
      'Mobile check deposit',
      'Online bill pay',
      'Unlimited transactions'
    ],
    requirements: ['Valid ID', 'Minimum $25 deposit'],
    icon: '💳',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700'
  },
  {
    id: 'checking_interest',
    type: 'checking',
    name: 'Interest Checking',
    description: 'Earn interest on your checking balance',
    interestRate: 0.50,
    minimumDeposit: 500,
    monthlyFee: 10,
    features: [
      '0.50% APY on balances over $500',
      'Free checks',
      'ATM fee reimbursements',
      'Premium debit card',
      'Overdraft protection'
    ],
    requirements: ['Valid ID', 'Minimum $500 deposit', 'Direct deposit required'],
    icon: '💰',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700'
  },
  {
    id: 'savings_regular',
    type: 'savings',
    name: 'Regular Savings',
    description: 'Start saving with competitive interest rates',
    interestRate: 1.25,
    minimumDeposit: 100,
    monthlyFee: 5,
    features: [
      '1.25% APY',
      'No minimum balance',
      '6 withdrawals per month',
      'Automatic savings plans',
      'Compound interest'
    ],
    requirements: ['Valid ID', 'Minimum $100 deposit'],
    icon: '🏦',
    color: 'green',
    gradient: 'from-green-500 to-green-700'
  },
  {
    id: 'savings_high_yield',
    type: 'savings',
    name: 'High-Yield Savings',
    description: 'Maximum growth with premium interest rates',
    interestRate: 2.50,
    minimumDeposit: 1000,
    monthlyFee: 0,
    features: [
      '2.50% APY',
      'No monthly fees',
      'Online only account',
      'FDIC insured',
      'Free transfers'
    ],
    requirements: ['Valid ID', 'Minimum $1,000 deposit', 'Online banking required'],
    icon: '📈',
    color: 'teal',
    gradient: 'from-teal-500 to-teal-700'
  },
  {
    id: 'money_market',
    type: 'money_market',
    name: 'Money Market Account',
    description: 'Higher interest with check writing privileges',
    interestRate: 1.85,
    minimumDeposit: 2500,
    monthlyFee: 15,
    features: [
      '1.85% APY',
      'Check writing capability',
      'Debit card access',
      'Tiered interest rates',
      'Up to 6 transfers/month'
    ],
    requirements: ['Valid ID', 'Minimum $2,500 deposit', 'Good credit score'],
    icon: '📊',
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-700'
  },
  {
    id: 'cd_12month',
    type: 'cd',
    name: '12-Month CD',
    description: 'Fixed rate certificate of deposit',
    interestRate: 3.25,
    minimumDeposit: 500,
    monthlyFee: 0,
    features: [
      '3.25% APY guaranteed',
      '12-month term',
      'FDIC insured',
      'Interest compounded daily',
      'Early withdrawal penalty applies'
    ],
    requirements: ['Valid ID', 'Minimum $500 deposit', 'Funds available for full term'],
    icon: '⏰',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-700'
  },
  {
    id: 'cd_24month',
    type: 'cd',
    name: '24-Month CD',
    description: 'Long-term savings with higher rates',
    interestRate: 3.75,
    minimumDeposit: 500,
    monthlyFee: 0,
    features: [
      '3.75% APY',
      '24-month term',
      'Higher rate for longer commitment',
      'Renewal options',
      'Grace period at maturity'
    ],
    requirements: ['Valid ID', 'Minimum $500 deposit', 'Long-term savings goal'],
    icon: '📅',
    color: 'red',
    gradient: 'from-red-500 to-red-700'
  }
]

// Generate account number
const generateAccountNumber = (type: string): string => {
  const prefix = type === 'checking' ? '10' : 
                 type === 'savings' ? '20' : 
                 type === 'money_market' ? '30' : '40'
  const middle = Math.floor(10000000 + Math.random() * 90000000)
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${middle}${suffix}`
}

// Load user accounts from localStorage
export const loadUserAccounts = (userId: string): BankAccount[] => {
  if (typeof window === 'undefined') return []
  
  const key = `accounts_${userId}`
  const stored = localStorage.getItem(key)
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Create default checking account for new users
  const defaultAccount: BankAccount = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'checking',
    accountNumber: generateAccountNumber('checking'),
    accountName: 'Primary Checking',
    balance: 0,
    status: 'active',
    interestRate: 0.01,
    monthlyFee: 0,
    minimumBalance: 0,
    features: accountProducts[0].features,
    createdAt: new Date().toISOString(),
    lastTransactionAt: new Date().toISOString(),
    isPrimary: true
  }
  
  const accounts = [defaultAccount]
  localStorage.setItem(key, JSON.stringify(accounts))
  return accounts
}

// Save user accounts
export const saveUserAccounts = (userId: string, accounts: BankAccount[]) => {
  if (typeof window === 'undefined') return
  const key = `accounts_${userId}`
  localStorage.setItem(key, JSON.stringify(accounts))
}

// Get user accounts
export const getUserAccounts = (userId: string): BankAccount[] => {
  return loadUserAccounts(userId)
}

// Get primary account (usually checking)
export const getPrimaryAccount = (userId: string): BankAccount | undefined => {
  const accounts = loadUserAccounts(userId)
  return accounts.find(a => a.isPrimary) || accounts[0]
}

// Open new account
export const openAccount = (
  userId: string,
  productId: string,
  initialDeposit: number,
  accountName?: string
): { success: boolean; account?: BankAccount; message?: string } => {
  const product = accountProducts.find(p => p.id === productId)
  if (!product) {
    return { success: false, message: 'Invalid account product' }
  }

  if (initialDeposit < product.minimumDeposit) {
    return { success: false, message: `Minimum deposit of $${product.minimumDeposit} required` }
  }

  const accounts = loadUserAccounts(userId)
  
  // Check if user already has this type of account (optional limit)
  const existingType = accounts.filter(a => a.type === product.type)
  if (product.type === 'checking' && existingType.length >= 2) {
    return { success: false, message: 'Maximum 2 checking accounts allowed' }
  }
  if (product.type === 'savings' && existingType.length >= 3) {
    return { success: false, message: 'Maximum 3 savings accounts allowed' }
  }

  const newAccount: BankAccount = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: product.type,
    accountNumber: generateAccountNumber(product.type),
    accountName: accountName || product.name,
    balance: initialDeposit,
    status: 'active',
    interestRate: product.interestRate,
    monthlyFee: product.monthlyFee,
    minimumBalance: product.minimumDeposit,
    features: product.features,
    createdAt: new Date().toISOString(),
    lastTransactionAt: new Date().toISOString(),
    isPrimary: accounts.length === 0 // First account is primary
  }

  if (product.type === 'cd') {
    newAccount.termMonths = product.id === 'cd_12month' ? 12 : 24
    newAccount.maturityDate = new Date(Date.now() + (newAccount.termMonths * 30 * 24 * 60 * 60 * 1000)).toISOString()
  }

  accounts.push(newAccount)
  saveUserAccounts(userId, accounts)

  // Record initial deposit transaction
  recordTransaction(userId, newAccount.id, {
    type: 'deposit',
    amount: initialDeposit,
    balance: initialDeposit,
    description: `Initial deposit for ${newAccount.accountName}`,
    status: 'completed'
  })

  addUserNotification(userId, {
    title: '🏦 Account Opened',
    message: `Your ${newAccount.accountName} has been opened with $${initialDeposit.toFixed(2)}.`,
    type: 'success'
  })

  return { success: true, account: newAccount }
}

// Record transaction
export const recordTransaction = (
  userId: string,
  accountId: string,
  transaction: Omit<AccountTransaction, 'id' | 'accountId' | 'createdAt'>
): AccountTransaction => {
  const key = `transactions_${userId}`
  const stored = localStorage.getItem(key)
  const transactions: AccountTransaction[] = stored ? JSON.parse(stored) : []

  const newTransaction: AccountTransaction = {
    ...transaction,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    accountId,
    createdAt: new Date().toISOString()
  }

  transactions.push(newTransaction)
  localStorage.setItem(key, JSON.stringify(transactions))

  // Update account balance
  const accounts = loadUserAccounts(userId)
  const accountIndex = accounts.findIndex(a => a.id === accountId)
  if (accountIndex !== -1) {
    accounts[accountIndex].balance = transaction.balance
    accounts[accountIndex].lastTransactionAt = new Date().toISOString()
    saveUserAccounts(userId, accounts)
  }

  return newTransaction
}

// Get account transactions
export const getAccountTransactions = (userId: string, accountId: string): AccountTransaction[] => {
  const key = `transactions_${userId}`
  const stored = localStorage.getItem(key)
  const transactions: AccountTransaction[] = stored ? JSON.parse(stored) : []
  return transactions.filter(t => t.accountId === accountId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Transfer between accounts
export const transferBetweenAccounts = (
  userId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description: string = 'Transfer'
): { success: boolean; message?: string } => {
  const accounts = loadUserAccounts(userId)
  const fromAccount = accounts.find(a => a.id === fromAccountId)
  const toAccount = accounts.find(a => a.id === toAccountId)

  if (!fromAccount || !toAccount) {
    return { success: false, message: 'Account not found' }
  }

  if (fromAccount.balance < amount) {
    return { success: false, message: 'Insufficient funds' }
  }

  // Update balances
  fromAccount.balance -= amount
  toAccount.balance += amount
  fromAccount.lastTransactionAt = new Date().toISOString()
  toAccount.lastTransactionAt = new Date().toISOString()

  saveUserAccounts(userId, accounts)

  // Record transactions
  recordTransaction(userId, fromAccountId, {
    type: 'transfer',
    amount: -amount,
    balance: fromAccount.balance,
    description: `Transfer to ${toAccount.accountName}: ${description}`,
    status: 'completed'
  })

  recordTransaction(userId, toAccountId, {
    type: 'transfer',
    amount: amount,
    balance: toAccount.balance,
    description: `Transfer from ${fromAccount.accountName}: ${description}`,
    status: 'completed'
  })

  addUserNotification(userId, {
    title: '💰 Transfer Complete',
    message: `$${amount.toFixed(2)} transferred from ${fromAccount.accountName} to ${toAccount.accountName}`,
    type: 'transaction'
  })

  return { success: true }
}

// Apply monthly interest to savings accounts
export const applyMonthlyInterest = (userId: string): void => {
  const accounts = loadUserAccounts(userId)
  const savingsAccounts = accounts.filter(a => a.type === 'savings' || a.type === 'money_market')

  savingsAccounts.forEach(account => {
    if (account.interestRate && account.balance > 0) {
      const monthlyRate = account.interestRate / 100 / 12
      const interestEarned = account.balance * monthlyRate
      account.balance += interestEarned

      recordTransaction(userId, account.id, {
        type: 'interest',
        amount: interestEarned,
        balance: account.balance,
        description: 'Monthly interest earned',
        status: 'completed'
      })
    }
  })

  saveUserAccounts(userId, accounts)
}

// Close account
export const closeAccount = (
  userId: string,
  accountId: string,
  transferToAccountId?: string
): { success: boolean; message?: string } => {
  const accounts = loadUserAccounts(userId)
  const accountIndex = accounts.findIndex(a => a.id === accountId)

  if (accountIndex === -1) {
    return { success: false, message: 'Account not found' }
  }

  const account = accounts[accountIndex]

  // Check if it's the primary account and there are other accounts
  if (account.isPrimary && accounts.length > 1) {
    // Make another account primary
    const newPrimary = accounts.find(a => a.id !== accountId)
    if (newPrimary) {
      newPrimary.isPrimary = true
    }
  }

  // Transfer remaining balance if specified
  if (account.balance > 0) {
    if (!transferToAccountId) {
      return { success: false, message: 'Please specify where to transfer remaining funds' }
    }

    const transferResult = transferBetweenAccounts(
      userId,
      accountId,
      transferToAccountId,
      account.balance,
      'Account closure transfer'
    )

    if (!transferResult.success) {
      return transferResult
    }
  }

  // Remove account
  accounts.splice(accountIndex, 1)
  saveUserAccounts(userId, accounts)

  addUserNotification(userId, {
    title: '🔒 Account Closed',
    message: `Your ${account.accountName} has been closed successfully.`,
    type: 'info'
  })

  return { success: true }
}
