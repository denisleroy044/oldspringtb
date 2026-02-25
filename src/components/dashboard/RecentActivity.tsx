'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserTransactions, Transaction } from '@/lib/db/transactionService'
import Link from 'next/link'

export function RecentActivity() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTransactions() {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const data = await getUserTransactions(user.id, 5)
        setTransactions(data)
      } catch (err) {
        console.error('Error loading transactions:', err)
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [user?.id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-deep-teal mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-deep-teal mb-4">Recent Activity</h2>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-deep-teal mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">No recent transactions</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-deep-teal mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'CREDIT' ? '↓' : '↑'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-xs text-gray-500">{formatDate(transaction.date)} • {transaction.category}</p>
              </div>
            </div>
            <span className={`font-medium ${
              transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
          </div>
        ))}
      </div>

      <Link 
        href="/dashboard/transactions"
        className="mt-4 text-sm text-deep-teal hover:text-soft-gold transition-colors inline-block"
      >
        View All Transactions →
      </Link>
    </div>
  )
}
