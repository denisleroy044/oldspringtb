// Simple mock - no database needed
export const prisma = null

// Mock data functions
export const mockAccounts = [
  {
    id: '1',
    name: 'Primary Checking',
    type: 'CHECKING',
    balance: 5280.42,
    accountNumber: '****1234',
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'High-Yield Savings',
    type: 'SAVINGS',
    balance: 12750.89,
    accountNumber: '****5678',
    status: 'ACTIVE'
  }
]

export const mockTransactions = [
  {
    id: '1',
    date: new Date('2024-03-15'),
    description: 'Salary Deposit',
    amount: 3500.00,
    type: 'CREDIT',
    category: 'Income',
    accountId: '1',
    status: 'COMPLETED'
  }
]
