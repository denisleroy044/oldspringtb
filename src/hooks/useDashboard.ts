'use client'

import { useState, useEffect } from 'react'
import { User, Transaction } from '@/types/dashboard'

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  accountName: 'Johnathan M. Doe',
  accountStatus: 'Premium Member',
  lastLogin: '2024-02-16 09:30 AM',
  avatar: '/assets/img/avatars/default-avatar.png',
  personalAccount: {
    number: '**** 4582 9632 7410',
    balance: 54750.80
  },
  checkingAccount: {
    number: '**** 1122 3344 5566',
    balance: 12350.25
  }
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    accountName: 'Amazon Prime',
    accountNumber: '**** 7890',
    bankName: 'Amazon Payments',
    amount: 14.99,
    status: 'completed',
    date: '2024-02-16',
    type: 'debit'
  },
  {
    id: 2,
    accountName: 'Salary Deposit',
    accountNumber: '**** 1234',
    bankName: 'Employer Corp',
    amount: 3500.00,
    status: 'completed',
    date: '2024-02-15',
    type: 'credit'
  },
  {
    id: 3,
    accountName: 'Netflix Subscription',
    accountNumber: '**** 5678',
    bankName: 'Netflix Inc',
    amount: 15.99,
    status: 'completed',
    date: '2024-02-14',
    type: 'debit'
  },
  {
    id: 4,
    accountName: 'Walmart',
    accountNumber: '**** 9012',
    bankName: 'Walmart',
    amount: 234.56,
    status: 'completed',
    date: '2024-02-13',
    type: 'debit'
  },
  {
    id: 5,
    accountName: 'Transfer to Savings',
    accountNumber: '**** 3456',
    bankName: 'Oldspring Trust',
    amount: 500.00,
    status: 'completed',
    date: '2024-02-12',
    type: 'debit'
  },
  {
    id: 6,
    accountName: 'Dividend Payment',
    accountNumber: '**** 7890',
    bankName: 'Investment Co',
    amount: 125.50,
    status: 'completed',
    date: '2024-02-11',
    type: 'credit'
  }
]

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUser(mockUser)
        setTransactions(mockTransactions)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { user, transactions, loading, error }
}
